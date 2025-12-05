import { getStudies, getSeries } from "../libs/orthancAPI/endpoint";
import logger from "../libs/logger";
import DropDown from "./dropDown";
import { PatientProp } from './ExamViewTableBlock';
import { useState, useEffect } from 'react';

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

interface AvailableRobotProp {
    // TODO: interface with system monitoring data
}

interface ExamViewTablePopupWindowProps {
  readonly patientDetails: PatientProp;
  readonly onClose: () => void;
}

// fetch the study details by studyID
const fetchStudyDetails = async (studyID: string): Promise<StudyProp | null> => {
    try {
        const response = await getStudies(studyID);
        const data = response.data as StudyProp;
        if (data.Type !== "Study" && !data.ID) {  // validation check for patient data
            logger.error(`Invalid study data: `, { 
                code: response.status,
                studyID: studyID,
                responseType: data.Type});
            return null;
        }
        logger.info(`Fetched study details for ID: ${studyID}`, { code: response.status,
                                                                  body: data });
        return data;
    } catch (error) {
        logger.error(`Failed to fetch study details for ID: ${studyID}`, {msgerror: error});
        return null;
    }
}

// fetch the series details by seriesID
const fetchSeriesDetails = async (seriesID: string): Promise<SeriesProp | null> => {
    try {
        const response = await getSeries(seriesID);
        const data = response.data as SeriesProp;
        if (data.Type !== "Series" && !data.ID) {  // validation check for series data
            logger.error(`Invalid series data: `, {
                code: response.status,
                seriesID: seriesID,
                responseType: data.Type});
            return null;
        }
        logger.info(`Fetched series details for ID: ${seriesID}`, { code: response.status,
                                                                  body: data });
        return data;
    } catch (error) {
        logger.error(`Failed to fetch series details for ID: ${seriesID}`, {msgerror: error});
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

  // fetch study details when patientDetails change
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

        // Filter out null values
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

  // fetch series details when selectStudyID change
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

        // Filter out null values
        const validSeries = seriesDetails.filter(s => s !== null) as SeriesProp[];
        setSeries(validSeries);
        setLoadingSeries(false);
    };

    if (selectedStudyId) {
        loadSeries();
    } else {
        setLoading(false);
    }
  }, [selectedStudyId]);


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
          {/* option - study */}
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
          {/* option - series */}
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
         {/* option - robots */}
            <DropDown
                label="Available System"
                value={selectedRobot}
                onChange={setSelectedRobot}
                placeholder="-- Select a robot --"
                options={[] /* TODO: populate with available robots */}
            />
        </div>
      </div>
    </div>
  );
}