import { alpha } from '@mui/material/styles';
import { calmTheme } from '../../../../../theme/providerTheme';

export const countryStatsTableStyles = {
    paper: {
        mb: 3,
        borderRadius: 2,
        overflow: 'hidden',
        border: `1px solid ${alpha(calmTheme.palette.divider, 0.5)}`
    },
    table: {
        tableLayout: 'fixed' as const,
        width: '100%'
    },
    emptyRowCell: {
        py: 3
    }
};