interface ClickButtonProps {
  onClick: () => void
  children: string
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean // Is the button disabled
  className?: string // Additional classes
}

export default function ClickButton({ 
  onClick, 
  children, 
  className = '',
  variant = 'primary',
  disabled = false
}: ClickButtonProps) {
  const baseStyles = "px-4 py-2 rounded-lg transition font-medium focus:outline-none focus:ring-2"
  
  const variantStyles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary: "bg-slate-700 hover:bg-slate-600 text-white focus:ring-slate-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
  }
  
  const disabledStyles = "opacity-50 cursor-not-allowed"

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${disabled ? disabledStyles : ''} ${className}`}
    >
      {children}
    </button>
  )
}