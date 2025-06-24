import React, {useEffect, useState} from 'react'
import {TableBody, TableCell, TableHead, TableRow, IconButton, Collapse, Box, Typography, Modal, Button, TextField } from "@mui/material";
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

interface CountryStatsTableProps {
    stats: CountryStats[],
    onEdit: (stat: CountryStats) => void
}

const CountryStatsTable: React.FC<CountryStatsTableProps> = ({stats, onEdit}) => (
    <StyledTable  size="small" aria-label="country stats">
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
    const [providers, setProviders] = useState<NumberProvider[]>([])

    useEffect(() => {
        fetch(`/provider`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }
                return res.json();
            })
            .then((providers: NumberProvider[]) => setProviders(providers))
            .catch(error => {
                Error(error.message || 'Something went wrong');
            });
    }, [])

    const handleProviderUpdate = (updatedProvider: NumberProvider) => {
        setProviders(prevProviders =>
            prevProviders.map(p =>
                p.providerId === updatedProvider.providerId ? updatedProvider : p
            )
        );
    };

    return (
        <StyledPaper>
            <StyledTable>
                <TableHead>
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
                    {providers.map(provider => (
                        <ProviderRow key={provider.providerId} provider={provider} onProviderUpdated={handleProviderUpdate} />
                    ))}
                </TableBody>
            </StyledTable>
        </StyledPaper>
    )
}