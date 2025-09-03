import React, { useState } from 'react';
import { Box, Button, Divider, Typography, useTheme } from '@mui/material';
import { BeenhereOutlined } from '@mui/icons-material';
import { styled } from '@mui/system';
import { BoxRow } from './BoxRow';
import { timePresets } from './TImePresets';
import { weatherPresets } from './WeatherPresets';
import { fetchNui } from '@nui/src/utils/fetchNui';

const SectionHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    '& .MuiSvgIcon-root': {
        marginRight: theme.spacing(),
        color: theme.palette.primary.main,
    },
}));

interface PresetViewProps {
    canSubmit: boolean;
    onNavigateToAdvanced: () => void;
}

export const PresetView: React.FC<PresetViewProps> = ({
    canSubmit,
    onNavigateToAdvanced,
}) => {
    const theme = useTheme();
    const [selectedTimePreset, setSelectedTimePreset] = useState<string | null>(null);

    const handleTimePresetClick = (label: string) => {
        setSelectedTimePreset(label);
    };

    const handleSubmit = () => {
        if (selectedTimePreset) {
            fetchNui('setTimePeriod', selectedTimePreset);
        }
        // ...existing code for weather, etc...
    };

    return (
        <>
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                <BoxRow />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, ml: 1.7 }}>
                <SectionHeader sx={{ m: 0 }}>
                    <BeenhereOutlined />
                    <Typography variant="h6" component="h3">
                        Presets
                    </Typography>
                </SectionHeader>
                <Button
                    variant="text"
                    color="primary"
                    onClick={onNavigateToAdvanced}
                    disabled={!canSubmit}
                    sx={{ minWidth: 12, marginRight: 2 }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        More Options
                    </Box>
                </Button>
            </Box>

            {/* Time presets */}
            <Box sx={{ display: 'flex', gap: 1.3, justifyContent: 'center', flexWrap: 'wrap', mt: 1 }}>
                {timePresets.map(({ label, icon, color }) => {
                    const isSelected = selectedTimePreset === label;
                    return (
                        <Box
                            key={label}
                            onClick={() => handleTimePresetClick(label)}
                            sx={{
                                minWidth: 60,
                                px: 2,
                                py: 2,
                                borderRadius: 2,
                                cursor: 'pointer',
                                border: `2px solid ${isSelected ? theme.palette.primary.main : theme.palette.divider}`,
                                backgroundColor: theme.palette.background.paper,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                transition: 'box-shadow 0.2s, border-color 0.2s, background 0.2s',
                                '&:hover': {
                                    backgroundColor: theme.palette.action.hover,
                                    borderColor: theme.palette.primary.main,
                                    boxShadow: 2,
                                },
                            }}
                        >
                            <Box sx={{ fontSize: 36, mb: 1, color }}>
                                {React.createElement(icon, { style: { fontSize: 36, color } })}
                            </Box>
                            <Typography variant='subtitle1' sx={{ color, fontWeight: 500 }}>
                                {label}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>

            {/* Buttons */}
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mt: 2 }}>
                {weatherPresets.map(({ label }) => (
                    <Button
                        key={label}
                        variant="outlined"
                        color="primary"
                        disabled={!canSubmit}
                        sx={{ minWidth: 168 }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'left' }}>
                            {label}
                        </Box>
                    </Button>
                ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'right', mt: 2 }}>
                <Button
                    sx={{
                        color: theme.palette.text.secondary,
                        minWidth: 70, // align with buttons above
                    }}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    color="primary"
                    sx={{
                        minWidth: 90, // align with buttons above
                    }}
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </Box>
        </>
    );
};
