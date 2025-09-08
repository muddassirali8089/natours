import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  Users, 
  MapPin, 
  Star, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Activity
} from 'lucide-react'
import { fetchTourStats, fetchMonthlyPlan } from '../../features/tour/tourSlice'
import { fetchUsers } from '../../features/user/userSlice'
import { selectTourStats, selectMonthlyPlan } from '../../features/tour/tourSlice'
import { selectUsers } from '../../features/user/userSlice'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const stats = useSelector(selectTourStats)
  const monthlyPlan = useSelector(selectMonthlyPlan)
  const users = useSelector(selectUsers)

  useEffect(() => {
    dispatch(fetchTourStats())
    dispatch(fetchMonthlyPlan(new Date().getFullYear()))
    dispatch(fetchUsers())
  }, [dispatch])

  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth()

  // Calculate some basic stats
  const totalUsers = users && Array.isArray(users) ? users.length : 0
  const activeUsers = users && Array.isArray(users) ? users.filter(user => user.active !== false).length : 0
  const verifiedUsers = users && Array.isArray(users) ? users.filter(user => user.emailVerified).length : 0

  const statsCards = [
    {
      title: 'Total Tours',
      value: stats?.totalTours || 0,
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
      value: stats?.avgRating?.toFixed(1) || '0.0',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Total Reviews',
      value: stats?.totalReviews || 0,
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

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Admin Dashboard</h1>
          <p className="text-secondary-600 mt-2">
            Welcome to your admin panel. Here's an overview of your platform.
          </p>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

          {/* Monthly Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Monthly Plan {currentYear}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {monthlyPlan && Array.isArray(monthlyPlan) ? (
                <div className="space-y-4">
                  {monthlyPlan.slice(0, 6).map((month, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-secondary-900">
                          {new Date(currentYear, index).toLocaleString('default', { month: 'long' })}
                        </p>
                        <p className="text-xs text-secondary-600">{month.numTours} tours</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary-600">
                          {month.numTours}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center py-8">
                  <LoadingSpinner size="md" text="Loading monthly plan..." />
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
              <a
                href="/admin/tours"
                className="p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors"
              >
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-primary-600 mr-3" />
                  <div>
                    <p className="font-medium text-secondary-900">Manage Tours</p>
                    <p className="text-sm text-secondary-600">Add, edit, or delete tours</p>
                  </div>
                </div>
              </a>

              <a
                href="/admin/users"
                className="p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors"
              >
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-primary-600 mr-3" />
                  <div>
                    <p className="font-medium text-secondary-900">Manage Users</p>
                    <p className="text-sm text-secondary-600">View and manage user accounts</p>
                  </div>
                </div>
              </a>

              <a
                href="/admin/reviews"
                className="p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors"
              >
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-primary-600 mr-3" />
                  <div>
                    <p className="font-medium text-secondary-900">Manage Reviews</p>
                    <p className="text-sm text-secondary-600">Moderate user reviews</p>
                  </div>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard
