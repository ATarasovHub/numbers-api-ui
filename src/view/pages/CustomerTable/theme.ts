import {createTheme} from '@mui/material';

export const calmTheme = createTheme({
    palette: {
        primary: {main: 'hsl(224, 76%, 31%)', light: 'hsl(214, 95%, 93%)', dark: 'hsl(224, 76%, 25%)'},
        secondary: {main: 'hsl(214, 91%, 60%)', light: 'hsl(214, 95%, 93%)'},
        background: {default: 'hsl(210, 40%, 98%)', paper: '#ffffff'},
        grey: {50: 'hsl(214, 95%, 97%)', 100: 'hsl(214, 95%, 93%)'},
        text: {primary: '#334155', secondary: '#64748b'}
    }
});
