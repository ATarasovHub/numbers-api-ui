import { useEffect, useState } from 'react';
import { ProviderOption, CountryOption } from '../pages/ProviderAdministrationPage.types';
import { normalizeToArray } from '../utils/normalizeToArray';

export const useProviders = () => {
    const [providers, setProviders] = useState<ProviderOption[]>([]);
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

    return { providers, countries, loading };
};