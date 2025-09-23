import React from 'react';
import { List, ListItem, ListSubheader } from '@mui/material';

interface NumbersListProps {
    title: string;
    numbers: string[];
    emptyText: string;
}

export const NumbersList: React.FC<NumbersListProps> = ({ title, numbers, emptyText }) => {
    return (
        <List dense subheader={<ListSubheader>{title}</ListSubheader>}>
            {numbers.length > 0 ? (
                numbers.slice(0, 100).map((n) => <ListItem key={n}>{n}</ListItem>)
            ) : (
                <ListItem>{emptyText}</ListItem>
            )}
        </List>
    );
};