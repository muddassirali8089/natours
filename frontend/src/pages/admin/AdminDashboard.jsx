import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Users, 
  MapPin, 
  Star, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Activity,
  ArrowLeft,
  Home
} from 'lucide-react'
import { fetchTourStats, fetchMonthlyPlan, selectTourStats, selectMonthlyPlan, selectToursLoading, selectToursError } from '../../features/tour/tourSlice'
import { fetchUsers, selectUsers, selectUsersLoading, selectUsersError } from '../../features/user/userSlice'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const stats = useSelector(selectTourStats)
  const monthlyPlan = useSelector(selectMonthlyPlan)
  const users = useSelector(selectUsers)
  const toursLoading = useSelector(selectToursLoading)
  const toursError = useSelector(selectToursError)
  const usersLoading = useSelector(selectUsersLoading)
  const usersError = useSelector(selectUsersError)

  useEffect(() => {
    dispatch(fetchTourStats())
    dispatch(fetchMonthlyPlan(new Date().getFullYear()))
    dispatch(fetchUsers())
  }, [dispatch])

  // Console log API responses for debugging
  useEffect(() => {
    console.log('🔍 AdminDashboard API Responses:')
    console.log('📊 Tour Stats (raw):', stats)
    console.log('📊 Tour Stats type:', typeof stats, 'isArray:', Array.isArray(stats))
    console.log('📅 Monthly Plan (raw):', monthlyPlan)
    console.log('👥 Users (raw):', users)
    console.log('👥 Users type:', typeof users, 'isArray:', Array.isArray(users))
    console.log('👥 Users length:', users?.length)
  }, [stats, monthlyPlan, users])

  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth()

  // Calculate stats from API data
  const totalUsers = users && Array.isArray(users) ? users.length : 0
  const activeUsers = users && Array.isArray(users) ? users.filter(user => user.active !== false).length : 0
  const verifiedUsers = users && Array.isArray(users) ? users.filter(user => user.emailVerified).length : 0
  
  // Calculate tour stats from the stats array
  // Note: stats comes from Redux as the actual data array, not wrapped in data object
  const totalTours = stats && Array.isArray(stats) ? stats.reduce((sum, stat) => sum + stat.numTours, 0) : 0
  const totalReviews = stats && Array.isArray(stats) ? stats.reduce((sum, stat) => sum + stat.numRating, 0) : 0
  const avgRating = stats && Array.isArray(stats) && totalReviews > 0 
    ? (stats.reduce((sum, stat) => sum + (stat.avgRating * stat.numRating), 0) / totalReviews).toFixed(1)
    : '0.0'

  // Debug calculations
  console.log('🧮 Calculated Stats:')
  console.log('Total Tours:', totalTours)
  console.log('Total Users:', totalUsers)
  console.log('Total Reviews:', totalReviews)
  console.log('Average Rating:', avgRating)
  console.log('Active Users:', activeUsers)
  console.log('Verified Users:', verifiedUsers)

  const statsCards = [
    {
      title: 'Total Tours',
      value: totalTours,
      icon: MapPin,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Average Rating',
      value: avgRating,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Total Reviews',
      value: totalReviews,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ]

  const userStatsCards = [
    {
      title: 'Active Users',
      value: activeUsers,
      percentage: totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(1) : 0,
      icon: Users,
      color: 'text-green-600',
    },
    {
      title: 'Verified Users',
      value: verifiedUsers,
      percentage: totalUsers > 0 ? ((verifiedUsers / totalUsers) * 100).toFixed(1) : 0,
      icon: Star,
      color: 'text-blue-600',
    },
  ]

  // Show loading state if data is still loading
  if (toursLoading || usersLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard data..." />
      </div>
    )
  }

  // Show error state if there are errors
  if (toursError || usersError) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Error Loading Dashboard</h1>
            {toursError && (
              <p className="text-red-600 mb-2">Tour data error: {toursError}</p>
            )}
            {usersError && (
              <p className="text-red-600 mb-4">User data error: {usersError}</p>
            )}
            <button
              onClick={() => {
                dispatch(fetchTourStats())
                dispatch(fetchMonthlyPlan(new Date().getFullYear()))
                dispatch(fetchUsers())
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900">Admin Dashboard</h1>
              <p className="text-secondary-600 mt-2">
                Welcome to your admin panel. Here's an overview of your platform.
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Site
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                User Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userStatsCards.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full bg-white ${stat.color}`}>
                        <stat.icon className="w-4 h-4" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-secondary-900">{stat.title}</p>
                        <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-secondary-600">{stat.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tour Difficulty Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Tour Difficulty
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats && Array.isArray(stats) && stats.length > 0 ? (
                <div className="space-y-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-secondary-900 capitalize">
                          {stat._id.toLowerCase()}
                        </p>
                        <p className="text-xs text-secondary-600">
                          {stat.numTours} tours • {stat.numRating} reviews
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary-600">
                          {stat.avgRating.toFixed(1)}★
                        </p>
                        <p className="text-xs text-secondary-600">
                          ${stat.avgPrice.toFixed(0)} avg
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No tour statistics available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Monthly Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Monthly Plan {currentYear}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {monthlyPlan && monthlyPlan.monthlyStats && Array.isArray(monthlyPlan.monthlyStats) && monthlyPlan.monthlyStats.length > 0 ? (
                <div className="space-y-4">
                  {monthlyPlan.monthlyStats.slice(0, 6).map((month, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-secondary-900">
                          {new Date(currentYear, month.month - 1).toLocaleString('default', { month: 'long' })}
                        </p>
                        <p className="text-xs text-secondary-600">{month.numTourStarts} tour starts</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary-600">
                          {month.numTourStarts}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No tour starts planned for {currentYear}</p>
                  <p className="text-sm text-gray-500 mt-2">Tours will appear here when start dates are added</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/admin/tours"
                className="p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors"
              >
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-primary-600 mr-3" />
                  <div>
                    <p className="font-medium text-secondary-900">Manage Tours</p>
                    <p className="text-sm text-secondary-600">Add, edit, or delete tours</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/users"
                className="p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors"
              >
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-primary-600 mr-3" />
                  <div>
                    <p className="font-medium text-secondary-900">Manage Users</p>
                    <p className="text-sm text-secondary-600">View and manage user accounts</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/reviews"
                className="p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors"
              >
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-primary-600 mr-3" />
                  <div>
                    <p className="font-medium text-secondary-900">Manage Reviews</p>
                    <p className="text-sm text-secondary-600">Moderate user reviews</p>
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard
