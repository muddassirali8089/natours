import { useState, useEffect } from 'react'
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
  getCurrentUser,
  selectUser,
  selectAuthLoading,
  selectAuthError,
  selectIsAuthenticated
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
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)

  // Load current user data when component mounts
  useEffect(() => {
    if (!user) {
      dispatch(getCurrentUser())
    }
  }, [dispatch, user])


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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Profile</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="relative inline-block">
                    {user?.photo ? (
                      <img
                        className="h-32 w-32 rounded-full object-cover mx-auto shadow-lg border-4 border-white"
                        src={user.photo}
                        alt={user.name}
                      />
                    ) : (
                      <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto shadow-lg border-4 border-white">
                        <User className="h-16 w-16 text-white" />
                      </div>
                    )}
                    <button className="absolute bottom-2 right-2 bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">
                    {user?.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{user?.email}</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {user?.roles?.map((role) => (
                      <span
                        key={role}
                        className={`px-3 py-1 text-sm font-semibold rounded-full shadow-sm ${roleColors[role]}`}
                      >
                        {getRoleDisplayName(role)}
                      </span>
                    ))}
                  </div>
                </div>

                <nav className="space-y-3">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      activeTab === 'profile'
                        ? 'bg-blue-100 text-blue-700 shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-sm'
                    }`}
                  >
                    <User className="w-5 h-5 inline mr-3" />
                    Profile Information
                  </button>
                  <button
                    onClick={() => setActiveTab('password')}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      activeTab === 'password'
                        ? 'bg-blue-100 text-blue-700 shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-sm'
                    }`}
                  >
                    <Lock className="w-5 h-5 inline mr-3" />
                    Change Password
                  </button>
                  {user?.roles?.includes('admin') && (
                    <button
                      onClick={() => setActiveTab('admin')}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        activeTab === 'admin'
                          ? 'bg-blue-100 text-blue-700 shadow-md'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-sm'
                      }`}
                    >
                      <Shield className="w-5 h-5 inline mr-3" />
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
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl font-bold text-gray-900">Profile Information</CardTitle>
                    {!isEditing && (
                      <Button variant="outline" onClick={handleEditClick} className="bg-white hover:bg-gray-50 border-gray-300">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  {!isEditing ? (
                    // Display current user data
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <p className="text-lg font-medium text-gray-900">{user?.name || 'Loading...'}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <p className="text-lg font-medium text-gray-900">{user?.email || 'Loading...'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Edit form
                    <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
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
                            className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
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
                            className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      {isEditing && (
                        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancelEdit}
                            className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            Cancel
                          </Button>
                          <Button type="submit" loading={isLoading} className="px-6 py-2 bg-blue-600 hover:bg-blue-700">
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </Button>
                        </div>
                      )}
                    </form>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'password' && (
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                  <CardTitle className="text-2xl font-bold text-gray-900">Change Password</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-8">
                    <div className="space-y-2">
                      <Input
                        label="Current Password"
                        type="password"
                        {...registerPassword('currentPassword', {
                          required: 'Current password is required',
                        })}
                        error={passwordErrors.currentPassword?.message}
                        className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
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
                        className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
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
                        className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-200">
                      <Button type="submit" loading={isLoading} className="px-6 py-2 bg-blue-600 hover:bg-blue-700">
                        <Lock className="w-4 h-4 mr-2" />
                        Update Password
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeTab === 'admin' && user?.roles?.includes('admin') && (
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                  <CardTitle className="text-2xl font-bold text-gray-900">Admin Panel</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <a
                      href="/admin"
                      className="group p-6 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                          <Shield className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <p className="font-semibold text-gray-900 group-hover:text-blue-700">Dashboard</p>
                          <p className="text-sm text-gray-600">View admin dashboard</p>
                        </div>
                      </div>
                    </a>
                    <a
                      href="/admin/tours"
                      className="group p-6 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                          <User className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                          <p className="font-semibold text-gray-900 group-hover:text-green-700">Manage Tours</p>
                          <p className="text-sm text-gray-600">Add, edit, or delete tours</p>
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
