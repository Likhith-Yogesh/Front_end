import { useState } from "react"
import { getSystemInfo, 
         getInstanceAllTags,
         createNewModality } from "../libs/orthancAPI/endpoint"
import Header from "../components/header"
import ApiTestBlock from "../components/ApiTestBlock"

export default function APITest() {
  const [instanceId, setInstanceId] = useState("")
  const [modalityName, setModalityName] = useState("")
  const [modalityData, setModalityData] = useState("")

  return (
    <div className="min-h-screen bg-slate-900">
      <Header 
        application="API Test Page"
        onExit={() => console.log("exiting the PACS server")}
        onLogout={() => console.log("logging out the PACS server")}
      />
      
      <div className="p-6 space-y-6">
        <ApiTestBlock
          title="System Information"
          buttonText="Get System Info"
          onExecute={getSystemInfo}
        />

        <ApiTestBlock
          title="Instance Tags"
          buttonText="Get Instance Tags"
          onExecute={getInstanceAllTags}
          inputs={[
            {
              placeholder: "Instance ID",
              value: instanceId,
              onChange: setInstanceId
            }
          ]}
        />

        <ApiTestBlock
          title="Create Modality"
          buttonText="Create New Modality"
          onExecute={createNewModality}
          inputs={[
            {
              placeholder: "Modality Name",
              value: modalityName,
              onChange: setModalityName
            },
            {
              placeholder: "Modality Data (JSON)",
              value: modalityData,
              onChange: setModalityData
            }
          ]}
        />
      </div>
    </div>
  )
}