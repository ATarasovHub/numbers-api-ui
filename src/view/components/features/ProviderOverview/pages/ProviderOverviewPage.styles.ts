import { alpha } from '@mui/material/styles';
import { calmTheme } from '../../../../theme/providerTheme';

export const providerOverviewPageStyles = {
    card: {
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        maxWidth: '100vw'
    },
    headerBox: {
        mb: 3,
        pb: 2,
        borderBottom: `2px solid ${alpha(calmTheme.palette.primary.main, 0.2)}`
    },
    headerTitle: {
        fontWeight: 800,
        color: 'primary.main'
    },
    filtersPaper: {
        p: 2.5,
        mb: 3,
        borderRadius: 2.5
    },
    tablePaper: {
        borderRadius: 2.5,
        overflow: 'hidden'
    }
};