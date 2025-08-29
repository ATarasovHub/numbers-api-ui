export interface NumberOverview {
    numberId: number;
    number: string;
    startDate: string | null;
    endDate: string | null;
    customerName: string;
    techAccountName: string;
    customerStatus: string;
    techAccountStatus: string;
    serviceDetail: string;
    comment: string | null;
    monthlyCost: number | null;
    countryId: number;
    countryName: string;
    assignmentStatus: string;
}

export interface CustomerData {
    customerId: number;
    customerName: string;
    productType: string;
    totalNumbers: number;
    proAccounts: ProAccount[];
}

export interface ProAccount {
    techAccountId: number;
    techAccountName: string;
    totalAccounts: number;
    totalNumbers: number;
}

export interface TechAccountData {
    techAccountId: number;
    techAccountName: string;
}
