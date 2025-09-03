import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  useTheme,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  FormControl,
  Divider,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { styled } from '@mui/system';
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

interface AdvancedViewProps {
  canSubmit: boolean;
  onNavigateToPresets: () => void;
}

export const AdvancedView: React.FC<AdvancedViewProps> = ({
  canSubmit,
  onNavigateToPresets,
}) => {
  const theme = useTheme();

  const [blackout, setBlackout] = useState(false);

  useEffect(() => {
    fetchNui("getEnvironmentInfo").then(({ blackout }) => {
      setBlackout(blackout)
    }).catch((err) => {
      
    })
  }, []);

  const handleSubmit = () => {
    fetchNui('setBlackout', blackout);
  };

  const weatherTypes = [
    { value: 0, label: 'CLEAR' },
    { value: 0.5, label: 'EXTRASUNNY' },
    { value: 1, label: 'CLOUDS' },
    { value: 2, label: 'OVERCAST' },
    { value: 4, label: 'RAIN' },
    { value: 5, label: 'CLEARING' },
    { value: 6, label: 'THUNDER' },
    { value: 7, label: 'SMOG' },
    { value: 8, label: 'FOGGY' },
    { value: 9, label: 'XMAS' },
    { value: 10, label: 'SNOW' },
    { value: 11, label: 'SNOWLIGHT' },
    { value: 12, label: 'BLIZZARD' },
    { value: 13, label: 'HALLOWEEN' },
    { value: 14, label: 'NEUTRAL' },
    { value: 15, label: 'RAIN_HALLOWEEN' },
    { value: 16, label: 'SNOW_HALLOWEEN' },
  ];

  const durationOptions = [
    { value: 0, label: 'Fast (3s)' },
    { value: 1, label: 'Normal (15s)' },
    { value: 2, label: 'Long (60s)' },
    { value: 3, label: 'Very Long (5 mins)' },
  ]

  return (
    <>
      <Box>
        <SectionHeader sx={{ m: 0 }}>
          <Typography variant="h6" component="h3">
            Weather Type
          </Typography>
        </SectionHeader>
      </Box>

      <Box>
        <FormControl fullWidth size='small' variant='outlined' sx={{ mt: 1 }}>
          <Select
            labelId='weather-type-label'
            id='weather-type-select'
            value={0}
            onChange={() => { }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 250,
                },
              },
            }}
          >
            {weatherTypes.map(({ value, label }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ mt: 2 }}>
        <SectionHeader sx={{ m: 0 }}>
          <Typography variant="h6" component="h3">
            Weather / Time Options
          </Typography>
        </SectionHeader>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Box
          sx={{
            maxHeight: 65,
            px: 1,
            py: 2,
            borderRadius: 2,
            boxShadow: 1,
            backgroundColor: theme.palette.background.paper,
            marginTop: 1,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography sx={{ color: theme.palette.text.primary, fontSize: 18 }}>
              Dynamic Weather
            </Typography>
            <Typography sx={{ color: theme.palette.text.secondary }}>
              Weather changes automatically over time
            </Typography>
          </Box>

          <FormControlLabel
            control={<Switch defaultChecked={false} />}
            label=""
          />
        </Box>

        <Box
          sx={{
            maxHeight: 65,
            px: 1,
            py: 2,
            borderRadius: 2,
            boxShadow: 1,
            backgroundColor: theme.palette.background.paper,
            marginTop: 1,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ color: theme.palette.text.primary, fontSize: 18 }}>
              Electricity Blackout
            </Typography>
            <Typography sx={{ color: theme.palette.text.secondary }}>
              Disables all electrical lighting
            </Typography>
          </Box>


          <FormControlLabel
            control={
              <Switch
                checked={blackout}
                onChange={e => setBlackout(e.target.checked)}
              />
            }
            label=''
          />
        </Box>

        <Box
          sx={{
            maxHeight: 65,
            px: 1,
            py: 2,
            borderRadius: 2,
            boxShadow: 1,
            backgroundColor: theme.palette.background.paper,
            marginTop: 1,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography sx={{ color: theme.palette.text.primary, fontSize: 18 }}>
              Time change duration
            </Typography>
            <Typography sx={{ color: theme.palette.text.secondary }}>
              Duration for time changes in seconds
            </Typography>
          </Box>

          <FormControl fullWidth size='small' variant='outlined' sx={{ maxWidth: 160 }}>
            <Select
              value={0}
              onChange={() => { }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 150,
                  },
                },
              }}
            >
              {durationOptions.map(({ value, label }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={onNavigateToPresets}
          startIcon={<ArrowBack />}
          sx={{ minWidth: 120 }}
        >
          Back
        </Button>
        <Button
          variant="outlined"
          color="primary"
          type="submit"
          disabled={!canSubmit}
          sx={{ minWidth: 120 }}
          onClick={handleSubmit}
        >
          Apply Changes
        </Button>
      </Box>
    </>
  );
};
