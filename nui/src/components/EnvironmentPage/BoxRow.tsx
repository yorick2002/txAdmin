import { Box, Typography, FormControl, MenuItem, Select } from "@mui/material";
import { Clock, Sun } from "lucide-react";
import theme from "@nui/src/styles/theme";
import { useEffect, useState } from "react";
import { fetchNui } from "@nui/src/utils/fetchNui";

export const BoxRow = () => {

    // Environment settings state  
    const [currTime, setCurrTime] = useState('--:--');
    const [currWeather, setCurrWeather] = useState('N/A');
    const [timeSpeed, setTimeSpeed] = useState(0);

    const getEnvInfo = async () => {
        try {
            const { time, weather } = await fetchNui("getEnvironmentInfo");
            setCurrTime(time);
            setCurrWeather(weather);
        } catch (err) {
            setCurrTime('--:--')
            setCurrWeather('N/A');
        }
    }

    useEffect(() => {
        getEnvInfo();
    }, [])

    return (
        <>
            <Box sx={{
                minWidth: 230,
                maxHeight: 75,
                px: 1.5,
                py: 2,
                borderRadius: 2,
                boxShadow: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'left',
                backgroundColor: theme.palette.background.paper,
            }}>

                <Box sx={{ color: theme.palette.text.secondary, fontSize: 15, mb: 1, fontWeight: 500, }}>
                    Current Status
                </Box>
                <Typography variant='subtitle1' sx={{
                    color: theme.palette.primary.main, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1,
                }}
                >
                    <Clock style={{ verticalAlign: 'middle' }} />
                    {currTime}
                </Typography>
                <Typography variant='subtitle1' sx={{
                    color: theme.palette.primary.main, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1,
                }}
                >
                    <Sun style={{ verticalAlign: 'middle' }} />
                    {currWeather}
                </Typography>
            </Box>

            {/* Time speed */}
            <Box sx=
                {{
                    minWidth: 230,
                    px: 1.5,
                    py: 2,
                    borderRadius: 2,
                    boxShadow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'left',
                    backgroundColor: theme.palette.background.paper,
                }}>

                <Box sx={{ color: theme.palette.text.secondary, fontSize: 15, mb: 1, fontWeight: 500 }}>
                    Time Speed
                </Box>
                <FormControl fullWidth size="small" variant="outlined" >
                    <Select
                        labelId="time-speed-label"
                        id="time-speed-select"
                        value={timeSpeed}
                        onChange={(event) => {
                            const value = Number(event.target.value);
                            setTimeSpeed(value);
                            fetchNui('setTimeSpeed', value);
                        }}
                    >
                        <MenuItem value={0}>Stopped</MenuItem>
                        <MenuItem value={0.5}>Slow (0.5x)</MenuItem>
                        <MenuItem value={1}>Normal (1x)</MenuItem>
                        <MenuItem value={2}>Fast (2x)</MenuItem>
                        <MenuItem value={4}>Real-time</MenuItem>
                    </Select>
                </FormControl>
            </Box>
        </>
    );
};
