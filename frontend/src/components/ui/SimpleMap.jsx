const SimpleMap = ({ tour }) => {
  if (!tour || !tour.locations || tour.locations.length === 0) {
    return (
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No location data available</p>
      </div>
    )
  }

  // Get all coordinates for the map bounds
  const coordinates = tour.locations.map(location => [location.coordinates[1], location.coordinates[0]])
  
  // Add start location if available
  if (tour.startLocation && tour.startLocation.coordinates) {
    coordinates.unshift([tour.startLocation.coordinates[1], tour.startLocation.coordinates[0]])
  }

  // Calculate center point
  const centerLat = coordinates.reduce((sum, coord) => sum + coord[0], 0) / coordinates.length
  const centerLng = coordinates.reduce((sum, coord) => sum + coord[1], 0) / coordinates.length

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden bg-gray-100 relative">
      {/* Simple map placeholder with OpenStreetMap */}
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Tour Route Map</h3>
          <p className="text-sm text-gray-500 mb-4">
            Interactive map temporarily unavailable
          </p>
          
          {/* Show locations as a list */}
          <div className="space-y-2 text-left">
            {tour.startLocation && tour.startLocation.coordinates && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  <strong>Start:</strong> {tour.startLocation.description}
                </span>
              </div>
            )}
            
            {tour.locations
              .sort((a, b) => a.day - b.day)
              .map((location, index) => (
                <div key={location._id || index} className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    <strong>Day {location.day}:</strong> {location.description}
                  </span>
                </div>
              ))}
          </div>
          
          <div className="mt-4 text-xs text-gray-400">
            Coordinates: {centerLat.toFixed(4)}, {centerLng.toFixed(4)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimpleMap
