import { Loader2 } from 'lucide-react'
import clsx from 'clsx'

const LoadingSpinner = ({ 
  size = 'md', 
  className = '',
  text = 'Loading...' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  }

  return (
    <div className={clsx('flex items-center justify-center', className)}>
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className={clsx('animate-spin text-primary-600', sizeClasses[size])} />
        {text && (
          <p className="text-sm text-secondary-600 animate-pulse">{text}</p>
        )}
      </div>
    </div>
  )
}

export default LoadingSpinner
