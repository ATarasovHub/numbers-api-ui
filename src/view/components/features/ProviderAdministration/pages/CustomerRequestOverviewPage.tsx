import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

import ProviderSelector from '../components/ProviderSelector/ProviderSelector';
import ProviderEditForm from '../components/ProviderEditForm/ProviderEditForm';
import AddNumbersRangeForm from '../components/AddNumbersRangeForm/AddNumbersRangeForm';
import AddSpecificNumbersForm from '../components/AddSpecificNumbersForm/AddSpecificNumbersForm';
import CurrentRangesTable from '../components/CurrentRangesTable/CurrentRangesTable';
import AddNumbersBulkForm from '../components/AddNumbersBulkForm/AddNumbersBulkForm';

import { styles } from './ProviderAdministrationPage.styles';

import { useProviders } from '../hooks/useProviders';

const ProviderAdministrationPage: React.FC = () => {
    const [selectedProviderId, setSelectedProviderId] = useState<string>('');
    const [selectedCountryId, setSelectedCountryId] = useState<string>('');
    const [providerDetails, setProviderDetails] = useState<any>(null);
    const { providers, countries, loading } = useProviders();

    useEffect(() => {
        const loadDetails = async () => {
            if (!selectedProviderId) {
                setProviderDetails(null);
                return;
            }
            try {
                const res = await fetch(`http://localhost:8080/provider/${selectedProviderId}`);
                const data = await res.json();
                setProviderDetails(data);
            } catch {
                setProviderDetails(null);
            }
        };
        loadDetails();
    }, [selectedProviderId]);

    const handleProviderDetailChange = (field: string, value: any) => {
        setProviderDetails((prev: any) => ({ ...prev, [field]: value }));
    };

    if (loading) {
        return (
            <Box sx={styles.loadingContainer}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={styles.container}>
            <Typography variant="subtitle2" sx={styles.breadcrumb}>
                <span style={{fontSize: '1rem', color: '#888'}}>Administration {'>'} Provider Administration</span>

            </Typography>

            <ProviderSelector
                providers={providers}
                selectedProviderId={selectedProviderId}
                onSelectProvider={setSelectedProviderId}
            />

            <ProviderEditForm providerDetails={providerDetails} onDetailChange={handleProviderDetailChange} />

            <AddNumbersRangeForm countries={countries} providerId={selectedProviderId} />

            <AddSpecificNumbersForm countries={countries} />

            <CurrentRangesTable
                selectedProviderId={selectedProviderId}
                providers={providers}
                countryStats={providerDetails?.countryStats}
            />

            <AddNumbersBulkForm
                selectedProviderId={selectedProviderId}
                selectedCountryId={selectedCountryId}
            />
        </Box>
    );
};

export default ProviderAdministrationPage;