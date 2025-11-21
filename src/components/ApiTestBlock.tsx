import { useState } from "react"
import ClickButton from "../components/clickbutton"
import TextBox from "../components/textBox"
import InputBox from "../components/inputBox"

interface ApiTestBlockProps {
  title: string
  buttonText: string
  onExecute: (...args: string[]) => Promise<any>
  inputs?: Array<{
    placeholder: string
    value: string
    onChange: (value: string) => void
  }>
  resultRows?: number
}

export default function ApiTestBlock({
  title,
  buttonText,
  onExecute,
  inputs = [],
  resultRows = 8
}: ApiTestBlockProps) {
  const [result, setResult] = useState("")

  const handleExecute = async () => {
    try {
      const inputValues = inputs.map(input => input.value)
      const response = await onExecute(...inputValues)
      setResult(JSON.stringify(response, null, 2))
    } catch (error) {
      setResult(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }, null, 2))
    }
  }

  return (
    <div className="border border-slate-700 rounded-lg p-4 space-y-3 bg-slate-800/30">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      
      <div className="flex flex-wrap gap-2 items-center">
        <ClickButton onClick={handleExecute}>
          {buttonText}
        </ClickButton>
        
        {inputs.map((input, index) => (
          <InputBox
            key={index}
            placeholder={input.placeholder}
            value={input.value}
            onChange={input.onChange}
            className="flex-1 min-w-[200px]"
          />
        ))}
      </div>

      <TextBox
        value={result}
        onChange={setResult}
        multiline
        rows={resultRows}
        className="w-full font-mono text-sm"
      />
    </div>
  )
}
