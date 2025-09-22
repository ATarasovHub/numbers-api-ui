import { alpha } from '@mui/material/styles';
import { calmTheme } from '../../../../theme/providerTheme';

export const countryStatsHeaderStyles = {
    row: {
        backgroundColor: alpha(calmTheme.palette.primary.main, 0.12)
    },
    cell: {
        fontWeight: 600
    },
    expandCell: { width: '5%' },
    countryIdCell: { width: '15%' },
    countryNameCell: { width: '20%' },
    totalNumbersCell: { width: '15%' },
    assignedNumbersCell: { width: '15%' },
    notAssignedCell: { width: '15%' },
    monthlyCostCell: { width: '15%' }
};