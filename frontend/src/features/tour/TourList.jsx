import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTours, selectTours, selectToursLoading } from './tourSlice'
import TourCard from './TourCard'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

function TourList() {
  const dispatch = useDispatch()
  const tours = useSelector(selectTours)
  const isLoading = useSelector(selectToursLoading)

  useEffect(() => {
    dispatch(fetchTours())
  }, [dispatch])

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading tours..." />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tours.map((tour) => (
        <TourCard key={tour._id} tour={tour} />
      ))}
    </div>
  )
}

export default TourList
