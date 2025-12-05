## ExamViewTable Section Design

---

### Retrieve Image Hierarchy from Orthanc
```
Patient
  └── Study (Exam)
        └── Series
              └── Instance (Image/Object)
```

---

### Data Model
```
Patient
{
    "ID": "25325720-99a77319-78f8c52d-cce985a5-84ba2150",
    "IsProtected": false,
    "IsStable": true,
    "Labels": [],
    "LastUpdate": "20251029T184740",
    "MainDicomTags": {
        "PatientBirthDate": "",
        "PatientID": "EXEIJL",
        "PatientName": "FluoroCtPIL",
        "PatientSex": ""
    },
    "Studies": [
        "57398a48-407a05c8-0b30d283-551252d8-91a6efd4"
        ...
    ],
    "Type": "Patient"
}

study
{
    "ID": "1f172e79-4b3895ca-25183fdd-f7bbba0c-51e682fe",
    "IsStable": true,
    "Labels": [],
    "LastUpdate": "20251030T141217",
    "MainDicomTags": {
        "AccessionNumber": "",
        "InstitutionName": "Globus Methuen Training",
        "ReferringPhysicianName": "",
        "StudyDate": "20250717",
        "StudyDescription": "Silok case 07172025",
        "StudyID": "526",
        "StudyInstanceUID": "2.16.840.1.114587.2275407364.7624.1752757407.5157",
        "StudyTime": "090300"
    },
    "ParentPatient": "c50cfb5e-0f8e430b-dfb67776-e1671bc5-eada52ef",
    "PatientMainDicomTags": {
        "PatientBirthDate": "20000909",
        "PatientID": "JCE694M0",
        "PatientName": "Sam^Sam",
        "PatientSex": "M"
    },
    "Series": [
        "800bcb92-ca04118e-98a00210-85825e00-2faa3042"
        ...
    ],
    "Type": "Study"
}

series
{
    "ExpectedNumberOfInstances": null,
    "ID": "03d9f03a-8e39e9b4-7904280f-869ee9b5-a19f211a",
    "Instances": [
        "0007792d-647e59e0-9331d61a-9fd9810a-5e65c846",
        "00234c0c-bd57fc72-2b202863-a329e993-a4776218"
        ...
    ],
    "IsStable": true,
    "Labels": [],
    "LastUpdate": "20251117T194502",
    "MainDicomTags": {
        "BodyPartExamined": "Lumbar",
        "ContrastBolusAgent": "",
        "ImageOrientationPatient": "1\\-0\\0\\-0\\1\\-0",
        "ImagesInAcquisition": "512",
        "Manufacturer": "Globus Medical",
        "Modality": "CT",
        "SeriesDate": "20251110",
        "SeriesDescription": "CBCT_135654",
        "SeriesInstanceUID": "1.2.276.0.7230010.3.1.3.1216602213.1388.1763408697.932",
        "SeriesNumber": "1",
        "SeriesTime": "135654",
        "StationName": "E3D-0108"
    },
    "ModifiedFrom": "632d39bc-1443540b-a4479e01-00617ce0-c0bc3746",
    "ParentStudy": "c8cba926-77491023-1bab3c9d-b7477060-b95e5bf8",
    "Status": "Unknown",
    "Type": "Series"
}

```