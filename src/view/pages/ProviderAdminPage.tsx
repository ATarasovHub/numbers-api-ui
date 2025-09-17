import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

import ProviderSelector from '../components/ProviderSelector';
import ProviderEditForm from '../components/ProviderEditForm';
import AddNumbersRangeForm from '../components/AddNumbersRangeForm';
import AddSpecificNumbersForm from '../components/AddSpecificNumbersForm';
import CurrentRangesTable from '../components/CurrentRangesTable';
import AddNumbersBulkForm from '../components/AddNumbersBulkForm';

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

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch('http://localhost:8080/provider');
                const raw = await res.json();
                const arr = normalizeToArray(raw);
                setProviders(
                    arr.map((p: any): ProviderOption => ({
                        numberProviderId: String(p.providerId ?? p.numberProviderId ?? p.id),
                        numberProviderName: String(p.providerName ?? p.numberProviderName ?? p.name)
                    }))
                );
            } catch {
                setProviders([]);
            }
            try {
                const res = await fetch('http://localhost:8080/country');
                const raw = await res.json();
                const arr = normalizeToArray(raw);
                setCountries(
                    arr.map((c: any): CountryOption => ({
                        countryId: String(c.countryId ?? c.id),
                        countryName: String(c.countryName ?? c.name)
                    }))
                );
            } catch {
                setCountries([]);
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
