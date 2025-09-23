export interface Provider {
    numberProviderId: string;
    numberProviderName: string;
}

export interface ProviderSelectorProps {
    providers: Provider[];
    selectedProviderId: string;
    onSelectProvider: (providerId: string) => void;
}