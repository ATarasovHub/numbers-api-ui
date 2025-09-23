import { SxProps, Theme } from '@mui/material/styles';

export const customerRowStyles = {
    collapseContainer: {
        margin: 2,
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        p: 2,
    } as SxProps<Theme>,

    sectionTitle: {
        mb: 2,
    } as SxProps<Theme>,

    accountsPaper: {
        mb: 3,
    } as SxProps<Theme>,

    countriesPaper: {
        // mt: 3, // перенесём в компонент
    } as SxProps<Theme>,

    accountTableRow: {
        cursor: 'pointer',
    } as SxProps<Theme>,

    noDataCell: {
        textAlign: 'center',
    } as SxProps<Theme>,
};