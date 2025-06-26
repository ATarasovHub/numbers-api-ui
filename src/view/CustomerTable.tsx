import React, { useEffect, useState } from 'react';
import { TableBody, TableCell, TableHead, TableRow, Box, Typography } from "@mui/material";
import { StyledTable, StyledTableRow, StyledPaper } from './styles/ProviderTableStyles';

interface Customer {
    customerId: number;
    customerName: string;
    productType: string;
    totalNumbers: number;
}

export const CustomerTable: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);

    useEffect(() => {
        fetch('/customer/overview')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }
                return res.json();
            })
            .then((data: Customer[]) => setCustomers(data))
            .catch(error => {
                setCustomers([]);
            });
    }, []);

    return (
        <StyledPaper>
            <Box display="flex" justifyContent="flex-start" alignItems="center" mb={2}>
                <Typography variant="h6">Customers</Typography>
            </Box>
            <StyledTable>
                <TableHead>
                    <TableRow>
                        <TableCell>Customer Id</TableCell>
                        <TableCell>Customer Name</TableCell>
                        <TableCell>Product Type</TableCell>
                        <TableCell>Total Numbers</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {customers.map((customer, idx) => (
                        <StyledTableRow key={idx}>
                            <TableCell>{customer.customerId}</TableCell>
                            <TableCell>{customer.customerName}</TableCell>
                            <TableCell>{customer.productType}</TableCell>
                            <TableCell>{customer.totalNumbers}</TableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </StyledTable>
        </StyledPaper>
    );
}

export default CustomerTable;
