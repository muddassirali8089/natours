import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  Filter,
  MoreVertical
} from 'lucide-react'
import { 
  fetchTours, 
  deleteTour,
  selectTours, 
  selectToursLoading,
  selectToursError 
} from '../../features/tour/tourSlice'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

const AdminTours = () => {
  const dispatch = useDispatch()
  const tours = useSelector(selectTours)
  const isLoading = useSelector(selectToursLoading)
  const error = useSelector(selectToursError)

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [tourToDelete, setTourToDelete] = useState(null)

  useEffect(() => {
    dispatch(fetchTours())
  }, [dispatch])

  const handleDeleteTour = async (tourId) => {
    try {
      await dispatch(deleteTour(tourId)).unwrap()
      toast.success('Tour deleted successfully')
      setShowDeleteModal(false)
      setTourToDelete(null)
    } catch (error) {
      toast.error(error || 'Failed to delete tour')
    }
  }

  const filteredTours = tours.filter(tour => {
    const matchesSearch = tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.summary.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = !selectedDifficulty || tour.difficulty === selectedDifficulty
    return matchesSearch && matchesDifficulty
  })

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    difficult: 'bg-red-100 text-red-800',
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">Manage Tours</h1>
            <p className="text-secondary-600 mt-2">
              Create, edit, and manage your tour offerings
            </p>
          </div>
          <Button className="mt-4 sm:mt-0">
            <Plus className="w-4 h-4 mr-2" />
            Add New Tour
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search tours..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
              </div>
              <div className="sm:w-48">
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="input w-full"
                >
                  <option value="">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="difficult">Difficult</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tours Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading tours..." />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTours.map((tour) => (
              <Card key={tour._id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={`/img/tours/${tour.imageCover}`}
                    alt={tour.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[tour.difficulty]}`}>
                      {tour.difficulty}
                    </span>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-secondary-900 line-clamp-1">
                      {tour.name}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setTourToDelete(tour)
                          setShowDeleteModal(true)
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-secondary-600 text-sm mb-4 line-clamp-2">
                    {tour.summary}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-secondary-500 mb-4">
                    <div className="flex items-center">
                      <span>{tour.duration} days</span>
                    </div>
                    <div className="flex items-center">
                      <span>{tour.maxGroupSize} people</span>
                    </div>
                    <div className="flex items-center">
                      <span>${tour.price}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1 text-sm font-medium">{tour.ratingsAverage}</span>
                      <span className="ml-1 text-sm text-secondary-500">
                        ({tour.ratingsQuantity})
                      </span>
                    </div>
                    <div className="text-sm text-secondary-500">
                      {tour.startDates?.length || 0} dates
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredTours.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-secondary-500">No tours found matching your criteria.</p>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle className="text-red-600">Delete Tour</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-600 mb-6">
                  Are you sure you want to delete "{tourToDelete?.name}"? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDeleteModal(false)
                      setTourToDelete(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteTour(tourToDelete._id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminTours
