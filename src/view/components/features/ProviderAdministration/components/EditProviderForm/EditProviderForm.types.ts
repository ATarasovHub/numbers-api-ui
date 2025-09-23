import { NumberProvider } from '../../../../../../utils/domain';

export interface EditProviderFormProps {
    open: boolean;
    onClose: () => void;
    provider: NumberProvider | null;
    onProviderUpdated: (updatedProvider: NumberProvider) => void;
}

export interface EditProviderData {
    providerName?: string;
    totalCountries?: number;
    totalNumbers?: number;
    totalAssignedNumbers?: number;
    totalMonthlyCost?: number;
}