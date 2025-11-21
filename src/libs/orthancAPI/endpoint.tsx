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

export const getAllSeries = async () => {
    const response = await fetch(`${API_BASE_URL}/series`, {
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

const OrthancAPI = {
    getSystemInfo,
    getAllSeries,
    getInstanceAllTags,
    createNewModality
};

export default OrthancAPI;