import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import SearchField from './SearchField/SearchField';
import { useSearchCustomerRequest } from '../../hooks/useSearchCustomerRequest';
import { SearchCustomerRequestFormProps } from './SearchCustomerRequestForm.types';
import provisioningTypesData from '../../../../../../mocks/data/provisioningTypes';
import { searchCustomerRequestFormStyles } from './SearchCustomerRequestForm.styles';

const mockBps = [
    { id: 'twilio', name: 'twilio' },
    { id: 'bp2', name: 'bp2' },
];

const SearchCustomerRequestForm: React.FC<SearchCustomerRequestFormProps> = ({ providers, onSearch }) => {
    const { searchParams, handleParamChange } = useSearchCustomerRequest();

    const provisioningTypeOptions = provisioningTypesData.map((pt: any) => ({
        value: pt.id.toString(),
        label: pt.name
    }));

    const providerOptions = providers.map(p => ({
        value: p.providerId,
        label: p.providerName
    }));

    const bpOptions = mockBps.map(b => ({
        value: b.id,
        label: b.name
    }));

    const handleSearchClick = () => {
        onSearch({
            provider: searchParams.provider,
            bp: searchParams.bp,
        });
    };

    const handleDeleteClick = () => {
        console.log('Delete with selected criteria');
    };

    return (
        <Paper variant="outlined" sx={searchCustomerRequestFormStyles.paper}>
            <Typography variant="subtitle1" sx={searchCustomerRequestFormStyles.title}>
                Search
            </Typography>
            <Box sx={searchCustomerRequestFormStyles.formContainer}>
                <SearchField
                    label="Provisioning Type"
                    value={searchParams.provisioningType}
                    onChange={value => handleParamChange('provisioningType', value)}
                    options={provisioningTypeOptions}
                    placeholder="click to select"
                />
                <SearchField
                    label="Provider"
                    value={searchParams.provider}
                    onChange={value => handleParamChange('provider', value)}
                    options={providerOptions}
                    placeholder="click to select"
                    fieldType="provider"
                />
                <SearchField
                    label="BP"
                    value={searchParams.bp}
                    onChange={value => handleParamChange('bp', value)}
                    options={bpOptions}
                    placeholder="start typing for select"
                    fieldType="bp"
                />
                <Box sx={searchCustomerRequestFormStyles.buttonGroup}>
                    <Button
                        variant="contained"
                        sx={searchCustomerRequestFormStyles.searchButton}
                        onClick={handleSearchClick}
                    >
                        Search
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        sx={searchCustomerRequestFormStyles.deleteButton}
                        onClick={handleDeleteClick}
                    >
                        Delete with selected criteria
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default SearchCustomerRequestForm;