interface TextBoxProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  type?: 'text' | 'password' | 'email' | 'number'
  disabled?: boolean
  error?: string
  className?: string // Additional classes
  required?: boolean
  multiline?: boolean
  rows?: number
}

export default function TextBox({
  value,
  onChange,
  placeholder = '',
  label,
  type = 'text',
  disabled = false,
  error,
  className = '',
  required = false,
  multiline = false,
  rows = 4
}: TextBoxProps) {
  const inputClassName = `
    px-4 py-2 rounded-lg
    bg-slate-700 border border-slate-600
    text-white placeholder-slate-400
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    disabled:opacity-50 disabled:cursor-not-allowed
    transition
    ${error ? 'border-red-500 focus:ring-red-500' : ''}
  `

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-slate-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={rows}
          className={`${inputClassName} resize-none`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClassName}
        />
      )}
      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  )
}
