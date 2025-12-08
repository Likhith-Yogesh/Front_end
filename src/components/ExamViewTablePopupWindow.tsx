import { getStudies, getSeries, getModalities, testModalityEcho, createNewModality } from "../libs/orthancAPI/endpoint";
import logger from "../libs/logger";
import DropDown from "./dropDown";
import { PatientProp } from './ExamViewTableBlock';
import { useState, useEffect } from 'react';
import type { ModalityStatus } from '../types/modality';

interface StudyProp {
  ID: string;
  IsStable?: boolean;
  Labels?: string[];
  LastUpdate?: string;
  MainDicomTags: {
    AccessionNumber?: string;
    InstitutionName?: string;
    ReferringPhysicianName?: string;
    StudyDate?: string;
    StudyDescription?: string;
    StudyID?: string;
    StudyInstanceUID?: string;
    StudyTime?: string;
  };
  ParentPatient?: string;
  PatientMainDicomTags: {
    PatientBirthDate?: string;
    PatientID?: string;
    PatientName?: string;
    PatientSex?: string;
  };
  Series: string[];
  Type: "Study";
}

interface SeriesProp {
  ExpectedNumberOfInstances?: number;
  ID: string;
  Instances?: string[];
  IsStable?: boolean;
  Labels?: string[];
  LastUpdate?: string;
  MainDicomTags: {
    BodyPartExamined?: string;
    ContrastBolusAgent?: string;
    ImageOrientationPatient?: string;
    ImagesInAcquisition?: string;
    Manufacturer?: string;
    Modality?: string;
    SeriesDate?: string;
    SeriesDescription?: string;
    SeriesInstanceUID?: string;
    SeriesNumber?: string;
    SeriesTime?: string;
    StationName?: string;
  };
  ModifiedFrom?: string;
  ParentStudy: string;
  Status?: string;
  Type: "Series";
}

interface ExamViewTablePopupWindowProps {
  readonly patientDetails: PatientProp;
  readonly onClose: () => void;
}

// ========== MODALITY MANAGEMENT FUNCTIONS ==========

