export interface ModalityStatus {
    aet: string;
    host: string;
    port: number;
    isOnline: boolean;
    isCreatedSuccessfully: boolean;
    isCreatedSuccessfully: boolean; // True if modality exists in Orthanc response
    lastChecked: string;
    // manufacturer?: string;      // Commented out for now
    // responseTime?: number;      // Commented out for now
}

export interface ModalityConfig {
    AET: string;
    Host: string;
    Port: number;
    // Manufacturer?: string;      // Commented out for now
}