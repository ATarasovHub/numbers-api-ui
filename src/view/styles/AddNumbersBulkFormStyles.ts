import { SxProps, Theme } from '@mui/material/styles';

export const countsBarStyle: SxProps<Theme> = {
    p: 1.5,
    borderRadius: 1,
    bgcolor: '#fafafa',
    border: '1px solid #eee',
    mb: 2
};

export const listBoxStyle: SxProps<Theme> = {
    flex: 1,
    minWidth: 260,
    maxHeight: 260,
    overflow: 'auto',
    border: '1px solid #eee',
    borderRadius: 1,
    p: 0
};
