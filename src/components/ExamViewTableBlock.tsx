import { getPatients } from "../libs/orthancAPI/endpoint";
import logger from "../libs/logger";
import ExamViewTable from "../sections/ExamViewTable";
import { ChevronLeft, ChevronRight, Search, X, Send, Trash2 } from 'lucide-react';
import TextBox from "./textBox";
import { useState, useEffect } from 'react';

interface PatientProp {
  ID: string,
  isProtected?: boolean,
  isStable?: boolean,
  Labels?: string[],
  LastUpdate?: string,
  MainDicomTags?: {
      PatientBirthDate?: string,
      PatientID?: string,
      PatientName?: string,
      PatientSex?: string
  },
  Studies?: string[],
  Type: "Patient"
}

// call getPatients API to get all PatientsID or return void array
const fetchPatientIDs = async (): Promise<string[]> => {
    try {
        const response = await getPatients();
        logger.info('Fetched patients successfully', { 
            code: response.status,
            count: response.data.length });
        return response.data;
    } catch (error) {
        logger.error('Failed to fetch patients', {msgerror: error});
        return [];
    }
}

// fetch the patient details by patientID
const fetchPatientDetails = async (patientID: string): Promise<PatientProp | null> => {
    try {
        const response = await getPatients(patientID);
        const data = response.data as PatientProp;
        if (data.Type !== "Patient" && !data.ID) {  // validation check for patient data
            logger.error(`Invalid patient data: `, { 
                code: response.status,
                patientID: patientID,
                responseType: data.Type });
            return null;
        }
        logger.info(`Fetched patient details for ID: ${patientID}`, { code: response.status });
        return data;
    } catch (error) {
        logger.error(`Failed to fetch patient details for ID: ${patientID}`, {msgerror: error});
        return null;
    }
}

// table to display the patient infos in the Orthanc database
export default function ExamViewTableBlock() {
    const [patients, setPatients] = useState<PatientProp[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)

    // Fetch patients on component mount
    useEffect(() => {
        const loadPatients = async () => {
            setLoading(true)
            const patientIDs = await fetchPatientIDs()
            
            if (patientIDs.length === 0) {
                setLoading(false)
                return
            }

            // Fetch details for each patient
            const patientDetails = await Promise.all(
                patientIDs.map(id => fetchPatientDetails(id))
            )

            // Filter out null values (failed fetches)
            const validPatients = patientDetails.filter(p => p !== null) as PatientProp[]
            setPatients(validPatients)
            setLoading(false)
        }

        loadPatients()
    }, [])

    if (loading) {
        return <div className="text-white p-4">Loading patients...</div>
    }

    if (patients.length === 0) {
        return (
            <TextBox 
                value="No patients found in the Orthanc database."
                onChange={() => {}}
                disabled={true} 
            />
        )
    }

    // Pagination logic
    const totalPages = Math.ceil(patients.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentItems = patients.slice(startIndex, endIndex)

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
    }

    const goToPrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1))
    }

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6" style={{backgroundColor: '#223139'}}>
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-white">Exams Table</h4>  
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search exams..."
                        className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        // TODO: onchange handler
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-700">
                            <th className="text-left text-slate-400 text-xs font-medium py-3 px-4">Patient ID</th>
                            <th className="text-left text-slate-400 text-xs font-medium py-3 px-4">Patient Name</th>
                            <th className="text-left text-slate-400 text-xs font-medium py-3 px-4">Patient DoB</th>
                            <th className="text-left text-slate-400 text-xs font-medium py-3 px-4">Sex</th>
                            <th className="text-left text-slate-400 text-xs font-medium py-3 px-4">Number of Studies</th>
                            <th className="text-left text-slate-400 text-xs font-medium py-3 px-4">Last Update</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((patient) => (
                            <tr
                                key={patient.ID}
                                className="border-b border-slate-700/50 hover:bg-slate-700/30 transition cursor-pointer"
                            >
                                <td className="py-3 px-4 text-white text-sm">{patient.MainDicomTags?.PatientID || patient.ID}</td>
                                <td className="py-3 px-4 text-slate-300 text-sm">{patient.MainDicomTags?.PatientName || '-'}</td>
                                <td className="py-3 px-4 text-slate-300 text-sm">{patient.MainDicomTags?.PatientBirthDate || '-'}</td>
                                <td className="py-3 px-4 text-slate-300 text-sm">{patient.MainDicomTags?.PatientSex || '-'}</td>
                                <td className="py-3 px-4 text-slate-300 text-sm">{patient.Studies?.length || 0}</td>
                                <td className="py-3 px-4 text-slate-300 text-sm">{patient.LastUpdate || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
                <div className="text-sm text-slate-400">
                    Page {currentPage} of {totalPages} ({patients.length} total patients)
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={goToPrevPage}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                    </button>
                    <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1 px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        Next
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}