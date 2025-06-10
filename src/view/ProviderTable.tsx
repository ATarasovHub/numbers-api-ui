import React, {useEffect, useState} from 'react'
import {Table, TableBody, TableCell, TableHead, TableRow, IconButton, Collapse, Box, Typography} from "@mui/material";
import {CountryStats, NumberProvider} from "../utils/domain";
import {isDefined} from "../utils/util";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface CountryStatsTableProps {
    stats: CountryStats[]
}

const CountryStatsTable: React.FC<CountryStatsTableProps> = ({stats}) => (
    <Table size="small" aria-label="country stats">
        <TableHead>
            <TableRow>
                <TableCell>Country Id</TableCell>
                <TableCell>Country Name</TableCell>
                <TableCell>Total Numbers</TableCell>
                <TableCell>Assigned Numbers</TableCell>
                <TableCell>Not Assigned Numbers</TableCell>
                <TableCell>Monthly Cost</TableCell>
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
                </TableRow>
            ))}
        </TableBody>
    </Table>
)

interface ProviderRowProps {
    provider: NumberProvider,
    key?: number
}

const ProviderRow: React.FC<ProviderRowProps> = ({provider, key}) => {
    const [open, setOpen] = useState(false);

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

    return (
        <React.Fragment>
            <TableRow>
                <TableCell>{provider.providerId}</TableCell>
                <TableCell>{provider.providerName}</TableCell>
                <TableCell>{checkStatus(provider.deletedAt)}</TableCell>
                <TableCell>{provider.totalNumbers}</TableCell>
                <TableCell>{provider.totalAssignedNumbers}</TableCell>
                <TableCell>{provider.totalNumbers - provider.totalAssignedNumbers}</TableCell>
                <TableCell>{provider.totalMonthlyCost}</TableCell>
                <TableCell>
                    <IconButton
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={8}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{margin: 1}}>
                            <Typography variant="h6" gutterBottom component="div">
                                Country Statistics
                            </Typography>
                            <CountryStatsTable stats={provider.countryStats || []}/>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
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

    return (
        <Table>
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
                    <ProviderRow key={provider.providerId} provider={provider}/>
                ))}
            </TableBody>
        </Table>
    )
}