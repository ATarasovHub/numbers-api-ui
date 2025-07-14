import React, { useEffect, useState } from 'react';
import {
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Box,
    Typography,
    Button,
    TextField,
    Select,
    MenuItem,
    Paper,
    Table,
    Collapse,
    IconButton
} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export interface Customer {
    customerId: number;
    customerName: string;
    productType: string;
    totalNumbers: number;
    proAccounts: CustomerOverviewProAccount[];
    proCountry: CustomerOverviewProCountry[];
}

export interface CustomerOverviewProAccount {
    techAccountId: number;
    techAccountName: string;
    totalAccounts: number;
    totalNumbers: number;
}

export interface CustomerOverviewProCountry {
    countryId: number;
    countryName: string;
    totalAccounts: number;
    totalNumbers: number;
}

export const CustomerTable: React.FC = () => {
    const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
    const [displayedCustomers, setDisplayedCustomers] = useState<Customer[]>([]);
    const [editingCustomerId, setEditingCustomerId] = useState<number | null>(null);
    const [editedCustomer, setEditedCustomer] = useState<Customer | null>(null);
    const [filters, setFilters] = useState({
        customerName: '',
        totalNumbers: '',
        totalNumbersOp: '>=',
    });
    const [openRows, setOpenRows] = useState<{ [key: number]: boolean }>({});

    useEffect(() => {
        fetch('/customer/overview')
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data: Customer[]) => {
                setAllCustomers(data);
                setDisplayedCustomers(data.slice(0, 10));
            })
            .catch(() => {
                setAllCustomers([]);
                setDisplayedCustomers([]);
            });
    }, []);

    useEffect(() => {
        const isAllFiltersEmpty = !filters.customerName && !filters.totalNumbers;
        if (isAllFiltersEmpty) {
            setFilteredCustomers([]);
            setDisplayedCustomers(allCustomers.slice(0, 10));
            return;
        }

        let filtered = allCustomers.filter(customer => {
            let pass = true;
            if (filters.customerName && !customer.customerName.toLowerCase().includes(filters.customerName.toLowerCase())) {
                pass = false;
            }
            if (filters.totalNumbers) {
                const val = Number(filters.totalNumbers);
                if (filters.totalNumbersOp === '>=') pass = pass && (customer.totalNumbers >= val);
                if (filters.totalNumbersOp === '<=') pass = pass && (customer.totalNumbers <= val);
            }
            return pass;
        });
        setFilteredCustomers(filtered);
        setDisplayedCustomers(filtered);
    }, [allCustomers, filters]);

    const handleEditClick = (customer: Customer) => {
        setEditingCustomerId(customer.customerId);
        setEditedCustomer({ ...customer });
    };

    const handleCancelClick = () => {
        setEditingCustomerId(null);
        setEditedCustomer(null);
    };

    const handleSaveClick = async () => {
        if (!editedCustomer) return;

        try {
            const response = await fetch(`/customer/overview/${editedCustomer.customerId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editedCustomer),
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const updatedCustomer = await response.json();
            const newAllCustomers = allCustomers.map(c => (c.customerId === updatedCustomer.customerId ? updatedCustomer : c));
            setAllCustomers(newAllCustomers);
            setEditingCustomerId(null);
            setEditedCustomer(null);
        } catch (error) {
            console.error("Failed to save customer:", error);
        }
    };

    const handleFilterChange = (field: string, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (editedCustomer) {
            const { name, value } = e.target;
            setEditedCustomer({
                ...editedCustomer,
                [name]: name === 'totalNumbers' ? Number(value) : value,
            });
        }
    };

    const handleRowToggle = (customerId: number) => {
        setOpenRows(prev => ({ ...prev, [customerId]: !prev[customerId] }));
    };

    return (
        <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="flex-start" alignItems="center" mb={2}>
                <Typography variant="h6">Customers</Typography>
            </Box>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>
                            <TextField
                                value={filters.customerName}
                                onChange={e => handleFilterChange('customerName', e.target.value)}
                                placeholder="Name"
                                variant="standard"
                                size="small"
                                fullWidth
                            />
                        </TableCell>
                        <TableCell />
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
                        <TableCell />
                    </TableRow>
                    <TableRow>
                        <TableCell />
                        <TableCell>Customer Name</TableCell>
                        <TableCell>Product Type</TableCell>
                        <TableCell>Total Numbers</TableCell>
                        <TableCell>Accounts</TableCell>
                        <TableCell>Countries</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {displayedCustomers.map((customer) => (
                        <React.Fragment key={customer.customerId}>
                            <TableRow>
                                <TableCell>
                                    <IconButton size="small" onClick={() => handleRowToggle(customer.customerId)}>
                                        {openRows[customer.customerId] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                    </IconButton>
                                </TableCell>
                                {editingCustomerId === customer.customerId ? (
                                    <>
                                        <TableCell>
                                            <TextField
                                                name="customerName"
                                                value={editedCustomer?.customerName || ''}
                                                onChange={handleInputChange}
                                                size="small"
                                                variant="standard"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                name="productType"
                                                value={editedCustomer?.productType || ''}
                                                onChange={handleInputChange}
                                                size="small"
                                                variant="standard"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                name="totalNumbers"
                                                type="number"
                                                value={editedCustomer?.totalNumbers || 0}
                                                onChange={handleInputChange}
                                                size="small"
                                                variant="standard"
                                            />
                                        </TableCell>
                                        <TableCell>-</TableCell>
                                        <TableCell>-</TableCell>
                                        <TableCell align="right">
                                            <Button onClick={handleSaveClick} size="small" variant="contained" color="primary" sx={{ mr: 1 }}>Save</Button>
                                            <Button onClick={handleCancelClick} size="small" variant="outlined">Cancel</Button>
                                        </TableCell>
                                    </>
                                ) : (
                                    <>
                                        <TableCell>{customer.customerName}</TableCell>
                                        <TableCell>{customer.productType}</TableCell>
                                        <TableCell>{customer.totalNumbers}</TableCell>
                                        <TableCell>{customer.proAccounts.length}</TableCell>
                                        <TableCell>{customer.proCountry.length}</TableCell>
                                        <TableCell align="right">
                                            <Button
                                                onClick={() => handleEditClick(customer)}
                                                size="small"
                                                variant="outlined"
                                                disabled={editingCustomerId !== null && editingCustomerId !== customer.customerId}
                                            >
                                                Edit
                                            </Button>
                                        </TableCell>
                                    </>
                                )}
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                                    <Collapse in={openRows[customer.customerId]} timeout="auto" unmountOnExit>
                                        <Box margin={1}>
                                            <Typography variant="subtitle2">Accounts:</Typography>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>ID</TableCell>
                                                        <TableCell>Name</TableCell>
                                                        <TableCell>Total Accounts</TableCell>
                                                        <TableCell>Total Numbers</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {customer.proAccounts.map(acc => (
                                                        <TableRow key={acc.techAccountId}>
                                                            <TableCell>{acc.techAccountId}</TableCell>
                                                            <TableCell>{acc.techAccountName}</TableCell>
                                                            <TableCell>{acc.totalAccounts}</TableCell>
                                                            <TableCell>{acc.totalNumbers}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                            <Typography variant="subtitle2" sx={{ mt: 2 }}>Countries:</Typography>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>ID</TableCell>
                                                        <TableCell>Name</TableCell>
                                                        <TableCell>Total Accounts</TableCell>
                                                        <TableCell>Total Numbers</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {customer.proCountry.map(country => (
                                                        <TableRow key={country.countryId}>
                                                            <TableCell>{country.countryId}</TableCell>
                                                            <TableCell>{country.countryName}</TableCell>
                                                            <TableCell>{country.totalAccounts}</TableCell>
                                                            <TableCell>{country.totalNumbers}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </Box>
                                    </Collapse>
                                </TableCell>
                            </TableRow>
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};

export default CustomerTable;
