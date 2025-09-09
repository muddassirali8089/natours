import { User } from 'lucide-react'

const UserAvatar = ({ 
  user, 
  size = 'md', 
  className = '',
  showName = false,
  nameClassName = ''
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20',
    '3xl': 'w-32 h-32'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
    '2xl': 'w-10 h-10',
    '3xl': 'w-16 h-16'
  }

  const avatarSize = sizeClasses[size] || sizeClasses.md
  const iconSize = iconSizes[size] || iconSizes.md

  return (
    <div className={`flex items-center ${showName ? 'space-x-3' : ''} ${className}`}>
      <div className={`${avatarSize} rounded-full overflow-hidden flex-shrink-0`}>
        {user?.photo ? (
          <img
            src={user.photo}
            alt={user.name || 'User'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <User className={`${iconSize} text-white`} />
          </div>
        )}
      </div>
      {showName && user?.name && (
        <span className={`font-medium text-gray-900 ${nameClassName}`}>
          {user.name}
        </span>
      )}
    </div>
  )
}

export default UserAvatar
