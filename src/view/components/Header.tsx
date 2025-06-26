import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

interface HeaderProps {
    page: 'customers' | 'providers';
    setPage: (page: 'customers' | 'providers') => void;
}

const Header: React.FC<HeaderProps> = ({ page, setPage }) => {
    return (
        <AppBar position="static" color="primary" elevation={2}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
                    Numbers API UI
                </Typography>
                <Box>
                    <Button
                        color={page === 'customers' ? 'secondary' : 'inherit'}
                        onClick={() => setPage('customers')}
                        sx={{ textTransform: 'none', fontWeight: 500, fontSize: '1rem', mr: 2 }}
                    >
                        Customers
                    </Button>
                    <Button
                        color={page === 'providers' ? 'secondary' : 'inherit'}
                        onClick={() => setPage('providers')}
                        sx={{ textTransform: 'none', fontWeight: 500, fontSize: '1rem' }}
                    >
                        Providers
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
