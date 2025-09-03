RegisterNetEvent("txsv:req:setEnvironmentSetting", function(blackoutState)
    local src = source
    local allow = PlayerHasTxPermission(src, "menu.environment")
    if allow then
        GlobalState.txEnvironment = {
            isBlackout = blackoutState
        }
    end
end)
