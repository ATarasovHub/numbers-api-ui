export interface NumberDTO {
    numberId: number;
    number: string;
    numberProviderId: number;
    countryId: number;
    smsEnabled: boolean;
    voiceEnabled: boolean;
}

export interface BulkNumbersResponseDTO {
    created: NumberDTO[];
    duplicatesInRequest: string[];
    invalidFormat: string[];
    alreadyExist: string[];
}