export interface Country {
    countryId: string;
    countryName: string;
}

export interface AddNumbersRangeFormProps {
    countries: Country[];
    providerId: string | number;
}

export interface NumberRange {
    from: number;
    to: number;
}