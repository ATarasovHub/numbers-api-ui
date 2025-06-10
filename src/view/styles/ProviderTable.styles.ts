import { styled, keyframes } from '@mui/material/styles';
import { Table, TableCell, TableRow, Paper } from '@mui/material';
import { TableCellProps } from '@mui/material/TableCell';

export const StyledTable = styled(Table)<{ ariaLabel?: string; size?: 'small' | 'medium' }>(({ theme }) => ({
    '& .MuiTableCell-head': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        fontWeight: 'bold',
        fontSize: '0.875rem',
        padding: '12px 16px',
    },
    '& .MuiTableCell-body': {
        fontSize: '0.875rem',
        padding: '12px 16px',
    },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => {
    const colorShift = keyframes`
        0% { background-color: ${theme.palette.background.paper}; }
        50% { background-color: ${theme.palette.action.hover}; }
        100% { background-color: ${theme.palette.background.paper}; }
    `;

    return {
        animation: `${colorShift} 6s ease-in-out infinite`,
        '&:hover': {
            backgroundColor: theme.palette.action.selected,
        },
        '&.MuiTableRow-root.Mui-selected': {
            backgroundColor: theme.palette.action.selected,
        },
    };
});

export const StyledPaper = styled(Paper)(({ theme }) => ({
    width: '100%',
    marginBottom: theme.spacing(2),
    boxShadow: theme.shadows[3],
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
}));

export const ExpandableRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    '& > *': {
        borderBottom: 'unset',
    },
}));

export const CollapsibleCell = styled(TableCell)<TableCellProps>(({ theme }) => ({
    paddingBottom: 0,
    paddingTop: 0,
    backgroundColor: theme.palette.background.default,
}));

export const CollapsibleContent = styled('div')(({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
}));

export const ActionButton = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    '& .MuiIconButton-root': {
        color: theme.palette.primary.main,
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
    },
})); 