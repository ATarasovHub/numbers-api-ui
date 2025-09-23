export interface CountryStats {
    countryCode: string;
    countryName: string;
    totalNumbers: number;
    assignedNumbers: number;
    totalMonthlyCost: number;
}

export interface ProviderFormData {
    providerName: string;
    totalCountries: number;
    totalNumbers: number;
    totalAssignedNumbers: number;
    totalMonthlyCost: number;
    countryStats: CountryStats[];
}

export interface CreateProviderFormProps {
    onProviderCreated?: (provider: any) => void;
}