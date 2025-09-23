export interface Country {
    countryId: string;
    countryName: string;
}

export interface AddSpecificNumbersFormProps {
    countries: Country[];
}

export type SingleNumberRow = {
    id: string;
    number: string;
    countryId: string;
    serviceSms: boolean;
    serviceVoice: boolean;
};