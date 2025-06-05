import React, {useEffect, useState} from 'react'
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import {NumberProvider} from "../utils/domain";
import {isDefined} from "../utils/util";

export const ProviderTable: React.FC = () => {
    const [providers, setProviders] = useState<NumberProvider[]>([])

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
                    <TableCell>
                        Country Id
                    </TableCell>
                    <TableCell>
                        Country name
                    </TableCell>
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
                    <TableRow key={`provider-table-row-${p.numberProviderId}`}>
                        <TableCell>{p.numberProviderId}</TableCell>
                        <TableCell>{p.numberProviderName}</TableCell>
                        <TableCell>{checkStatus(p.deletedAt)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}