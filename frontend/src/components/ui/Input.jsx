import { forwardRef } from 'react'
import clsx from 'clsx'

const Input = forwardRef(({
  label,
  error,
  helperText,
  className = '',
  required = false,
  rightIcon,
  ...props
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-secondary-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={ref}
          className={clsx(
            'input',
            error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
            rightIcon && 'pr-10',
            className
          )}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-secondary-500">{helperText}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
