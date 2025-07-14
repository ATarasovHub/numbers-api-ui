import React, {useEffect, useState} from 'react'
import {TableBody, TableCell, TableHead, TableRow, IconButton, Collapse, Box, Typography, Modal, Button, TextField, Select, MenuItem, InputAdornment } from "@mui/material";
import {CountryStats, NumberProvider} from "../utils/domain";
import {isDefined} from "../utils/util";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EditIcon from '@mui/icons-material/Edit';
import {
    StyledTable,
    StyledTableRow,
    StyledPaper,
    ExpandableRow,
    CollapsibleCell,
    CollapsibleContent,
    ActionButton
} from './styles/ProviderTableStyles';
import EditProviderForm from "./components/EditProviderForm";
import EditCountryStatsForm from "./components/EditCountryStatsForm";
import CreateProviderForm from "./components/CreateProviderForm";

interface CountryStatsTableProps {
    stats: CountryStats[],
    onEdit: (stat: CountryStats) => void
}

const CountryStatsTable: React.FC<CountryStatsTableProps> = ({stats, onEdit}) => (
    <StyledTable  size="small">
        <TableHead>
            <TableRow>
                <TableCell>Country Id</TableCell>
                <TableCell>Country Name</TableCell>
                <TableCell>Total Numbers</TableCell>
                <TableCell>Assigned Numbers</TableCell>
                <TableCell>Not Assigned Numbers</TableCell>
                <TableCell>Monthly Cost</TableCell>
                <TableCell>Actions</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {stats.map((stat) => (
                <TableRow key={stat.countryId}>
                    <TableCell>{stat.countryId}</TableCell>
                    <TableCell>{stat.countryName}</TableCell>
                    <TableCell>{stat.totalNumbers}</TableCell>
                    <TableCell>{stat.assignedNumbers}</TableCell>
                    <TableCell>{stat.totalNumbers - stat.assignedNumbers}</TableCell>
                    <TableCell>{stat.totalMonthlyCost}</TableCell>
                    <TableCell>
                        <IconButton size="small" onClick={() => onEdit(stat)}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </StyledTable >
)

interface ProviderRowProps {
    provider: NumberProvider,
    onProviderUpdated: (updatedProvider: NumberProvider) => void,
    key?: number
}

const ProviderRow: React.FC<ProviderRowProps> = ({provider, onProviderUpdated, key}) => {
    const [open, setOpen] = useState(false);
    const [providerEditOpen, setProviderEditOpen] = useState(false);
    const [editingCountryStat, setEditingCountryStat] = useState<CountryStats | null>(null);

    function checkStatus(deletedAt: string) {
        if (!isDefined(deletedAt)) {
            return "Active"
        }
        const now = new Date()
        const deletedDate = new Date(deletedAt)

        if (deletedDate > now) {
            return "Active"
        } else {
            return "Deleted"
        }
    }

    const handleCountryStatSave = async (updatedStat: CountryStats) => {
        try {
            const res = await fetch(`/country-stats/${updatedStat.countryId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedStat),
            });
            if (!res.ok) throw new Error('Failed to update country stat');
            const updatedProvider = await res.json();
            onProviderUpdated(updatedProvider);
            setEditingCountryStat(null);
        } catch (e) {
            alert('Failed to save country statistics');
        }
    };

    return (
        <React.Fragment>
            <StyledTableRow>
                <TableCell>{provider.providerId}</TableCell>
                <TableCell>{provider.providerName}</TableCell>
                <TableCell>{checkStatus(provider.deletedAt)}</TableCell>
                <TableCell>{provider.totalNumbers}</TableCell>
                <TableCell>{provider.totalAssignedNumbers}</TableCell>
                <TableCell>{provider.totalNumbers - provider.totalAssignedNumbers}</TableCell>
                <TableCell>{provider.totalMonthlyCost}</TableCell>
                <TableCell>
                    <ActionButton>
                        <IconButton
                            size="small"
                            onClick={() => setOpen(!open)}
                        >
                            {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={() => setProviderEditOpen(true)}
                        >
                            <EditIcon/>
                        </IconButton>
                    </ActionButton>
                </TableCell>
            </StyledTableRow>
            <ExpandableRow>
                <CollapsibleCell colSpan={8}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <CollapsibleContent>
                            <Typography variant="h6" gutterBottom component="div">
                                Country Statistics
                            </Typography>
                            <CountryStatsTable stats={provider.countryStats || []} onEdit={setEditingCountryStat} />
                        </CollapsibleContent>
                    </Collapse>
                </CollapsibleCell>
            </ExpandableRow>
            <EditProviderForm
                open={providerEditOpen}
                onClose={() => setProviderEditOpen(false)}
                provider={provider}
                onProviderUpdated={onProviderUpdated}
            />
            <EditCountryStatsForm
                open={!!editingCountryStat}
                onClose={() => setEditingCountryStat(null)}
                countryStat={editingCountryStat}
                onSave={handleCountryStatSave}
            />
        </React.Fragment>
    );
};

export const ProviderTable: React.FC = () => {
    const [allProviders, setAllProviders] = useState<NumberProvider[]>([]);
    const [filteredProviders, setFilteredProviders] = useState<NumberProvider[]>([]);
    const [displayedProviders, setDisplayedProviders] = useState<NumberProvider[]>([]);
    const [filters, setFilters] = useState({
        providerId: '',
        providerName: '',
        status: '',
        totalNumbers: '',
        totalNumbersOp: '>=',
        totalMonthlyCost: '',
        totalMonthlyCostOp: '>=',
    });
    const [createProviderOpen, setCreateProviderOpen] = useState(false);

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
            });
    }, []);

    useEffect(() => {
        const isAllFiltersEmpty =
            !filters.providerId &&
            !filters.providerName &&
            !filters.status &&
            !filters.totalNumbers &&
            !filters.totalMonthlyCost;
        if (isAllFiltersEmpty) {
            setFilteredProviders([]);
            setDisplayedProviders(allProviders.slice(0, 10));
            return;
        }
        let filtered = allProviders.filter(provider => {
            const status = provider.deletedAt && provider.deletedAt !== '' ? 'deleted' : 'active';
            let pass = true;
            if (filters.providerId && !provider.providerId.toString().includes(filters.providerId)) pass = false;
            if (filters.providerName && !provider.providerName.toLowerCase().includes(filters.providerName)) pass = false;
            if (filters.status && !status.includes(filters.status)) pass = false;
            if (filters.totalNumbers) {
                const val = Number(filters.totalNumbers);
                if (filters.totalNumbersOp === '>=') pass = pass && (provider.totalNumbers >= val);
                if (filters.totalNumbersOp === '<=') pass = pass && (provider.totalNumbers <= val);
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
//Test
    const handleFilterChange = (field: string, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleProviderUpdate = (updatedProvider: NumberProvider) => {
        const newProviders = allProviders.map(p =>
            p.providerId === updatedProvider.providerId ? updatedProvider : p
        );
        setAllProviders(newProviders);
    };

    const handleProviderCreated = (newProvider: NumberProvider) => {
        const newProviders = [...allProviders, newProvider];
        setAllProviders(newProviders);
        setCreateProviderOpen(false);
    };

    return (
        <>
            <StyledPaper>
                <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2} p={2}>
                    <Button variant="contained" color="primary" onClick={() => setCreateProviderOpen(true)}>
                        Add provider
                    </Button>
                </Box>
                <StyledTable>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TextField
                                    value={filters.providerId}
                                    onChange={e => handleFilterChange('providerId', e.target.value)}
                                    placeholder="ID"
                                    variant="standard"
                                    size="small"
                                    fullWidth
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    value={filters.providerName}
                                    onChange={e => handleFilterChange('providerName', e.target.value)}
                                    placeholder="Name"
                                    variant="standard"
                                    size="small"
                                    fullWidth
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    value={filters.status}
                                    onChange={e => handleFilterChange('status', e.target.value)}
                                    placeholder="Status"
                                    variant="standard"
                                    size="small"
                                    fullWidth
                                />
                            </TableCell>
                            <TableCell>
                                <Box display="flex" alignItems="center">
                                    <Select
                                        value={filters.totalNumbersOp}
                                        onChange={e => handleFilterChange('totalNumbersOp', e.target.value as string)}
                                        variant="standard"
                                        size="small"
                                        sx={{ minWidth: 50 }}
                                    >
                                        <MenuItem value=">=">&ge;</MenuItem>
                                        <MenuItem value="<=">&le;</MenuItem>
                                    </Select>
                                    <TextField
                                        value={filters.totalNumbers}
                                        onChange={e => handleFilterChange('totalNumbers', e.target.value)}
                                        placeholder="Total numbers"
                                        variant="standard"
                                        size="small"
                                        fullWidth
                                        sx={{ ml: 1 }}
                                        type="number"
                                    />
                                </Box>
                            </TableCell>
                            <TableCell />
                            <TableCell />
                            <TableCell>
                                <Box display="flex" alignItems="center">
                                    <Select
                                        value={filters.totalMonthlyCostOp}
                                        onChange={e => handleFilterChange('totalMonthlyCostOp', e.target.value as string)}
                                        variant="standard"
                                        size="small"
                                        sx={{ minWidth: 50 }}
                                    >
                                        <MenuItem value=">=">&ge;</MenuItem>
                                        <MenuItem value="<=">&le;</MenuItem>
                                    </Select>
                                    <TextField
                                        value={filters.totalMonthlyCost}
                                        onChange={e => handleFilterChange('totalMonthlyCost', e.target.value)}
                                        placeholder="Monthly cost"
                                        variant="standard"
                                        size="small"
                                        fullWidth
                                        sx={{ ml: 1 }}
                                        type="number"
                                    />
                                </Box>
                            </TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Provider Id</TableCell>
                            <TableCell>Provider name</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Total numbers</TableCell>
                            <TableCell>Assigned numbers</TableCell>
                            <TableCell>Not assigned numbers</TableCell>
                            <TableCell>Total monthly cost</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedProviders.map(provider => (
                            <ProviderRow key={provider.providerId} provider={provider} onProviderUpdated={handleProviderUpdate} />
                        ))}
                    </TableBody>
                </StyledTable>
                <Modal open={createProviderOpen} onClose={() => setCreateProviderOpen(false)}>
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2, minWidth: 400, maxHeight: '80vh', overflowY: 'auto' }}>
                        <CreateProviderForm
                            onProviderCreated={handleProviderCreated}
                        />
                    </Box>
                </Modal>
            </StyledPaper>
        </>
    );
}
//Test