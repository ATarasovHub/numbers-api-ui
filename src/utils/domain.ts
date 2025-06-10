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