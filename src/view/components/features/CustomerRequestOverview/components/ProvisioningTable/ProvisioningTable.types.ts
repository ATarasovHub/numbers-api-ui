export interface ProvisioningRow {
    provider: string;
    bp: string;
    comment: string;
    requestedNumbers: number;
    date: string;
}

export interface ProvisioningTableProps {
    provisioning: ProvisioningRow[];
}

export interface ProvisioningRowProps {
    row: ProvisioningRow;
    onEdit: () => void;
    onDelete: () => void;
}

export interface ProvisioningHeaderProps {
}