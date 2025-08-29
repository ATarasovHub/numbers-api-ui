import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

import ProviderSelector from '../components/ProviderSelector';
import ProviderEditForm from '../components/ProviderEditForm';
import AddNumbersRangeForm from '../components/AddNumbersRangeForm';
import AddSpecificNumbersForm from '../components/AddSpecificNumbersForm';
import CurrentRangesTable from '../components/CurrentRangesTable';

import { boxStyle, subtitle2Style } from '../styles/ProviderAdminPageStyles';

function fakeApi<T>(data: T, delay = 300): Promise<T> {
    return new Promise(resolve => setTimeout(() => resolve(data), delay));
}

const ProviderAdminPage: React.FC = () => {
    const [providers, setProviders] = useState<{ numberProviderId: string; numberProviderName: string }[]>([]);
    const [selectedProviderId, setSelectedProviderId] = useState<string>('');
    const [providerDetails, setProviderDetails] = useState<any>(null);
    const [countries, setCountries] = useState<{ countryId: string; countryName: string }[]>([]);

    useEffect(() => {
        fetch('/provider')
            .then(res => res.json())
            .then(data => {
                setProviders(
                    data.map((p: any) => ({
                        numberProviderId: p.providerId,
                        numberProviderName: p.providerName
                    }))
                );
            });
        fetch('/countries')
            .then(res => res.json())
            .then(data => setCountries(
                data.map((c: any) => ({ countryId: String(c.countryId), countryName: c.countryName }))
            ));
    }, []);

    useEffect(() => {
        if (selectedProviderId) {
            fetch(`/provider/${selectedProviderId}`)
                .then(res => res.json())
                .then(data => setProviderDetails(data));
        } else {
            setProviderDetails(null);
        }
    }, [selectedProviderId]);

    const handleProviderDetailChange = (field: string, value: any) => {
        setProviderDetails((prev: any) => ({ ...prev, [field]: value }));
    };

    return (
        <Box sx={boxStyle}>
            <Typography variant="subtitle2" sx={subtitle2Style}>
                <span style={{fontSize: '1rem', color: '#888'}}>Administration &gt; Provider Administration</span>
            </Typography>

            <ProviderSelector
                providers={providers}
                selectedProviderId={selectedProviderId}
                onSelectProvider={setSelectedProviderId}
            />

            <ProviderEditForm
                providerDetails={providerDetails}
                onDetailChange={handleProviderDetailChange}
            />

            <AddNumbersRangeForm countries={countries} />

            <AddSpecificNumbersForm countries={countries} />

            <CurrentRangesTable
                selectedProviderId={selectedProviderId}
                providers={providers}
                countryStats={providerDetails?.countryStats}
            />
        </Box>
    );
};

export default ProviderAdminPage;
