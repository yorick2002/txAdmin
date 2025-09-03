-- local timeScale = 1
local currWeather = ""
local timePeriod = 0
local blackoutState = nil

local weatherTypes = {
    [669657108]   = "BLIZZARD",
    [916995460]   = "CLEAR",
    [1840358669]  = "CLEARING",
    [821931868]   = "CLOUDS",
    [-1750463879] = "EXTRASUNNY",
    [-1368164796] = "FOGGY",
    [-921030142]  = "HALLOWEEN",
    [-1148613331] = "OVERCAST",
    [1420204096]  = "RAIN",
    [282916021]   = "SMOG",
    [603685163]   = "SNOWLIGHT",
    [-1233681761] = "THUNDER",
    [-1429616491] = "XMAS"
}

RegisterSecureNuiCallback('getEnvironmentInfo', function(_, cb)
    local hour = GetClockHours()
    local minute = GetClockMinutes()
    local currTime = string.format("%02d:%02d", hour, minute)

    if not GlobalState.txEnvironment then return end

    local blackoutStatebagValue = GlobalState.txEnvironment.isBlackout

    if IS_REDM then
        local weatherHash = GetCurrWeatherState()
        currWeather = weatherTypes[weatherHash]
    else
        local weatherHash = GetNextWeatherTypeHashName()
        currWeather = weatherTypes[weatherHash]
    end

    cb({
        time = currTime,
        weather = currWeather,
        blackout = blackoutStatebagValue
    })
end)

local function SmoothTimeChange(targetHour, targetMinute, targetSecond, duration)
    local currentHour, currentMinute, currentSecond = GetClockHours(), GetClockMinutes(), GetClockSeconds()

    local function toSeconds(h, m, s)
        return h * 3600 + m * 60 + s
    end

    local function fromSeconds(total)
        local h = math.floor(total / 3600) % 24
        local m = math.floor((total % 3600) / 60)
        local s = math.floor(total % 60)
        return h, m, s
    end

    local startSeconds = toSeconds(currentHour, currentMinute, currentSecond)
    local endSeconds = toSeconds(targetHour, targetMinute, targetSecond)

    if endSeconds < startSeconds then
        endSeconds = endSeconds + 86400
    end

    local startTime = GetGameTimer()
    local endTime = startTime + duration * 1000

    CreateThread(function()
        while true do
            local timeNow = GetGameTimer()
            local progress = math.min((timeNow - startTime) / (endTime - startTime), 1.0)
            local currentSeconds = startSeconds + (endSeconds - startSeconds) * progress

            local hour, minute, second = fromSeconds(currentSeconds)

            if IS_REDM then
                NetworkClockTimeOverride(hour, minute, second)
            else
                NetworkOverrideClockTime(hour, minute, second)
            end

            if progress >= 1.0 then break end
            Wait(0)
        end

        if IS_REDM then
            NetworkClockTimeOverride(targetHour, targetMinute, targetSecond)
        else
            NetworkOverrideClockTime(targetHour, targetMinute, targetSecond)
        end
    end)
end

local timePeriods = {
    Dawn = { 4, 0, 0 },
    Morning = { 6, 0, 0 },
    Afternoon = { 12, 0, 0 },
    Evening = { 18, 0, 0 },
    Night = { 21, 0, 0 }
}

RegisterSecureNuiCallback('setTimePeriod', function(label, cb)
    local time = timePeriods[label]
    if time then
        local timeObj = { hour = time[1], minute = time[2], second = time[3] }
        SmoothTimeChange(timeObj.hour, timeObj.minute, timeObj.second, 15)
        TriggerServerEvent('txsv:req:setEnvironmentSetting', timeObj)
    end
    cb({})
end)

local weatherPresets = {
    Sunny = "EXTRASUNNY",
    Cloudy = "CLOUDS",
    Rainy = "RAIN",
    Thunder = "THUNDER",
    Snowy = "SNOWLIGHT",
    Halloween = "HALLOWEEN"
}

-- TODO: sync between players
RegisterSecureNuiCallback('setWeatherPreset', function(selectedWeatherPreset, cb)
    local weatherType = weatherPresets[selectedWeatherPreset]
    if weatherType then
        SetOverrideWeather(weatherType)
    end
    cb({})
end)

RegisterSecureNuiCallback('setBlackout', function(blackout, cb)
    blackoutState = blackout -- true/false
    TriggerServerEvent("txsv:req:setEnvironmentSetting", blackoutState)
    cb({})
end)


local lastBlackoutState = nil -- keep track across calls

AddStateBagChangeHandler("txEnvironment", "global", function(bag, key, value, reserved, replicated)
    local environmentSettings = value
    local newBlackoutState = environmentSettings.isBlackout
    
    if lastBlackoutState ~= newBlackoutState then
        SetArtificialLightsState(newBlackoutState)
        lastBlackoutState = newBlackoutState
    end

end)

CreateThread(function()
    local attempts = 0
    while GlobalState.txEnvironment == nil and attempts < 60 do
        attempts += 1
        print(GlobalState.txEnvironment)
        Wait(1000)
    end

    if GlobalState.txEnvironment.isBlackout == true then
        blackoutState = GlobalState.txEnvironment.isBlackout
        SetArtificialLightsState(GlobalState.txEnvironment.isBlackout)
    end
end)
