import { SxProps, Theme } from '@mui/material/styles';

export const techAccountStatusChipStyles = {
    chip: {
        pointerEvents: 'none',
        cursor: 'default',
        '&:hover': {
            backgroundColor: 'transparent',
        },
    } as SxProps<Theme>,
};