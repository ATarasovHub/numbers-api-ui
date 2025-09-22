import { CountryStats } from '../../../../../utils/domain';

export interface EditCountryStatsFormProps {
    open: boolean;
    onClose: () => void;
    countryStat: CountryStats | null;
    onSave: (updatedStat: CountryStats) => void;
}

export interface Range {
    fromNumber: string;
    toNumber: string;
    size: number;
    numberType: string;
    serviceSms: boolean;
    serviceVoice: boolean;
}

export interface EditCountryStatsFormData {
    countryName?: string;
    countryCode?: string;
    totalNumbers?: number;
    assignedNumbers?: number;
    totalMonthlyCost?: number;
}