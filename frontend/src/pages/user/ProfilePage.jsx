import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { 
  User,
  Mail,
  Camera,
  Save,
  Edit,
  Lock,
  Shield
} from 'lucide-react'
import { 
  updateProfile,
  updatePassword,
  selectUser,
  selectAuthLoading,
  selectAuthError
} from '../../features/auth/authSlice'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import toast from 'react-hot-toast'

const ProfilePage = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const isLoading = useSelector(selectAuthLoading)
  const error = useSelector(selectAuthError)

  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  })

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm()

  const onProfileSubmit = async (data) => {
    try {
      await dispatch(updateProfile(data)).unwrap()
      toast.success('Profile updated successfully')
      setIsEditing(false)
    } catch (error) {
      toast.error(error || 'Failed to update profile')
    }
  }

  const onPasswordSubmit = async (data) => {
    try {
      await dispatch(updatePassword(data)).unwrap()
      toast.success('Password updated successfully')
      resetPassword()
    } catch (error) {
      toast.error(error || 'Failed to update password')
    }
  }

  const handleEditClick = () => {
    setIsEditing(true)
    resetProfile({
      name: user?.name || '',
      email: user?.email || '',
    })
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    resetProfile({
      name: user?.name || '',
      email: user?.email || '',
    })
  }

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'lead-guide': return 'Lead Guide'
      default: return role.charAt(0).toUpperCase() + role.slice(1)
    }
  }

  const roleColors = {
    user: 'bg-blue-100 text-blue-800',
    guide: 'bg-green-100 text-green-800',
    'lead-guide': 'bg-purple-100 text-purple-800',
    admin: 'bg-red-100 text-red-800',
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">My Profile</h1>
          <p className="text-secondary-600 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    {user?.photo ? (
                      <img
                        className="h-24 w-24 rounded-full object-cover mx-auto"
                        src={user.photo}
                        alt={user.name}
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center mx-auto">
                        <User className="h-12 w-12 text-primary-600" />
                      </div>
                    )}
                    <button className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-2 hover:bg-primary-700 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="text-lg font-semibold text-secondary-900 mt-4">
                    {user?.name}
                  </h3>
                  <p className="text-secondary-600">{user?.email}</p>
                  <div className="flex flex-wrap justify-center gap-1 mt-2">
                    {user?.roles?.map((role) => (
                      <span
                        key={role}
                        className={`px-2 py-1 text-xs font-medium rounded-full ${roleColors[role]}`}
                      >
                        {getRoleDisplayName(role)}
                      </span>
                    ))}
                  </div>
                </div>

                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'profile'
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
                    }`}
                  >
                    <User className="w-4 h-4 inline mr-2" />
                    Profile Information
                  </button>
                  <button
                    onClick={() => setActiveTab('password')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'password'
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
                    }`}
                  >
                    <Lock className="w-4 h-4 inline mr-2" />
                    Change Password
                  </button>
                  {user?.roles?.includes('admin') && (
                    <button
                      onClick={() => setActiveTab('admin')}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'admin'
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
                      }`}
                    >
                      <Shield className="w-4 h-4 inline mr-2" />
                      Admin Panel
                    </button>
                  )}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Profile Information</CardTitle>
                    {!isEditing && (
                      <Button variant="outline" onClick={handleEditClick}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Input
                          label="Full Name"
                          {...registerProfile('name', {
                            required: 'Name is required',
                            minLength: {
                              value: 2,
                              message: 'Name must be at least 2 characters',
                            },
                          })}
                          error={profileErrors.name?.message}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Input
                          label="Email Address"
                          type="email"
                          {...registerProfile('email', {
                            required: 'Email is required',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address',
                            },
                          })}
                          error={profileErrors.email?.message}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                      <div>
                        <p className="font-medium text-secondary-900">Email Verification</p>
                        <p className="text-sm text-secondary-600">
                          {user?.emailVerified ? 'Your email is verified' : 'Please verify your email address'}
                        </p>
                      </div>
                      <div>
                        {user?.emailVerified ? (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Verified
                          </span>
                        ) : (
                          <Button variant="outline" size="sm">
                            Resend Verification
                          </Button>
                        )}
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex justify-end space-x-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" loading={isLoading}>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            )}

            {activeTab === 'password' && (
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-6">
                    <div>
                      <Input
                        label="Current Password"
                        type="password"
                        {...registerPassword('currentPassword', {
                          required: 'Current password is required',
                        })}
                        error={passwordErrors.currentPassword?.message}
                      />
                    </div>
                    <div>
                      <Input
                        label="New Password"
                        type="password"
                        {...registerPassword('password', {
                          required: 'New password is required',
                          minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters',
                          },
                          pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                            message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
                          },
                        })}
                        error={passwordErrors.password?.message}
                      />
                    </div>
                    <div>
                      <Input
                        label="Confirm New Password"
                        type="password"
                        {...registerPassword('confirmPassword', {
                          required: 'Please confirm your new password',
                          validate: (value) =>
                            value === document.querySelector('input[name="password"]')?.value ||
                            'Passwords do not match',
                        })}
                        error={passwordErrors.confirmPassword?.message}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" loading={isLoading}>
                        <Lock className="w-4 h-4 mr-2" />
                        Update Password
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeTab === 'admin' && user?.roles?.includes('admin') && (
              <Card>
                <CardHeader>
                  <CardTitle>Admin Panel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a
                      href="/admin"
                      className="p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <Shield className="w-5 h-5 text-primary-600 mr-3" />
                        <div>
                          <p className="font-medium text-secondary-900">Dashboard</p>
                          <p className="text-sm text-secondary-600">View admin dashboard</p>
                        </div>
                      </div>
                    </a>
                    <a
                      href="/admin/tours"
                      className="p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <User className="w-5 h-5 text-primary-600 mr-3" />
                        <div>
                          <p className="font-medium text-secondary-900">Manage Tours</p>
                          <p className="text-sm text-secondary-600">Add, edit, or delete tours</p>
                        </div>
                      </div>
                    </a>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
