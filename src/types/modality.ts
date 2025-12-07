export interface ModalityStatus {
    aet: string;
    host: string;
    port: number;
    manufacturer: string;
    isOnline: boolean;
    isCreatedSuccessfully: boolean;
    lastChecked: string;
    responseTime: number | null;
}

export interface ModalityConfig {
    AET: string;
    Host: string;
    Port: number;
    Manufacturer?: string;
}