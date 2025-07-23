import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Menu,
    MenuItem,
    useTheme,
    alpha
} from '@mui/material';

export type Page =
    | 'providers'
    | 'customers'
    | 'customer_request_overview'
    | 'number_assignment'
    | 'number_reservation'
    | 'number_range_admin'
    | 'used_number_range_admin'
    | 'overview'
    | 'provider_statistic'
    | 'history_account'
    | 'history_numberassignment'
    | 'info'
    | 'provider_overview'
    | 'customer_overview';

interface HeaderProps {
    page: Page;
    setPage: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ page, setPage }) => {
    const theme = useTheme();
    const [adminAnchorEl, setAdminAnchorEl] = useState<null | HTMLElement>(null);
    const [historyAnchorEl, setHistoryAnchorEl] = useState<null | HTMLElement>(null);
    const [overviewAnchorEl, setOverviewAnchorEl] = useState<null | HTMLElement>(null);

    const administrationPages: { label: string; page: Page }[] = [
        { label: 'Number Assignment', page: 'number_assignment' },
        { label: 'Number Reservation', page: 'number_reservation' },
        { label: 'Number Range Administration', page: 'number_range_admin' },
        { label: 'Used Number Range Administration', page: 'used_number_range_admin' },
        { label: 'Customer Request Overview', page: 'customer_request_overview' },
        { label: 'Provider Administration', page: 'providers' },
    ];

    const historyPages: { label: string; page: Page }[] = [
        { label: 'Provider (Statistic)', page: 'provider_statistic' },
        { label: 'History (Account)', page: 'history_account' },
        { label: 'History (Number Assignment)', page: 'history_numberassignment' },
    ];

    const overviewPages: { label: string; page: Page }[] = [
        { label: 'Provider Overview', page: 'provider_overview' },
        { label: 'Customer Overview', page: 'customer_overview' },
    ];

    const handleOpen = (setter: React.Dispatch<React.SetStateAction<HTMLElement | null>>) =>
        (event: React.MouseEvent<HTMLElement>) => {
            setter(event.currentTarget);
        };

    const handleClose = (setter: React.Dispatch<React.SetStateAction<HTMLElement | null>>) => () => {
        setter(null);
    };

    const handleMenuClick =
        (targetPage: Page, setter: React.Dispatch<React.SetStateAction<HTMLElement | null>>) =>
            () => {
                setPage(targetPage);
                setter(null);
            };

    return (
        <AppBar
            position="static"
            elevation={4}
            sx={{
                backgroundColor: theme.palette.primary.dark,
                backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.95)} 0%, ${alpha(theme.palette.secondary.dark, 0.95)} 100%)`, // Градиент для богатства
                borderRadius: '0 0 12px 12px',
                border: `1px solid ${alpha(theme.palette.primary.light, 0.2)}`,
                boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.2)}`,
            }}
        >
            <Toolbar sx={{ px: { xs: 2, sm: 3 }, py: 1.5 }}>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        fontWeight: 800,
                        letterSpacing: '0.5px',
                        background: `linear-gradient(45deg, ${theme.palette.common.white}, ${alpha(theme.palette.secondary.light, 0.9)})`, // Градиентный текст
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        mr: 4,
                    }}
                >
                    TNT 2.0
                </Typography>

                <Box sx={{ display: 'flex', gap: 0.5, flexGrow: 1 }}>
                    <Box onMouseLeave={handleClose(setAdminAnchorEl)}>
                        <Button
                            onMouseEnter={handleOpen(setAdminAnchorEl)}
                            sx={{
                                color: theme.palette.common.white,
                                textTransform: 'uppercase',
                                fontWeight: 600,
                                fontSize: '0.8125rem',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                transition: theme.transitions.create(['background-color', 'box-shadow'], {
                                    duration: theme.transitions.duration.shortest,
                                }),
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.common.white, 0.15),
                                    boxShadow: `inset 0 0 0 1px ${alpha(theme.palette.common.white, 0.2)}`,
                                },
                            }}
                        >
                            ADMINISTRATION
                        </Button>
                        <Menu
                            anchorEl={adminAnchorEl}
                            open={Boolean(adminAnchorEl)}
                            onClose={handleClose(setAdminAnchorEl)}
                            MenuListProps={{ onMouseLeave: handleClose(setAdminAnchorEl) }}
                            PaperProps={{
                                elevation: 6,
                                sx: {
                                    mt: 0.5,
                                    borderRadius: 2,
                                    border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                                    backgroundImage: `linear-gradient(${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.grey[100], 0.95)})`,
                                    boxShadow: `0 6px 16px ${alpha(theme.palette.common.black, 0.15)}`,
                                },
                            }}
                        >
                            {administrationPages.map((p) => (
                                <MenuItem
                                    key={p.page}
                                    onClick={handleMenuClick(p.page, setAdminAnchorEl)}
                                    sx={{
                                        fontSize: '0.875rem',
                                        py: 1,
                                        px: 2,
                                        '&:hover': {
                                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                        },
                                        ...(page === p.page && {
                                            backgroundColor: alpha(theme.palette.primary.main, 0.15),
                                            fontWeight: 500,
                                        }),
                                    }}
                                >
                                    {p.label}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    <Box onMouseLeave={handleClose(setOverviewAnchorEl)}>
                        <Button
                            onMouseEnter={handleOpen(setOverviewAnchorEl)}
                            sx={{
                                color: theme.palette.common.white,
                                textTransform: 'uppercase',
                                fontWeight: 600,
                                fontSize: '0.8125rem',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                transition: theme.transitions.create(['background-color', 'box-shadow'], {
                                    duration: theme.transitions.duration.shortest,
                                }),
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.common.white, 0.15),
                                    boxShadow: `inset 0 0 0 1px ${alpha(theme.palette.common.white, 0.2)}`,
                                },
                            }}
                        >
                            OVERVIEW
                        </Button>
                        <Menu
                            anchorEl={overviewAnchorEl}
                            open={Boolean(overviewAnchorEl)}
                            onClose={handleClose(setOverviewAnchorEl)}
                            MenuListProps={{ onMouseLeave: handleClose(setOverviewAnchorEl) }}
                            PaperProps={{
                                elevation: 6,
                                sx: {
                                    mt: 0.5,
                                    borderRadius: 2,
                                    border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                                    backgroundImage: `linear-gradient(${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.grey[100], 0.95)})`,
                                    boxShadow: `0 6px 16px ${alpha(theme.palette.common.black, 0.15)}`,
                                },
                            }}
                        >
                            {overviewPages.map((p) => (
                                <MenuItem
                                    key={p.page}
                                    onClick={handleMenuClick(p.page, setOverviewAnchorEl)}
                                    sx={{
                                        fontSize: '0.875rem',
                                        py: 1,
                                        px: 2,
                                        '&:hover': {
                                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                        },
                                        ...(page === p.page && {
                                            backgroundColor: alpha(theme.palette.primary.main, 0.15),
                                            fontWeight: 500,
                                        }),
                                    }}
                                >
                                    {p.label}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    <Box onMouseLeave={handleClose(setHistoryAnchorEl)}>
                        <Button
                            onMouseEnter={handleOpen(setHistoryAnchorEl)}
                            sx={{
                                color: theme.palette.common.white,
                                textTransform: 'uppercase',
                                fontWeight: 600,
                                fontSize: '0.8125rem',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                transition: theme.transitions.create(['background-color', 'box-shadow'], {
                                    duration: theme.transitions.duration.shortest,
                                }),
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.common.white, 0.15),
                                    boxShadow: `inset 0 0 0 1px ${alpha(theme.palette.common.white, 0.2)}`,
                                },
                            }}
                        >
                            HISTORY
                        </Button>
                        <Menu
                            anchorEl={historyAnchorEl}
                            open={Boolean(historyAnchorEl)}
                            onClose={handleClose(setHistoryAnchorEl)}
                            MenuListProps={{ onMouseLeave: handleClose(setHistoryAnchorEl) }}
                            PaperProps={{
                                elevation: 6,
                                sx: {
                                    mt: 0.5,
                                    borderRadius: 2,
                                    border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                                    backgroundImage: `linear-gradient(${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.grey[100], 0.95)})`,
                                    boxShadow: `0 6px 16px ${alpha(theme.palette.common.black, 0.15)}`,
                                },
                            }}
                        >
                            {historyPages.map((p) => (
                                <MenuItem
                                    key={p.page}
                                    onClick={handleMenuClick(p.page, setHistoryAnchorEl)}
                                    sx={{
                                        fontSize: '0.875rem',
                                        py: 1,
                                        px: 2,
                                        '&:hover': {
                                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                        },
                                        ...(page === p.page && {
                                            backgroundColor: alpha(theme.palette.primary.main, 0.15),
                                            fontWeight: 500,
                                        }),
                                    }}
                                >
                                    {p.label}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    <Button
                        onClick={() => setPage('info')}
                        sx={{
                            color: theme.palette.common.white,
                            textTransform: 'uppercase',
                            fontWeight: 600,
                            fontSize: '0.8125rem',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            transition: theme.transitions.create(['background-color', 'box-shadow'], {
                                duration: theme.transitions.duration.shortest,
                            }),
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.common.white, 0.15),
                                boxShadow: `inset 0 0 0 1px ${alpha(theme.palette.common.white, 0.2)}`,
                            },
                            ...(page === 'info' && {
                                backgroundColor: alpha(theme.palette.common.white, 0.2),
                                boxShadow: `inset 0 0 0 1px ${alpha(theme.palette.common.white, 0.3)}`,
                            }),
                        }}
                    >
                        INFO
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;