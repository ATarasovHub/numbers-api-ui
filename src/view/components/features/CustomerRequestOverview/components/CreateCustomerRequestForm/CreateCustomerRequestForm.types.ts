export interface Provider {
    providerId: string;
    providerName: string;
}

export interface BP {
    id: string;
    name: string;
}

export interface CreateCustomerRequestFormProps {
    providers: Provider[];
    bps: BP[];
}

export interface CustomerRequestPayload {
    requestedNumbers: number;
    providerId: string;
    bp: string;
    comment: string;
    requestDate: string;
}