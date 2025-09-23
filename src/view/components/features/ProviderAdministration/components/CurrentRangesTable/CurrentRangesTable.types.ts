export interface Provider {
    numberProviderId: string;
    numberProviderName: string;
}

export interface CountryStat {
    countryId: string;
    countryName: string;
    countryCode: string;
    totalNumbers: number;
    assignedNumbers: number;
    totalMonthlyCost: number;
}

export interface CurrentRangesTableProps {
    selectedProviderId: string;
    providers: Provider[];
    countryStats: CountryStat[] | undefined;
}