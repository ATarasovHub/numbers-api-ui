import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem } from '@mui/material';

export type Page = 'providers' | 'customers' | 'customer_request_overview' | 'number_assignment' | 'number_reservation' | 'number_range_admin' | 'used_number_range_admin' | 'overview' | 'provider_statistic' | 'history_account' | 'history_numberassignment' | 'info';

interface HeaderProps {
    page: Page;
    setPage: (page: Page) => void;
}

const NavButton = ({ children, ...props }: any) => (
    <Button
        sx={{
            color: 'white',
            textTransform: 'uppercase',
            fontWeight: 500,
            fontSize: '0.875rem',
            padding: '8px 16px',
            '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
        }}
        {...props}
    >
        {children}
    </Button>
);

const Header: React.FC<HeaderProps> = ({ page, setPage }) => {
    const [adminAnchorEl, setAdminAnchorEl] = useState<null | HTMLElement>(null);
    const [historyAnchorEl, setHistoryAnchorEl] = useState<null | HTMLElement>(null);

    const handleOpen = (setter: React.Dispatch<React.SetStateAction<HTMLElement | null>>) => (event: React.MouseEvent<HTMLElement>) => {
        setter(event.currentTarget);
    };

    const handleClose = (setter: React.Dispatch<React.SetStateAction<HTMLElement | null>>) => () => {
        setter(null);
    };

    const handleMenuClick = (page: Page, setter: React.Dispatch<React.SetStateAction<HTMLElement | null>>) => () => {
        setPage(page);
        setter(null);
    };
    
    const administrationPages: { label: string, page: Page }[] = [
        { label: 'Number Assignment', page: 'number_assignment' },
        { label: 'Number Reservation', page: 'number_reservation' },
        { label: 'Number Range Administration', page: 'number_range_admin' },
        { label: 'Used Number Range Administration', page: 'used_number_range_admin' },
        { label: 'Customer Request overview', page: 'customer_request_overview' },
        { label: 'Provider Administration', page: 'providers' },
    ];

    const historyPages: { label: string, page: Page }[] = [
        { label: 'Provider (Statistic)', page: 'provider_statistic' },
        { label: 'History (Account)', page: 'history_account' },
        { label: 'History (Numberassignment)', page: 'history_numberassignment' },
    ];


    return (
        <AppBar position="static" sx={{ backgroundColor: '#333' }}>
            <Toolbar sx={{ px: 3, py: 1 }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                    TNT 2.0
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, ml: 4 }}>
                    <Box onMouseLeave={handleClose(setAdminAnchorEl)}>
                        <NavButton onMouseEnter={handleOpen(setAdminAnchorEl)}>
                            ADMINISTRATION
                        </NavButton>
                        <Menu
                            anchorEl={adminAnchorEl}
                            open={Boolean(adminAnchorEl)}
                            onClose={handleClose(setAdminAnchorEl)}
                            MenuListProps={{ onMouseLeave: handleClose(setAdminAnchorEl) }}
                        >
                            {administrationPages.map(p => (
                                <MenuItem key={p.page} onClick={handleMenuClick(p.page, setAdminAnchorEl)}>{p.label}</MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    <NavButton onClick={() => setPage('overview')}>
                        OVERVIEW
                    </NavButton>

                    <Box onMouseLeave={handleClose(setHistoryAnchorEl)}>
                        <NavButton onMouseEnter={handleOpen(setHistoryAnchorEl)}>
                            HISTORY
                        </NavButton>
                        <Menu
                            anchorEl={historyAnchorEl}
                            open={Boolean(historyAnchorEl)}
                            onClose={handleClose(setHistoryAnchorEl)}
                            MenuListProps={{ onMouseLeave: handleClose(setHistoryAnchorEl) }}
                        >
                            {historyPages.map(p => (
                                <MenuItem key={p.page} onClick={handleMenuClick(p.page, setHistoryAnchorEl)}>{p.label}</MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <NavButton onClick={() => setPage('info')}>
                        INFO
                    </NavButton>
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                <Button variant="outlined" sx={{ color: 'white', borderColor: 'white', textTransform: 'none' }}>
                    Synchronize
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
