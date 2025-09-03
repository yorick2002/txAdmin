import theme from "@nui/src/styles/theme";
import { Sunrise, Sun, Sunset, Moon } from "lucide-react";

export const timePresets = [
    {
        label: 'Dawn',
        icon: Sunrise,
        color: theme.palette.primary.main,
    },
    {
        label: 'Morning',
        icon: Sun,
        color: theme.palette.primary.main,
    },
    {
        label: 'Afternoon',
        icon: Sun,
        color: theme.palette.primary.main,
    },
    {
        label: 'Evening',
        icon: Sunset,
        color: theme.palette.primary.main,
    },
    {
        label: 'Night',
        icon: Moon,
        color: theme.palette.primary.main,
    }
]