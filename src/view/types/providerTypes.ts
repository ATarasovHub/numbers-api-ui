import { NumberProvider } from "../../utils/domain";

export interface ProviderRowProps {
    provider: NumberProvider,
    onProviderUpdated: (updatedProvider: NumberProvider) => void,
    key?: number
}

export interface PhoneNumberData {
    number: string;
    status: string;
    customer: string | null;
    techAccount: string | null;
    endDate: string | null;
    commentare: string | null;
    monthlyCost: number | null;
    assignedDate: string | null;
}
