export interface NumberProvider {
    providerId: number
    providerName: string
    deletedAt: string
    totalCountries: number
    totalNumbers: number
    totalAssignedNumbers: number
    totalMonthlyCost: number
    countryStats: CountryStats[]
}

export interface CountryStats {
    countryId: number
    countryName:string
    countryCode: string
    totalNumbers: number
    assignedNumbers: number
    totalMonthlyCost: number
}

export interface CustomerOverview {
    customerId: number
    customerName: string
    productType: string
    totalNumbers: number
    proAccounts: CustomerOverviewProAccount[]
    proCountry: CustomerOverviewProCountry[]
}

export interface CustomerOverviewProAccount {
    techAccountId: number
    techAccountName: string
    totalAccounts: number
    totalNumbers: number
}

export interface CustomerOverviewProCountry {
    countryId: number
    countryName: string
    totalAccounts: number
    totalNumbers: number
}