export const createOrUpdateModality = async (aet: string, host: string, port: number) => {
    try {
        const modalityData = JSON.stringify([aet, host, port, 'Generic']);
        const response = await createNewModality(aet, modalityData);
        
        if (response.status === 200 || response.status === 201) {
            logger.info(`Modality ${aet} created/updated successfully`);
            return { success: true, data: response.data };
        } else {
            logger.error(`Failed to create/update modality ${aet}`, { 
                status: response.status, 
                error: response.data 
            });
            return { success: false, error: response.data };
        }
    } catch (error) {
        logger.error(`Error creating/updating modality ${aet}`, { error });
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};

export const deleteModality = async (aet: string) => {
    try {
        const response = await fetch(`/orthanc-api/modalities/${aet}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Basic ' + btoa('TestUser:Globus1234!')
            }
        });

        if (response.ok) {
            logger.info(`Modality ${aet} deleted successfully`);
            return { success: true };
        } else {
            const errorText = await response.text();
            logger.error(`Failed to delete modality ${aet}`, { 
                status: response.status, 
                error: errorText 
            });
            return { success: false, error: errorText };
        }
    } catch (error) {
        logger.error(`Error deleting modality ${aet}`, { error });
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};

export const testModalityConnection = async (aet: string) => {
    try {
        const response = await testModalityEcho(aet);

        if (response.status === 200) {
            logger.info(`C-ECHO success for modality ${aet}`);
            return { success: true };
        } else {
            logger.warn(`C-ECHO failed for modality ${aet}`, { status: response.status });
            return { success: false, status: response.status };
        }
    } catch (error) {
        logger.error(`C-ECHO error for modality ${aet}`, { error });
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};

// ========== END MODALITY MANAGEMENT FUNCTIONS ==========

const fetchStudyDetails = async (studyID: string): Promise<StudyProp | null> => {
    try {
        const response = await getStudies(studyID);
        const data = response.data as StudyProp;
        // Validation check: Ensure response is a valid Study type with required ID
        if (data.Type !== "Study" && !data.ID) {
            logger.error(`Invalid study data`, { 
                code: response.status,
                studyID: studyID,
                responseType: data.Type
            });
            return null;
        }
        logger.info(`Fetched study details for ID: ${studyID}`, { 
            code: response.status,
            body: data 
        });
        return data;
    } catch (error) {
        logger.error(`Failed to fetch study details for ID: ${studyID}`, { error });
        return null;
    }
}

const fetchSeriesDetails = async (seriesID: string): Promise<SeriesProp | null> => {
    try {
        const response = await getSeries(seriesID);
        const data = response.data as SeriesProp;
        // Validation check: Ensure response is a valid Series type with required ID
        if (data.Type !== "Series" && !data.ID) {
            logger.error(`Invalid series data`, {
                code: response.status,
                seriesID: seriesID,
                responseType: data.Type
            });
            return null;
        }
        logger.info(`Fetched series details for ID: ${seriesID}`, { 
            code: response.status,
            body: data 
        });
        return data;
    } catch (error) {
        logger.error(`Failed to fetch series details for ID: ${seriesID}`, { error });
        return null;
    }
}

export default function ExamViewTablePopupWindow({ patientDetails, onClose }: Readonly<ExamViewTablePopupWindowProps>) {
  const [studies, setStudies] = useState<StudyProp[]>([]);
  const [series, setSeries] = useState<SeriesProp[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSeries, setLoadingSeries] = useState(false);
  const [selectedStudyId, setSelectedStudyId] = useState<string>('');
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>('');
  const [selectedRobot, setSelectedRobot] = useState<string>('');
  const [availableRobots, setAvailableRobots] = useState<ModalityStatus[]>([]);
  const [loadingRobots, setLoadingRobots] = useState(false);

  useEffect(() => {
    const loadStudies = async (studyIDs: string[]) => {
        setLoading(true);
        
        if (studyIDs.length === 0) {
            setLoading(false);
            return;
        }

        const studyDetails = await Promise.all(
            studyIDs.map(id => fetchStudyDetails(id))
        );

        const validStudies = studyDetails.filter(s => s !== null) as StudyProp[];
        setStudies(validStudies);
        setLoading(false);
    };

    if (patientDetails.Studies) {
        loadStudies(patientDetails.Studies);
    } else {
        setLoading(false);
    }
  }, [patientDetails]);

  useEffect(() => {
    const loadSeries = async () => {
        setLoadingSeries(true);

        const studyDetails = await fetchStudyDetails(selectedStudyId);
        if (!studyDetails?.Series?.length) {
            setSeries([]);
            setLoadingSeries(false);
            return;
        }

        const seriesDetails = await Promise.all(
            studyDetails.Series.map(id => fetchSeriesDetails(id))
        );

        const validSeries = seriesDetails.filter(s => s !== null) as SeriesProp[];
        setSeries(validSeries);
        setLoadingSeries(false);
    };

    if (selectedStudyId) {
        loadSeries();
    } else {
        setLoadingSeries(false);
    }
  }, [selectedStudyId]);

  // Effect 1: Fetch modalities list (without C-ECHO testing)
  useEffect(() => {
    const loadRobots = async () => {
        setLoadingRobots(true);
        try {
            const response = await getModalities();
            
            if (response.status !== 200) {
                logger.error(`Failed to fetch modalities from Orthanc`, { 
                    status: response.status,
                    error: response.data 
                });
                setLoadingRobots(false);
                return;
            }

            const modalitiesData = response.data;
            
            const modalitiesArray: ModalityStatus[] = Object.entries(modalitiesData).map(([aet, config]: [string, any]) => {
                return {
                    aet: aet,
                    host: config[1] || config.Host || 'Unknown',
                    port: config[2] || config.Port || 4242,
                    isOnline: false,
                    isCreatedSuccessfully: true,
                    lastChecked: new Date().toISOString()
                };
            });

            setAvailableRobots(modalitiesArray);
            logger.info('Loaded available robots from Orthanc', { count: modalitiesArray.length });
        } catch (error) {
            logger.error('Failed to load robots from Orthanc', { error });
        } finally {
            setLoadingRobots(false);
        }
    };

    loadRobots();
  }, []);

  // Effect 2: Test connectivity separately (runs after modalities are loaded)
  useEffect(() => {
    if (availableRobots.length === 0 || loadingRobots) return;

    const testConnectivity = async () => {
        logger.info('Starting C-ECHO connectivity tests for all modalities');
        
        const updatedRobots = await Promise.all(
            availableRobots.map(async (robot) => {
                try {
                    const echoResponse = await testModalityEcho(robot.aet);
                    
                    if (echoResponse.status === 200) {
                        logger.info(`Modality ${robot.aet} is online`);
                        return { 
                            ...robot, 
                            isOnline: true,
                            lastChecked: new Date().toISOString()
                        };
                    } else {
                        logger.warn(`Modality ${robot.aet} C-ECHO failed`, { 
                            status: echoResponse.status 
                        });
                        return {
                            ...robot,
                            lastChecked: new Date().toISOString()
                        };
                    }
                } catch (error) {
                    logger.error(`C-ECHO test failed for ${robot.aet}`, { error });
                    return {
                        ...robot,
                        lastChecked: new Date().toISOString()
                    };
                }
            })
        );
        
        setAvailableRobots(updatedRobots);
        logger.info('C-ECHO connectivity testing completed');
    };

    testConnectivity();
  }, [availableRobots.length, loadingRobots]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-700 sticky top-0 bg-slate-800">
          <h3 className="text-lg font-semibold text-white">
            Patient {patientDetails.MainDicomTags?.PatientName} (Orthanc ID: {patientDetails.ID})
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition"> 
            ✕ 
          </button>
        </div>
        <div className="p-6">
          {loading && (
            <p className="text-slate-400 text-center">Loading studies...</p>
          )}
          {!loading && studies.length === 0 && (
            <p className="text-slate-400 text-center">No studies found for this patient.</p>
          )}
          {!loading && studies.length > 0 && (
            <DropDown
                label="Study"
                value={selectedStudyId}
                onChange={setSelectedStudyId}
                placeholder="-- Select a study --"
                options={studies.map((study) => ({
                  value: study.ID,
                  label: `${study.MainDicomTags.StudyDate || 'N/A'} | ${study.MainDicomTags.StudyDescription || 'Untitled Study'} | Series: ${study.Series ? study.Series.length : 0}`
                }))}
              />
          )}
          {!selectedStudyId && (
            <p className="text-slate-400 text-center">Please select study first</p>
          )}
          {selectedStudyId && !loadingSeries && series.length === 0 && (
            <p className="text-slate-400 text-center">No series found for this study.</p>
          )}
          {!loadingSeries && series.length > 0 && (
            <DropDown
                label="Series"
                value={selectedSeriesId}
                onChange={setSelectedSeriesId}
                placeholder= "-- Select a series --"
                options={series.map((serie) => ({
                    value: serie.ID,
                    label: `${serie.LastUpdate} | ${serie.MainDicomTags.Manufacturer || 'N/A'} | ${serie.MainDicomTags.SeriesDescription || 'Untitled Series'} | Instances: ${serie.Instances ? serie.Instances.length : 0}`
                }))}
                disabled={loadingSeries || series.length === 0}
            />
            )
         }
         <DropDown
            label="Available System"
            value={selectedRobot}
            onChange={setSelectedRobot}
            placeholder={loadingRobots ? "Loading robots..." : "-- Select a robot --"}
            options={availableRobots.map(robot => ({
                value: robot.aet,
                label: `${robot.aet} @ ${robot.host}:${robot.port} (${robot.isOnline ? '🟢 Online' : '🔴 Offline'})`
            }))}
            disabled={loadingRobots || availableRobots.length === 0}
        />
        </div>
      </div>
    </div>
  );
}