// 🌍 GEOSPATIAL QUERIES EXAMPLES AND TESTING

// Sample tour data with geospatial coordinates
export const sampleGeospatialData = {
  // Popular cities coordinates for testing
  cities: {
    losAngeles: { lat: 34.0522, lng: -118.2437, name: "Los Angeles, CA" },
    newYork: { lat: 40.7128, lng: -74.0060, name: "New York, NY" },
    london: { lat: 51.5074, lng: -0.1278, name: "London, UK" },
    paris: { lat: 48.8566, lng: 2.3522, name: "Paris, France" },
    tokyo: { lat: 35.6762, lng: 139.6503, name: "Tokyo, Japan" },
    sydney: { lat: -33.8688, lng: 151.2093, name: "Sydney, Australia" }
  },

  // Sample tour locations
  sampleTours: [
    {
      name: "The Forest Hiker",
      startLocation: {
        type: "Point",
        coordinates: [-118.113491, 34.111745], // [lng, lat] - Near Los Angeles
        address: "California, USA",
        description: "Beautiful forest trails in California"
      }
    },
    {
      name: "The Sea Explorer", 
      startLocation: {
        type: "Point",
        coordinates: [-74.005941, 40.712784], // [lng, lat] - Near New York
        address: "New York, USA", 
        description: "Coastal exploration in New York"
      }
    },
    {
      name: "The Snow Adventurer",
      startLocation: {
        type: "Point",
        coordinates: [-0.127758, 51.507351], // [lng, lat] - Near London
        address: "London, UK",
        description: "Urban adventure in London"
      }
    }
  ]
};

// 🧪 Test cases for geospatial queries
export const geospatialTestCases = [
  {
    name: "Find tours within 100 miles of Los Angeles",
    url: "/api/v1/tours/tours-within/100/center/34.0522,-118.2437/unit/mi",
    description: "Should find tours near Los Angeles area",
    expectedResults: "Tours within 100 miles radius"
  },
  {
    name: "Find tours within 50 kilometers of London",
    url: "/api/v1/tours/tours-within/50/center/51.5074,-0.1278/unit/km", 
    description: "Should find tours near London area",
    expectedResults: "Tours within 50 km radius"
  },
  {
    name: "Calculate distances from New York", 
    url: "/api/v1/tours/tours-distances/40.7128,-74.0060/unit/mi",
    description: "Should calculate distances from NYC to all tours",
    expectedResults: "All tours with distances in miles, sorted by distance"
  },
  {
    name: "Calculate distances from Paris",
    url: "/api/v1/tours/tours-distances/48.8566,2.3522/unit/km",
    description: "Should calculate distances from Paris to all tours", 
    expectedResults: "All tours with distances in kilometers, sorted by distance"
  }
];

// 📚 Usage examples and documentation
export const geospatialDocumentation = {
  overview: `
🌍 GEOSPATIAL QUERIES DOCUMENTATION

This implementation provides two main geospatial functionalities:
1. Finding tours within a specified radius from a point
2. Calculating distances from a point to all tours
`,

  requirements: `
📋 REQUIREMENTS:
- Tours must have startLocation with GeoJSON Point format
- MongoDB 2dsphere index on startLocation field (already implemented)
- Valid latitude/longitude coordinates
`,

  endpoints: [
    {
      name: "Find Tours Within Radius",
      method: "GET",
      url: "/api/v1/tours/tours-within/:distance/center/:latlng/unit/:unit",
      parameters: {
        distance: "Number - radius distance",
        latlng: "String - 'latitude,longitude' format",
        unit: "String - 'mi' for miles or 'km' for kilometers"
      },
      example: "/api/v1/tours/tours-within/100/center/34.0522,-118.2437/unit/mi",
      response: `{
  "status": "success",
  "results": 2,
  "data": {
    "data": [
      {
        "_id": "tour_id",
        "name": "Tour Name",
        "startLocation": {
          "type": "Point", 
          "coordinates": [-118.113491, 34.111745],
          "address": "California, USA"
        }
      }
    ]
  }
}`
    },
    {
      name: "Calculate Distances",
      method: "GET", 
      url: "/api/v1/tours/tours-distances/:latlng/unit/:unit",
      parameters: {
        latlng: "String - 'latitude,longitude' format",
        unit: "String - 'mi' for miles or 'km' for kilometers"
      },
      example: "/api/v1/tours/tours-distances/40.7128,-74.0060/unit/mi",
      response: `{
  "status": "success",
  "results": 3,
  "data": {
    "data": [
      {
        "_id": "tour_id",
        "name": "Tour Name",
        "distance": 245.67,
        "startLocation": {...},
        "ratingsAverage": 4.5,
        "price": 1200
      }
    ]
  }
}`
    }
  ],

  technicalDetails: `
🔧 TECHNICAL IMPLEMENTATION:

1. RADIUS SEARCH ($geoWithin + $centerSphere):
   - Uses spherical geometry for accurate Earth calculations
   - Converts distance to radians (distance / Earth radius)
   - Earth radius: 3963.2 miles, 6378.1 kilometers

2. DISTANCE CALCULATION ($geoNear aggregation):
   - Uses aggregation pipeline for efficient processing
   - Calculates actual distances in specified units
   - Sorts results by distance (closest first)
   - Includes additional tour information

3. COORDINATE FORMAT:
   - Input: latitude,longitude (lat,lng)
   - MongoDB: [longitude, latitude] (lng,lat)
   - GeoJSON: { type: "Point", coordinates: [lng, lat] }
`,

  examples: `
🧪 TESTING EXAMPLES:

// Find tours within 100 miles of Los Angeles
GET /api/v1/tours/tours-within/100/center/34.0522,-118.2437/unit/mi

// Find tours within 50 km of London  
GET /api/v1/tours/tours-within/50/center/51.5074,-0.1278/unit/km

// Get distances from New York to all tours
GET /api/v1/tours/tours-distances/40.7128,-74.0060/unit/mi

// Get distances from Paris to all tours  
GET /api/v1/tours/tours-distances/48.8566,2.3522/unit/km
`
};

// 🎯 Performance optimization tips
export const geospatialOptimizationTips = [
  "✅ 2dsphere index is already implemented for optimal performance",
  "✅ Use $geoWithin for radius searches (implemented)",
  "✅ Use $geoNear aggregation for distance calculations (implemented)", 
  "✅ Limit results with pagination for large datasets",
  "✅ Consider caching frequently requested locations",
  "✅ Validate coordinates before processing (implemented)",
  "✅ Use appropriate distance units for your use case"
];

export default {
  sampleGeospatialData,
  geospatialTestCases,
  geospatialDocumentation,
  geospatialOptimizationTips
}; 