import { alpha } from '@mui/material/styles';
import { calmTheme } from '../../../../theme/providerTheme';

export const phoneNumbersTableStyles = {
    paper: {
        m: 2,
        borderRadius: 2,
        overflow: 'hidden',
        border: `1px solid ${alpha(calmTheme.palette.divider, 0.3)}`,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '200px',
        maxHeight: '400px',
        width: '100%'
    },
    headerBox: {
        p: 2,
        borderBottom: `1px solid ${alpha(calmTheme.palette.divider, 0.3)}`,
        flexShrink: 0
    },
    tableHeaderBox: {
        flexGrow: 0,
        flexShrink: 0,
        width: '100%'
    },
    scrollBox: {
        flexGrow: 1,
        overflowY: 'auto',
        maxHeight: 'calc(100% - 40px)',
        width: '100%'
    },
    table: {
        tableLayout: 'fixed' as const,
        width: '100%'
    },
    tableHeader: {
        backgroundColor: alpha(calmTheme.palette.secondary.main, 0.1)
    }
};