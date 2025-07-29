import React, {useEffect, useState} from 'react';
import {
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Box,
    Typography,
    TextField,
    Select,
    MenuItem,
    Card,
    Table,
    Collapse,
    IconButton,
    Paper,
    alpha,
    createTheme,
    ThemeProvider
} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {CountryStats, NumberProvider} from "../utils/domain";
import {isDefined} from "../utils/util";
import {CircularProgress} from "@mui/material";

export interface ProviderRowProps {
    provider: NumberProvider,
    onProviderUpdated: (updatedProvider: NumberProvider) => void,
    key?: number
}

const calmTheme = createTheme({
    palette: {
        primary: {
            main: 'hsl(224, 76%, 31%)',
            light: 'hsl(214, 95%, 93%)',
            dark: 'hsl(224, 76%, 25%)',
        },
        secondary: {
            main: 'hsl(214, 91%, 60%)',
            light: 'hsl(214, 95%, 93%)',
        },
        background: {
            default: 'hsl(210, 40%, 98%)',
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

const StatusBadge: React.FC<{ status?: string }> = ({ status = 'Unknown' }) => {
    // Safeguard against undefined/null status
    const statusString = status ?? 'Unknown';
    const isOccupied = statusString.toLowerCase() === 'active';
    const displayText = isOccupied ? 'Occupied' : 'Free'; // Use English labels

    const backgroundColor = isOccupied
        ? alpha(calmTheme.palette.success?.main || '#4caf50', 0.15)
        : alpha(calmTheme.palette.error?.main || '#f44336', 0.15);
    const textColor = isOccupied
        ? calmTheme.palette.success?.main || '#2e7d32'
        : calmTheme.palette.error?.main || '#c62828';
    const borderColor = isOccupied
        ? alpha(calmTheme.palette.success?.main || '#4caf50', 0.3)
        : alpha(calmTheme.palette.error?.main || '#f44336', 0.3);

    return (
        <Box
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 1.5,
                py: 0.5,
                borderRadius: '16px',
                backgroundColor,
                color: textColor,
                border: `1px solid ${borderColor}`,
            }}
        >
            <Typography
                variant="body2"
                sx={{
                    fontWeight: 600,
                    fontSize: '0.85rem'
                }}
            >
                {displayText} {/* Display the new English text */}
            </Typography>
        </Box>
    );
};

const PhoneNumbersTable: React.FC<{ phoneNumbers: any[], loading: boolean }> = ({ phoneNumbers, loading }) => {
    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                p={4}
                sx={{
                    backgroundColor: alpha(calmTheme.palette.grey[50], 0.3),
                    borderRadius: 2
                }}
            >
                <CircularProgress
                    size={24}
                    sx={{
                        color: calmTheme.palette.primary.main,
                        mr: 2
                    }}
                />
                <Typography variant="body2" color="text.secondary">
                    Loading numbers...
                </Typography>
            </Box>
        );
    }

    return (
        <Paper
            elevation={1}
            sx={{
                mb: 2,
                borderRadius: 2,
                overflow: 'hidden',
                border: `1px solid ${alpha(calmTheme.palette.divider, 0.3)}`
            }}
        >
            <Table size="small">
                <TableHead sx={{ backgroundColor: alpha(calmTheme.palette.secondary.main, 0.1) }}>
                    <TableRow>
                        <TableCell>Phone Number</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Tech Account</TableCell>
                        <TableCell>End Date</TableCell>
                        <TableCell>Commentare</TableCell>
                        <TableCell>Monthly Cost</TableCell>
                        <TableCell>Assigned Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {phoneNumbers && phoneNumbers.length > 0 ? (
                        phoneNumbers.map((phone, idx) => (
                            <TableRow
                                key={idx} // Use a unique key, preferably phone.id if available
                                sx={{
                                    backgroundColor: idx % 2 === 0 ? alpha(calmTheme.palette.grey[50], 0.3) : 'transparent',
                                    '&:hover': {
                                        backgroundColor: alpha(calmTheme.palette.secondary.light, 0.15),
                                    }
                                }}
                            >
                                <TableCell>
                                    <Typography variant="body2" fontWeight="500">
                                        {phone.number || 'N/A'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <StatusBadge status={phone.status || 'Unknown'} />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="500">
                                        {phone.customer || 'N/A'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="500">
                                        {phone.techAccount || 'N/A'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="500">
                                        {phone.endDate || 'N/A'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography
                                        variant="body2"
                                        fontWeight="500"
                                        sx={{
                                            maxWidth: '150px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                        title={phone.commentare || 'N/A'}
                                    >
                                        {phone.commentare || 'N/A'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="500">
                                        {phone.monthlyCost || 'N/A'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="500">
                                        {phone.assignedDate || 'N/A'}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                                <Typography variant="body2" color="textSecondary">
                                    No phone numbers available
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Paper>
    );
};


const CountryStatsTable: React.FC<{ stats: CountryStats[] }> = ({stats}) => {
    const [expandedCountries, setExpandedCountries] = useState<{ [key: string]: boolean }>({});
    const [phoneNumbersData, setPhoneNumbersData] = useState<{ [key: string]: any[] }>({});
    const [loadingPhoneNumbers, setLoadingPhoneNumbers] = useState<{ [key: string]: boolean }>({});

    // Внутри CountryStatsTable, замените функцию toggleCountryExpansion на эту:
    const toggleCountryExpansion = async (countryId: string, countryName: string) => { // Добавляем countryName как аргумент
        const isCurrentlyExpanded = expandedCountries[countryId];
        setExpandedCountries(prev => ({
            ...prev,
            [countryId]: !isCurrentlyExpanded
        }));

        // Если страна раскрывается и данные для неё ещё не загружены
        if (!isCurrentlyExpanded && !phoneNumbersData[countryId]) {
            setLoadingPhoneNumbers(prev => ({ ...prev, [countryId]: true }));
            try {
                // Используем countryName для формирования URL
                // encodeURIComponent нужен на случай, если в названии страны есть пробелы или специальные символы
                const response = await fetch(`http://localhost:8080/numbers/overview/country/${encodeURIComponent(countryName)}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                // Предполагается, что API возвращает массив объектов с полями, соответствующими ожидаемым в PhoneNumbersTable
                setPhoneNumbersData(prev => ({
                    ...prev,
                    [countryId]: data // По-прежнему используем countryId как ключ в состоянии, так как он уникален для строки
                }));
            } catch (error) {
                console.error(`Failed to fetch phone numbers for country ${countryName} (ID: ${countryId}):`, error);
                // Можно установить пустой массив или флаг ошибки
                setPhoneNumbersData(prev => ({
                    ...prev,
                    [countryId]: [] // или null/undefined, если хотите показать ошибку
                }));
            } finally {
                setLoadingPhoneNumbers(prev => ({ ...prev, [countryId]: false }));
            }
        }
    };

    return (
        <Paper
            elevation={2}
            sx={{
                mb: 3,
                borderRadius: 2,
                overflow: 'hidden',
                border: `1px solid ${alpha(calmTheme.palette.divider, 0.5)}`
            }}
        >
            <Table size="small">
                <TableHead sx={{
                    backgroundColor: alpha(calmTheme.palette.primary.main, 0.12)
                }}>
                    <TableRow>
                        <TableCell sx={{width: '5%'}}>
                            <Typography variant="subtitle2" fontWeight="600"></Typography>
                        </TableCell>
                        <TableCell sx={{
                            fontWeight: '600',
                            color: calmTheme.palette.primary.dark,
                            textTransform: 'uppercase',
                            letterSpacing: '0.3px',
                            fontSize: '0.75rem'
                        }}>
                            <Typography variant="subtitle2" fontWeight="600">Country ID</Typography>
                        </TableCell>
                        <TableCell sx={{
                            fontWeight: '600',
                            color: calmTheme.palette.primary.dark,
                            textTransform: 'uppercase',
                            letterSpacing: '0.3px',
                            fontSize: '0.75rem'
                        }}>
                            <Typography variant="subtitle2" fontWeight="600">Country Name</Typography>
                        </TableCell>
                        <TableCell sx={{
                            fontWeight: '600',
                            color: calmTheme.palette.primary.dark,
                            textTransform: 'uppercase',
                            letterSpacing: '0.3px',
                            fontSize: '0.75rem'
                        }}>
                            <Typography variant="subtitle2" fontWeight="600">Total Numbers</Typography>
                        </TableCell>
                        <TableCell sx={{
                            fontWeight: '600',
                            color: calmTheme.palette.primary.dark,
                            textTransform: 'uppercase',
                            letterSpacing: '0.3px',
                            fontSize: '0.75rem'
                        }}>
                            <Typography variant="subtitle2" fontWeight="600">Assigned Numbers</Typography>
                        </TableCell>
                        <TableCell sx={{
                            fontWeight: '600',
                            color: calmTheme.palette.primary.dark,
                            textTransform: 'uppercase',
                            letterSpacing: '0.3px',
                            fontSize: '0.75rem'
                        }}>
                            <Typography variant="subtitle2" fontWeight="600">Not Assigned Numbers</Typography>
                        </TableCell>
                        <TableCell sx={{
                            fontWeight: '600',
                            color: calmTheme.palette.primary.dark,
                            textTransform: 'uppercase',
                            letterSpacing: '0.3px',
                            fontSize: '0.75rem'
                        }}>
                            <Typography variant="subtitle2" fontWeight="600">Monthly Cost</Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {stats && stats.length > 0 ? (
                        stats.map((stat, idx) => (
                            <React.Fragment key={stat.countryId}>
                                <TableRow
                                    sx={{
                                        backgroundColor: idx % 2 === 0 ?
                                            alpha(calmTheme.palette.grey[100], 0.3) :
                                            'transparent',
                                        '&:hover': {
                                            backgroundColor: alpha(calmTheme.palette.secondary.light, 0.2),
                                        }
                                    }}
                                >
                                    <TableCell>
                                        <IconButton
                                            aria-label="expand row"
                                            size="small"
                                            onClick={() => toggleCountryExpansion(stat.countryId.toString(), stat.countryName)}
                                            sx={{
                                                color: calmTheme.palette.primary.main,
                                                backgroundColor: alpha(calmTheme.palette.primary.main, 0.1),
                                                '&:hover': {
                                                    backgroundColor: alpha(calmTheme.palette.primary.main, 0.2),
                                                },
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {expandedCountries[stat.countryId] ? <KeyboardArrowUpIcon/> :
                                                <KeyboardArrowDownIcon/>}
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="500">
                                            {stat.countryId}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="500">
                                            {stat.countryName}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="500">
                                            {new Intl.NumberFormat().format(stat.totalNumbers)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="500">
                                            {new Intl.NumberFormat().format(stat.assignedNumbers)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="500">
                                            {new Intl.NumberFormat().format(stat.totalNumbers - stat.assignedNumbers)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="500">
                                            {new Intl.NumberFormat().format(stat.totalMonthlyCost)}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell
                                        style={{
                                            paddingBottom: 0,
                                            paddingTop: 0,
                                            backgroundColor: alpha(calmTheme.palette.grey[50], 0.5)
                                        }}
                                        colSpan={7}
                                    >
                                        <Collapse
                                            in={expandedCountries[stat.countryId]}
                                            timeout="auto"
                                            unmountOnExit
                                        >
                                            <Box sx={{margin: 2}}>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        mb: 2,
                                                        pb: 1,
                                                        borderBottom: `1px dashed ${alpha(calmTheme.palette.secondary.main, 0.3)}`
                                                    }}
                                                >
                                                    <Typography
                                                        variant="h6"
                                                        gutterBottom
                                                        sx={{
                                                            color: calmTheme.palette.secondary.dark,
                                                            fontWeight: 700,
                                                            mr: 1
                                                        }}
                                                    >
                                                        BlaBla Test
                                                    </Typography>
                                                    <Typography
                                                        variant="h6"
                                                        gutterBottom
                                                        sx={{
                                                            color: calmTheme.palette.primary.main,
                                                            fontWeight: 700
                                                        }}
                                                    >
                                                        {stat.countryName}
                                                    </Typography>
                                                </Box>
                                                <PhoneNumbersTable
                                                    phoneNumbers={phoneNumbersData[stat.countryId] || []}
                                                    loading={loadingPhoneNumbers[stat.countryId] || false}
                                                />
                                            </Box>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} align="center" sx={{py: 3}}>
                                <Typography variant="body2" color="textSecondary">
                                    No country statistics available
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Paper>
    );
};


const ProviderRow: React.FC<ProviderRowProps> = ({provider, onProviderUpdated}) => {
    const [open, setOpen] = useState(false);

    function checkStatus(deletedAt: string) {
        if (!isDefined(deletedAt)) {
            return "Active";
        }
        const now = new Date();
        const deletedDate = new Date(deletedAt);
        if (deletedDate > now) {
            return "Active";
        } else {
            return "Deleted";
        }
    }

    const status = checkStatus(provider.deletedAt);

    return (
        <React.Fragment>
            <TableRow
                sx={{
                    backgroundColor: provider.providerId % 2 === 0 ?
                        alpha(calmTheme.palette.grey[50], 0.7) :
                        alpha(calmTheme.palette.background.paper, 0.7),
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        backgroundColor: alpha(calmTheme.palette.primary.light, 0.1),
                        transform: 'scale(1.005)',
                        boxShadow: `inset 0 0 0 1px ${alpha(calmTheme.palette.primary.main, 0.2)}`,
                    },
                    borderBottom: `1px solid ${alpha(calmTheme.palette.divider, 0.3)}`
                }}
            >
                <TableCell sx={{width: '5%'}}>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                        sx={{
                            color: calmTheme.palette.primary.main,
                            backgroundColor: alpha(calmTheme.palette.primary.main, 0.1),
                            '&:hover': {
                                backgroundColor: alpha(calmTheme.palette.primary.main, 0.2),
                            },
                            transition: 'all 0.2s'
                        }}
                    >
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell>
                    <Typography variant="body2" fontWeight="600" color="text.primary">
                        {provider.providerName}
                    </Typography>
                </TableCell>
                <TableCell>
                    <StatusBadge status={status}/>
                </TableCell>
                <TableCell>
                    <Typography variant="body2" fontWeight="500" color="text.primary">
                        {new Intl.NumberFormat().format(provider.totalNumbers)}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography variant="body2" fontWeight="500" color="text.primary">
                        {new Intl.NumberFormat().format(provider.totalAssignedNumbers)}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography variant="body2" fontWeight="500" color="text.primary">
                        {new Intl.NumberFormat().format(provider.totalNumbers - provider.totalAssignedNumbers)}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography variant="body2" fontWeight="500" color="text.primary">
                        {new Intl.NumberFormat().format(provider.totalMonthlyCost)}
                    </Typography>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell
                    style={{
                        paddingBottom: 0,
                        paddingTop: 0,
                        backgroundColor: alpha(calmTheme.palette.grey[50], 0.5)
                    }}
                    colSpan={7}
                >
                    <Collapse
                        in={open}
                        timeout="auto"
                        unmountOnExit
                    >
                        <Box sx={{margin: 3}}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 2,
                                    pb: 1,
                                    borderBottom: `1px dashed ${alpha(calmTheme.palette.primary.main, 0.3)}`
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    sx={{
                                        color: calmTheme.palette.primary.dark,
                                        fontWeight: 700,
                                        mr: 1
                                    }}
                                >
                                    Country Statistics for
                                </Typography>
                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    sx={{
                                        color: calmTheme.palette.secondary.main,
                                        fontWeight: 700
                                    }}
                                >
                                    {provider.providerName}
                                </Typography>
                            </Box>
                            <CountryStatsTable stats={provider.countryStats || []}/>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
};

export const ProviderOverview: React.FC = () => {
    const [allProviders, setAllProviders] = useState<NumberProvider[]>([]);
    const [filteredProviders, setFilteredProviders] = useState<NumberProvider[]>([]);
    const [displayedProviders, setDisplayedProviders] = useState<NumberProvider[]>([]);
    const [filters, setFilters] = useState({
        providerName: '',
        totalNumbers: '',
        totalNumbersOp: '>=',
        totalAssignedNumbers: '',
        totalAssignedNumbersOp: '>=',
        totalMonthlyCost: '',
        totalMonthlyCostOp: '>=',
    });

    useEffect(() => {
        fetch(`/provider`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data: NumberProvider[]) => {
                setAllProviders(data);
                setDisplayedProviders(data.slice(0, 10));
            })
            .catch(error => {
                console.error("Failed to fetch providers:", error.message || 'Something went wrong');
                setAllProviders([]);
                setDisplayedProviders([]);
            });
    }, []);

    useEffect(() => {
        const isAllFiltersEmpty =
            !filters.providerName &&
            !filters.totalNumbers &&
            !filters.totalAssignedNumbers &&
            !filters.totalMonthlyCost;
        if (isAllFiltersEmpty) {
            setFilteredProviders([]);
            setDisplayedProviders(allProviders.slice(0, 10));
            return;
        }
        let filtered = allProviders.filter(provider => {
            const status = provider.deletedAt && provider.deletedAt !== '' ? 'deleted' : 'active';
            let pass = true;
            if (filters.providerName && !provider.providerName.toLowerCase().includes(filters.providerName)) pass = false;
            if (filters.totalNumbers) {
                const val = Number(filters.totalNumbers);
                if (filters.totalNumbersOp === '>=') pass = pass && (provider.totalNumbers >= val);
                if (filters.totalNumbersOp === '<=') pass = pass && (provider.totalNumbers <= val);
            }
            if (filters.totalAssignedNumbers) {
                const val = Number(filters.totalAssignedNumbers);
                if (filters.totalAssignedNumbersOp === '>=') pass = pass && (provider.totalAssignedNumbers >= val);
                if (filters.totalAssignedNumbersOp === '<=') pass = pass && (provider.totalAssignedNumbers <= val);
            }
            if (filters.totalMonthlyCost) {
                const val = Number(filters.totalMonthlyCost);
                if (filters.totalMonthlyCostOp === '>=') pass = pass && (provider.totalMonthlyCost >= val);
                if (filters.totalMonthlyCostOp === '<=') pass = pass && (provider.totalMonthlyCost <= val);
            }
            return pass;
        });
        setFilteredProviders(filtered);
        setDisplayedProviders(filtered);
    }, [allProviders, filters]);

    const handleFilterChange = (field: string, value: string) => {
        setFilters(prev => ({...prev, [field]: value}));
    };

    const handleProviderUpdate = (updatedProvider: NumberProvider) => {
        const newProviders = allProviders.map(p =>
            p.providerId === updatedProvider.providerId ? updatedProvider : p
        );
        setAllProviders(newProviders);
    };

    return (
        <ThemeProvider theme={calmTheme}>
            <Card
                elevation={6}
                sx={{
                    p: {xs: 2, sm: 3},
                    borderRadius: 3,
                    maxWidth: '100vw',
                    background: `linear-gradient(135deg, ${alpha(calmTheme.palette.primary.main, 0.05)} 0%, ${alpha(calmTheme.palette.secondary.main, 0.05)} 100%)`,
                    border: `1px solid ${alpha(calmTheme.palette.primary.main, 0.1)}`,
                    boxShadow: `0 10px 30px ${alpha(calmTheme.palette.common.black, 0.08)}`
                }}
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                    sx={{
                        pb: 2,
                        borderBottom: `2px solid ${alpha(calmTheme.palette.primary.main, 0.2)}`
                    }}
                >
                    <Typography
                        variant="h4"
                        component="h1"
                        fontWeight="800"
                        color="primary"
                        sx={{
                            background: `linear-gradient(45deg, ${calmTheme.palette.primary.main}, ${calmTheme.palette.secondary.main})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        Provider Overview
                    </Typography>
                </Box>
                <Paper
                    elevation={3}
                    sx={{
                        p: 2.5,
                        mb: 3,
                        borderRadius: 2.5,
                        backgroundColor: alpha(calmTheme.palette.background.paper, 0.7),
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${alpha(calmTheme.palette.primary.main, 0.15)}`
                    }}
                >
                    <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
                        <Typography variant="subtitle2" sx={{minWidth: '100px', fontWeight: 600}}>Filter
                            by:</Typography>
                        <TextField
                            label="Provider Name"
                            value={filters.providerName}
                            onChange={e => handleFilterChange('providerName', e.target.value)}
                            variant="outlined"
                            size="small"
                            sx={{
                                minWidth: 220,
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: alpha(calmTheme.palette.primary.main, 0.3),
                                    },
                                    '&:hover fieldset': {
                                        borderColor: alpha(calmTheme.palette.primary.main, 0.5),
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: calmTheme.palette.primary.main,
                                    },
                                },
                            }}
                        />
                        <Box display="flex" alignItems="center" gap={1}>
                            <Select
                                value={filters.totalNumbersOp}
                                onChange={e => handleFilterChange('totalNumbersOp', e.target.value as string)}
                                variant="outlined"
                                size="small"
                                sx={{
                                    minWidth: 70,
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: alpha(calmTheme.palette.primary.main, 0.3),
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: alpha(calmTheme.palette.primary.main, 0.5),
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: calmTheme.palette.primary.main,
                                    },
                                }}
                            >
                                <MenuItem value=">=">&ge;</MenuItem>
                                <MenuItem value="<=">&le;</MenuItem>
                            </Select>
                            <TextField
                                label="Total Numbers"
                                value={filters.totalNumbers}
                                onChange={e => handleFilterChange('totalNumbers', e.target.value)}
                                variant="outlined"
                                size="small"
                                sx={{
                                    minWidth: 150,
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: alpha(calmTheme.palette.primary.main, 0.3),
                                        },
                                        '&:hover fieldset': {
                                            borderColor: alpha(calmTheme.palette.primary.main, 0.5),
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: calmTheme.palette.primary.main,
                                        },
                                    },
                                }}
                                type="number"
                            />
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Select
                                value={filters.totalAssignedNumbersOp}
                                onChange={e => handleFilterChange('totalAssignedNumbersOp', e.target.value as string)}
                                variant="outlined"
                                size="small"
                                sx={{
                                    minWidth: 70,
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: alpha(calmTheme.palette.primary.main, 0.3),
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: alpha(calmTheme.palette.primary.main, 0.5),
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: calmTheme.palette.primary.main,
                                    },
                                }}
                            >
                                <MenuItem value=">=">&ge;</MenuItem>
                                <MenuItem value="<=">&le;</MenuItem>
                            </Select>
                            <TextField
                                label="Assigned Numbers"
                                value={filters.totalAssignedNumbers}
                                onChange={e => handleFilterChange('totalAssignedNumbers', e.target.value)}
                                variant="outlined"
                                size="small"
                                sx={{
                                    minWidth: 150,
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: alpha(calmTheme.palette.primary.main, 0.3),
                                        },
                                        '&:hover fieldset': {
                                            borderColor: alpha(calmTheme.palette.primary.main, 0.5),
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: calmTheme.palette.primary.main,
                                        },
                                    },
                                }}
                                type="number"
                            />
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Select
                                value={filters.totalMonthlyCostOp}
                                onChange={e => handleFilterChange('totalMonthlyCostOp', e.target.value as string)}
                                variant="outlined"
                                size="small"
                                sx={{
                                    minWidth: 70,
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: alpha(calmTheme.palette.primary.main, 0.3),
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: alpha(calmTheme.palette.primary.main, 0.5),
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: calmTheme.palette.primary.main,
                                    },
                                }}
                            >
                                <MenuItem value=">=">&ge;</MenuItem>
                                <MenuItem value="<=">&le;</MenuItem>
                            </Select>
                            <TextField
                                label="Monthly Cost"
                                value={filters.totalMonthlyCost}
                                onChange={e => handleFilterChange('totalMonthlyCost', e.target.value)}
                                variant="outlined"
                                size="small"
                                sx={{
                                    minWidth: 150,
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: alpha(calmTheme.palette.primary.main, 0.3),
                                        },
                                        '&:hover fieldset': {
                                            borderColor: alpha(calmTheme.palette.primary.main, 0.5),
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: calmTheme.palette.primary.main,
                                        },
                                    },
                                }}
                                type="number"
                            />
                        </Box>
                    </Box>
                </Paper>
                <Paper
                    elevation={4}
                    sx={{
                        borderRadius: 2.5,
                        overflow: 'hidden',
                        border: `1px solid ${alpha(calmTheme.palette.divider, 0.5)}`,
                        boxShadow: `0 4px 20px ${alpha(calmTheme.palette.common.black, 0.06)}`
                    }}
                >
                    <Table sx={{minWidth: 750}} aria-label="providers table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{
                                    fontWeight: '700',
                                    color: calmTheme.palette.common.white,
                                    background: calmTheme.palette.primary.dark,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    width: '5%'
                                }}/>
                                <TableCell sx={{
                                    fontWeight: '700',
                                    color: calmTheme.palette.common.white,
                                    background: calmTheme.palette.primary.dark,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>Provider Name</TableCell>
                                <TableCell sx={{
                                    fontWeight: '700',
                                    color: calmTheme.palette.common.white,
                                    background: calmTheme.palette.primary.dark,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>Status</TableCell>
                                <TableCell sx={{
                                    fontWeight: '700',
                                    color: calmTheme.palette.common.white,
                                    background: calmTheme.palette.primary.dark,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>Total Numbers</TableCell>
                                <TableCell sx={{
                                    fontWeight: '700',
                                    color: calmTheme.palette.common.white,
                                    background: calmTheme.palette.primary.dark,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>Assigned Numbers</TableCell>
                                <TableCell sx={{
                                    fontWeight: '700',
                                    color: calmTheme.palette.common.white,
                                    background: calmTheme.palette.primary.dark,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>Not Assigned Numbers</TableCell>
                                <TableCell sx={{
                                    fontWeight: '700',
                                    color: calmTheme.palette.common.white,
                                    background: calmTheme.palette.primary.dark,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>Total Monthly Cost</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayedProviders.length > 0 ? (
                                displayedProviders.map(provider => (
                                    <ProviderRow key={provider.providerId} provider={provider}
                                                 onProviderUpdated={handleProviderUpdate}/>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{py: 6}}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                color: calmTheme.palette.text.secondary,
                                                fontWeight: 500
                                            }}
                                        >
                                            {allProviders.length === 0 ?
                                                "Loading provider data..." :
                                                "No providers match the current filters"
                                            }
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Paper>
            </Card>
        </ThemeProvider>
    );
}

export default ProviderOverview;