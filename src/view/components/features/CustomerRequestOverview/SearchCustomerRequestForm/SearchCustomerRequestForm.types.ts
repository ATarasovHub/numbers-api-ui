export interface Provider {
    providerId: string;
    providerName: string;
}

export interface ProvisioningType {
    id: number;
    name: string;
}

export interface BP {
    id: string;
    name: string;
}

export interface SearchCustomerRequestFormProps {
    providers: Provider[];
    onSearch: (params: { provider: string; bp: string }) => void;
}

export interface SearchParams {
    provisioningType: string;
    provider: string;
    bp: string;
}