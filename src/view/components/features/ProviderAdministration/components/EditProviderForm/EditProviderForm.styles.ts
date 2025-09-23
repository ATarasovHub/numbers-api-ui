import { SxProps, Theme } from '@mui/material';

export const styles = {
    modalBox: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        minWidth: 320
    } as SxProps<Theme>,

    title: {
        mb: 2
    } as SxProps<Theme>,

    buttonContainer: {
        mt: 2,
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 1
    } as SxProps<Theme>
};