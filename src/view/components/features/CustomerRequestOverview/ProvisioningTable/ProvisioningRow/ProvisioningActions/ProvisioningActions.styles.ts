import { styled } from '@mui/material/styles';
import { IconButton, IconButtonProps } from '@mui/material';

export const DeleteButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
    color: theme.palette.error.main,
}));

export const EditButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
    color: theme.palette.primary.main,
}));