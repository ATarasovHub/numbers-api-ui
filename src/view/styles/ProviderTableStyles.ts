import { styled } from '@mui/material/styles';
import { TableRow, TableCell, Box } from '@mui/material';

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '& > *': {
        borderBottom: 'unset'
    }
}));

export const StyledCollapseCell = styled(TableCell)(({ theme }) => ({
    paddingBottom: 0,
    paddingTop: 0
}));

export const StyledCollapseBox = styled(Box)(({ theme }) => ({
    margin: theme.spacing(1)
}));
