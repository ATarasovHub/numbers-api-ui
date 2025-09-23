import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

import ProviderSelector from '../components/features/ProviderAdministration/components/ProviderSelector/ProviderSelector';
import ProviderEditForm from '../components/features/ProviderAdministration/components/ProviderEditForm/ProviderEditForm';
import AddNumbersRangeForm from '../components/features/ProviderAdministration/components/AddNumbersRangeForm/AddNumbersRangeForm';
import AddSpecificNumbersForm from '../components/features/ProviderAdministration/components/AddSpecificNumbersForm/AddSpecificNumbersForm';
import CurrentRangesTable from '../components/features/ProviderAdministration/components/CurrentRangesTable/CurrentRangesTable';
import AddNumbersBulkForm from '../components/features/ProviderAdministration/components/AddNumbersBulkForm/AddNumbersBulkForm';

import { boxStyle, subtitle2Style } from '../styles/ProviderAdminPageStyles';

type ProviderOption = { numberProviderId: string; numberProviderName: string };
type CountryOption = { countryId: string; countryName: string };

function normalizeToArray(d: unknown): any[] {
    if (Array.isArray(d)) return d;
    if (d && typeof d === 'object') {
        const o = d as Record<string, unknown>;
        const keys = ['items', 'content', 'data', 'result', 'results', 'providers', 'countries'];
        for (const k of keys) {
            const v = (o as any)[k];
            if (Array.isArray(v)) return v;
        }
    }
    return [];
}

const ProviderAdminPage: React.FC = () => {
    const [providers, setProviders] = useState<ProviderOption[]>([]);
    const [selectedProviderId, setSelectedProviderId] = useState<string>('');
    const [selectedCountryId, setSelectedCountryId] = useState<string>('');
    const [providerDetails, setProviderDetails] = useState<any>(null);
    const [countries, setCountries] = useState<CountryOption[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [providersRes, countriesRes] = await Promise.all([
                    fetch('http://localhost:8080/provider'),
                    fetch('http://localhost:8080/country')
                ]);

                const providersRaw = await providersRes.json();
                const providersArr = normalizeToArray(providersRaw);
                setProviders(
                    providersArr.map((p: any): ProviderOption => ({
                        numberProviderId: String(p.providerId ?? p.numberProviderId ?? p.id),
                        numberProviderName: String(p.providerName ?? p.numberProviderName ?? p.name)
                    }))
                );

                const countriesRaw = await countriesRes.json();
                const countriesArr = normalizeToArray(countriesRaw);
                setCountries(
                    countriesArr.map((c: any): CountryOption => ({
                        countryId: String(c.countryId ?? c.id),
                        countryName: String(c.countryName ?? c.name)
                    }))
                );
            } catch (error) {
                setProviders([]);
                setCountries([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

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
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={boxStyle}>
            <Typography variant="subtitle2" sx={subtitle2Style}>
                <span style={{ fontSize: '1rem', color: '#888' }}>Administration &gt; Provider Administration</span>
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

export default ProviderAdminPage;