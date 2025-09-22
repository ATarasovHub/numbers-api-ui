import { alpha } from '@mui/material/styles';
import { calmTheme } from '../../../../../theme/providerTheme';

export const phoneNumbersLoadingStyles = {
    paper: {
        m: 2,
        borderRadius: 2,
        border: `1px solid ${alpha(calmTheme.palette.divider, 0.3)}`
    },
    loaderBox: {
        display: 'flex',
        justifyContent: 'center',
        my: 2
    }
};