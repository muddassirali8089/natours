import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const TourMap = ({ tour }) => {

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
    <div className="h-96 w-full rounded-lg overflow-hidden">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={8}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Start Location Marker */}
        {tour.startLocation && tour.startLocation.coordinates && (
          <Marker
            position={[tour.startLocation.coordinates[1], tour.startLocation.coordinates[0]]}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold text-green-600">Start Location</h3>
                <p className="text-sm">{tour.startLocation.description}</p>
                <p className="text-xs text-gray-500">{tour.startLocation.address}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Tour Locations Markers */}
        {tour.locations.map((location, index) => (
          <Marker
            key={location._id || index}
            position={[location.coordinates[1], location.coordinates[0]]}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold text-blue-600">Day {location.day}</h3>
                <p className="text-sm">{location.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default TourMap
