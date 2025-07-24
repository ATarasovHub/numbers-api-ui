import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Menu,
    MenuItem,
    alpha,
    createTheme,
    ThemeProvider
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

// Define Calm and Classy color scheme as MUI theme (same as table)
const calmTheme = createTheme({
    palette: {
        primary: {
            main: 'hsl(224, 76%, 31%)', // Dark blue
            light: 'hsl(214, 95%, 93%)', // Light blue
            dark: 'hsl(224, 76%, 25%)', // Darker blue
        },
        secondary: {
            main: 'hsl(214, 91%, 60%)', // Medium blue
            light: 'hsl(214, 95%, 93%)', // Light blue
        },
        background: {
            default: 'hsl(210, 40%, 98%)', // Very light blue-gray
            paper: '#ffffff',
        },
        grey: {
            50: 'hsl(214, 95%, 97%)',
            100: 'hsl(214, 95%, 93%)',
        },
        text: {
            primary: '#334155',
            secondary: '#64748b',
        }
    },
});

const Header: React.FC<HeaderProps> = ({ page, setPage }) => {
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
        <ThemeProvider theme={calmTheme}>
            <AppBar
                position="static"
                elevation={6}
                sx={{
                    backgroundColor: calmTheme.palette.primary.dark,
                    backgroundImage: `linear-gradient(135deg, ${calmTheme.palette.primary.dark} 0%, ${alpha(calmTheme.palette.primary.main, 0.95)} 50%, ${alpha(calmTheme.palette.secondary.main, 0.8)} 100%)`,
                    borderRadius: '0 0 16px 16px',
                    border: `1px solid ${alpha(calmTheme.palette.primary.light, 0.2)}`,
                    boxShadow: `0 6px 20px ${alpha(calmTheme.palette.common.black, 0.15)}`,
                    mb: 2,
                }}
            >
                <Toolbar sx={{ px: { xs: 2, sm: 4 }, py: 2 }}>
                    <Typography
                        variant="h5"
                        component="div"
                        sx={{
                            fontWeight: 800,
                            letterSpacing: '1px',
                            background: `linear-gradient(45deg, ${calmTheme.palette.common.white}, ${alpha(calmTheme.palette.primary.light, 0.9)})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            mr: 5,
                            textShadow: `0 2px 4px ${alpha(calmTheme.palette.common.black, 0.3)}`,
                        }}
                    >
                        TNT 2.0
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
                        <Box onMouseLeave={handleClose(setAdminAnchorEl)}>
                            <Button
                                onMouseEnter={handleOpen(setAdminAnchorEl)}
                                sx={{
                                    color: calmTheme.palette.common.white,
                                    textTransform: 'uppercase',
                                    fontWeight: 700,
                                    fontSize: '0.875rem',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    letterSpacing: '0.5px',
                                    transition: calmTheme.transitions.create(['background-color', 'box-shadow', 'transform'], {
                                        duration: calmTheme.transitions.duration.short,
                                    }),
                                    '&:hover': {
                                        backgroundColor: alpha(calmTheme.palette.common.white, 0.15),
                                        boxShadow: `inset 0 0 0 2px ${alpha(calmTheme.palette.common.white, 0.25)}`,
                                        transform: 'translateY(-1px)',
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
                                    elevation: 8,
                                    sx: {
                                        mt: 1,
                                        borderRadius: 3,
                                        border: `1px solid ${alpha(calmTheme.palette.primary.main, 0.2)}`,
                                        backgroundColor: alpha(calmTheme.palette.background.paper, 0.95),
                                        backdropFilter: 'blur(10px)',
                                        boxShadow: `0 10px 30px ${alpha(calmTheme.palette.common.black, 0.2)}`,
                                    },
                                }}
                            >
                                {administrationPages.map((p) => (
                                    <MenuItem
                                        key={p.page}
                                        onClick={handleMenuClick(p.page, setAdminAnchorEl)}
                                        sx={{
                                            fontSize: '0.875rem',
                                            py: 1.5,
                                            px: 3,
                                            color: calmTheme.palette.text.primary,
                                            fontWeight: 500,
                                            transition: calmTheme.transitions.create(['background-color', 'color'], {
                                                duration: calmTheme.transitions.duration.shortest,
                                            }),
                                            '&:hover': {
                                                backgroundColor: alpha(calmTheme.palette.secondary.main, 0.1),
                                                color: calmTheme.palette.secondary.main,
                                            },
                                            ...(page === p.page && {
                                                backgroundColor: alpha(calmTheme.palette.secondary.main, 0.15),
                                                color: calmTheme.palette.secondary.main,
                                                fontWeight: 600,
                                                borderLeft: `3px solid ${calmTheme.palette.secondary.main}`,
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
                                    color: calmTheme.palette.common.white,
                                    textTransform: 'uppercase',
                                    fontWeight: 700,
                                    fontSize: '0.875rem',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    letterSpacing: '0.5px',
                                    transition: calmTheme.transitions.create(['background-color', 'box-shadow', 'transform'], {
                                        duration: calmTheme.transitions.duration.short,
                                    }),
                                    '&:hover': {
                                        backgroundColor: alpha(calmTheme.palette.common.white, 0.15),
                                        boxShadow: `inset 0 0 0 2px ${alpha(calmTheme.palette.common.white, 0.25)}`,
                                        transform: 'translateY(-1px)',
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
                                    elevation: 8,
                                    sx: {
                                        mt: 1,
                                        borderRadius: 3,
                                        border: `1px solid ${alpha(calmTheme.palette.primary.main, 0.2)}`,
                                        backgroundColor: alpha(calmTheme.palette.background.paper, 0.95),
                                        backdropFilter: 'blur(10px)',
                                        boxShadow: `0 10px 30px ${alpha(calmTheme.palette.common.black, 0.2)}`,
                                    },
                                }}
                            >
                                {overviewPages.map((p) => (
                                    <MenuItem
                                        key={p.page}
                                        onClick={handleMenuClick(p.page, setOverviewAnchorEl)}
                                        sx={{
                                            fontSize: '0.875rem',
                                            py: 1.5,
                                            px: 3,
                                            color: calmTheme.palette.text.primary,
                                            fontWeight: 500,
                                            transition: calmTheme.transitions.create(['background-color', 'color'], {
                                                duration: calmTheme.transitions.duration.shortest,
                                            }),
                                            '&:hover': {
                                                backgroundColor: alpha(calmTheme.palette.secondary.main, 0.1),
                                                color: calmTheme.palette.secondary.main,
                                            },
                                            ...(page === p.page && {
                                                backgroundColor: alpha(calmTheme.palette.secondary.main, 0.15),
                                                color: calmTheme.palette.secondary.main,
                                                fontWeight: 600,
                                                borderLeft: `3px solid ${calmTheme.palette.secondary.main}`,
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
                                    color: calmTheme.palette.common.white,
                                    textTransform: 'uppercase',
                                    fontWeight: 700,
                                    fontSize: '0.875rem',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    letterSpacing: '0.5px',
                                    transition: calmTheme.transitions.create(['background-color', 'box-shadow', 'transform'], {
                                        duration: calmTheme.transitions.duration.short,
                                    }),
                                    '&:hover': {
                                        backgroundColor: alpha(calmTheme.palette.common.white, 0.15),
                                        boxShadow: `inset 0 0 0 2px ${alpha(calmTheme.palette.common.white, 0.25)}`,
                                        transform: 'translateY(-1px)',
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
                                    elevation: 8,
                                    sx: {
                                        mt: 1,
                                        borderRadius: 3,
                                        border: `1px solid ${alpha(calmTheme.palette.primary.main, 0.2)}`,
                                        backgroundColor: alpha(calmTheme.palette.background.paper, 0.95),
                                        backdropFilter: 'blur(10px)',
                                        boxShadow: `0 10px 30px ${alpha(calmTheme.palette.common.black, 0.2)}`,
                                    },
                                }}
                            >
                                {historyPages.map((p) => (
                                    <MenuItem
                                        key={p.page}
                                        onClick={handleMenuClick(p.page, setHistoryAnchorEl)}
                                        sx={{
                                            fontSize: '0.875rem',
                                            py: 1.5,
                                            px: 3,
                                            color: calmTheme.palette.text.primary,
                                            fontWeight: 500,
                                            transition: calmTheme.transitions.create(['background-color', 'color'], {
                                                duration: calmTheme.transitions.duration.shortest,
                                            }),
                                            '&:hover': {
                                                backgroundColor: alpha(calmTheme.palette.secondary.main, 0.1),
                                                color: calmTheme.palette.secondary.main,
                                            },
                                            ...(page === p.page && {
                                                backgroundColor: alpha(calmTheme.palette.secondary.main, 0.15),
                                                color: calmTheme.palette.secondary.main,
                                                fontWeight: 600,
                                                borderLeft: `3px solid ${calmTheme.palette.secondary.main}`,
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
                                color: calmTheme.palette.common.white,
                                textTransform: 'uppercase',
                                fontWeight: 700,
                                fontSize: '0.875rem',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                letterSpacing: '0.5px',
                                transition: calmTheme.transitions.create(['background-color', 'box-shadow', 'transform'], {
                                    duration: calmTheme.transitions.duration.short,
                                }),
                                '&:hover': {
                                    backgroundColor: alpha(calmTheme.palette.common.white, 0.15),
                                    boxShadow: `inset 0 0 0 2px ${alpha(calmTheme.palette.common.white, 0.25)}`,
                                    transform: 'translateY(-1px)',
                                },
                                ...(page === 'info' && {
                                    backgroundColor: alpha(calmTheme.palette.common.white, 0.2),
                                    boxShadow: `inset 0 0 0 2px ${alpha(calmTheme.palette.common.white, 0.3)}`,
                                    fontWeight: 800,
                                }),
                            }}
                        >
                            INFO
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
};

export default Header;