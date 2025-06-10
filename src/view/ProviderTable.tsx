import React, {useEffect, useState} from 'react'
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import {CountryStats, NumberProvider} from "../utils/domain";
import {isDefined} from "../utils/util";

interface CountryStatsTableProps {
    stats: CountryStats[]
}

const CountryStatsTable: React.FC<CountryStatsTableProps> = ({stats}) => (
    <Table size="small" aria-label="country stats">

    </Table>
)

export const ProviderTable: React.FC = () => {
    const [providers, setProviders] = useState<NumberProvider[]>([])
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        console.log("Hello")
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
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>
                        Provider Id
                    </TableCell>
                    <TableCell>
                        Provider name
                    </TableCell>
                    <TableCell>
                        Status
                    </TableCell>
                    {/*<TableCell>*/}
                    {/*    Country Id*/}
                    {/*</TableCell>*/}
                    {/*<TableCell>*/}
                    {/*    Country name*/}
                    {/*</TableCell>*/}
                    <TableCell>
                        Total numbers
                    </TableCell>
                    <TableCell>
                        Assigned numbers
                    </TableCell>
                    <TableCell>
                        Not assigned numbers
                    </TableCell>
                    <TableCell>
                        Total monthly cost
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {providers.map(p => (
                    <TableRow key={`provider-table-row-${p.providerId}`}>
                        <TableCell>{p.providerId}</TableCell>
                        <TableCell>{p.providerName}</TableCell>
                        <TableCell>{checkStatus(p.deletedAt)}</TableCell>
                        <TableCell>{p.totalNumbers}</TableCell>
                        <TableCell>{p.totalAssignedNumbers}</TableCell>
                        <TableCell>{p.totalNumbers - p.totalAssignedNumbers}</TableCell>
                        <TableCell>{p.totalMonthlyCost}</TableCell>
                        <TableCell>
                            <IconButton size="small" onClick={() => toggleRow(provider.providerId)}>
                            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}