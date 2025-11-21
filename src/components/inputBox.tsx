interface InputBoxProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: 'text' | 'password' | 'email' | 'number'
  disabled?: boolean // Is the input disabled
  className?: string // Additional classes
}

export default function InputBox({
  value,
  onChange,
  placeholder = '',
  type = 'text',
  disabled = false,
  className = ''
}: InputBoxProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-lg
        bg-slate-700 border border-slate-600
        text-white placeholder-slate-400
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        disabled:opacity-50 disabled:cursor-not-allowed
        transition
        ${className}
      `}
    />
  )
}
