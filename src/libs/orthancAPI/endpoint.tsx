import config from '../../../config/orthancConfig.json'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

const orthancConfig = {
    username: config.username,
    password: config.password
};

let API_BASE_URL = `/orthanc-api`; // defined in vite.config for proxying
const getAuthHeaders = () => ({
    'Authorization': 'Basic ' + btoa(`${orthancConfig.username}:${orthancConfig.password}`)
});

// --------------------- Orthanc API ---------------------
// API_BASE_URL/system
// call the api to get system info with basic auth headers
export const getSystemInfo = async () => {
    const response = await fetch(`${API_BASE_URL}/system`, {
        headers: getAuthHeaders()
    });
    const data = await response.json();
    return { status: response.status, data };
}

export const getSeries = async (seriesID?: string) => {
    seriesID = seriesID || "";
    const response = await fetch(`${API_BASE_URL}/series/${seriesID}`, {
        headers: getAuthHeaders()
    });
    const data = await response.json();
    return { status: response.status, data };
}

export const getPatients = async (patientsID?: string) => {
    patientsID = patientsID || "";
    const response = await fetch(`${API_BASE_URL}/patients/${patientsID}`, {
        headers: getAuthHeaders()
    });
    const data = await response.json();
    return { status: response.status, data };
}

export const getStudies = async (studiesID?: string) => {
    studiesID = studiesID || "";
    const response = await fetch(`${API_BASE_URL}/studies/${studiesID}`, {
        headers: getAuthHeaders()
    });
    const data = await response.json();
    return { status: response.status, data };
}

export const getInstanceAllTags = async (instanceId:string) => {
    const response = await fetch(`${API_BASE_URL}/instances/${instanceId}/tags`, {
        headers: getAuthHeaders()
    });
    const data = await response.json();
    return { status: response.status, data };
}

export const createNewModality = async (modalityName: string, modalityData:string) => {
    const method: HttpMethod = 'PUT';
    const response = await fetch(`${API_BASE_URL}/modalities/${modalityName}`, {
        method,
        headers: {  
            ...getAuthHeaders(),
            'Content-Type': 'application/json'
        },
        body: modalityData
    });

    var data: any = "";
    try {
        data = await response.json();
    } catch (error) {
        data = error instanceof Error ? error.message : String(error);
    }
    return { status: response.status, data };
}

// Get all modalities or specific modality by ID
export const getModalities = async (modalityID?: string) => {
    const endpoint = modalityID 
        ? `${API_BASE_URL}/modalities/${modalityID}`
        : `${API_BASE_URL}/modalities?expand`;
    
    const response = await fetch(endpoint, {
        headers: getAuthHeaders()
    });
    const data = await response.json();
    return { status: response.status, data };
}

// Test modality connectivity using DICOM C-ECHO
export const testModalityEcho = async (modalityID: string) => {
    const response = await fetch(`${API_BASE_URL}/modalities/${modalityID}/echo`, {
        method: 'POST',
        headers: getAuthHeaders()
    });
    
    let data: any = null;
    try {
        data = await response.json();
    } catch (error) {
        // C-ECHO may return empty response on success
        data = response.ok;
    }
    
    return { status: response.status, data };
}

const OrthancAPI = {
    getSystemInfo,
    getPatients,
    getStudies,
    getSeries,
    getInstanceAllTags,
    createNewModality,
    getModalities,
    testModalityEcho
};

export default OrthancAPI;