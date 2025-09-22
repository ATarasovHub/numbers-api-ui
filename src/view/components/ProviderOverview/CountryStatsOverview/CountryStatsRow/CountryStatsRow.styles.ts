// components/CountryStatsTable/CountryStatsRow.styles.ts
import { alpha } from '@mui/material/styles';
import { calmTheme } from '../../../../theme/providerTheme';

export const countryStatsRowStyles = {
    row: {
        '&:hover': {
            backgroundColor: alpha(calmTheme.palette.secondary.light, 0.2)
        }
    },
    cell: {
        fontWeight: 500
    },
    expandCell: { width: '5%' },
    countryIdCell: { width: '15%' },
    countryNameCell: { width: '20%' },
    totalNumbersCell: { width: '15%' },
    assignedNumbersCell: { width: '15%' },
    notAssignedCell: { width: '15%' },
    monthlyCostCell: { width: '15%' },
    collapseCell: {
        paddingBottom: 0,
        paddingTop: 0
    },
    collapseContent: {
        margin: 2,
        width: '100%'
    }
};