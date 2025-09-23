export interface ProviderDetails {
    providerId?: string | number;
    providerName?: string;
    deletedAt?: string;
    totalCountries?: number;
    totalNumbers?: number;
    totalAssignedNumbers?: number;
    totalMonthlyCost?: number;
}

export interface ProviderEditFormProps {
    providerDetails: ProviderDetails | null;
    onDetailChange: (field: string, value: any) => void;
}