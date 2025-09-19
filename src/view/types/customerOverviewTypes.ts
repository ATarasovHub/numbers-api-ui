export interface Customer {
    customerId: number;
    customerName: string;
    productType?: string | null;
    totalNumbers: number;
    proAccounts: CustomerOverviewProAccount[];
    proCountries: CustomerOverviewProCountry[];
}

export interface CustomerOverviewProAccount {
    techAccountId: number;
    techAccountName: string;
    techAccountStatus: string;
    totalNumbers: number;
}

export interface CustomerOverviewProCountry {
    countryId: number;
    countryName: string;
    totalAccounts: number;
    totalNumbers: number;
}

export interface TechAccountDetails {
    startDate?: string | null;
    endDate?: string | null;
    number: string;
    comment?: string | null;
    numberProviderName: string;
    serviceDetail: string;
}