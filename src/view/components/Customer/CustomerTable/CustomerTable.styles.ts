import { SxProps, Theme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

export const customerTableStyles = {
    card: {
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        maxWidth: '100vw',
    } as SxProps<Theme>,

    titleContainer: {
        mb: 3,
        pb: 2,
        borderBottom: (theme: Theme) => `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    } as SxProps<Theme>,

    title: {
        fontWeight: '800',
    } as SxProps<Theme>,

    filterPaper: {
        p: 2.5,
        mb: 3,
        borderRadius: 2.5,
    } as SxProps<Theme>,

    tablePaper: {
        borderRadius: 2.5,
        overflow: 'hidden',
    } as SxProps<Theme>,

    tableContainer: {
        maxHeight: '70vh',
        overflowY: 'auto',
    } as SxProps<Theme>,

    tableHeaderCell: {
        fontWeight: '700',
    } as SxProps<Theme>,

    loadingCell: {
        py: 6,
    } as SxProps<Theme>,

    noDataContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
    } as SxProps<Theme>,

    noDataText: {
        maxWidth: 400,
    } as SxProps<Theme>,
};