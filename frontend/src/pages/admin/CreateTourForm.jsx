import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { 
  Plus, 
  X, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Star,
  Image as ImageIcon,
  FileText,
  AlertCircle
} from 'lucide-react'
import { createTour } from '../../features/tour/tourSlice'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const CreateTourForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading: loading, error } = useSelector(state => state.tours)
  
  const [startDates, setStartDates] = useState([])
  const [locations, setLocations] = useState([])
  const [images, setImages] = useState([])
  const [newStartDate, setNewStartDate] = useState('')
  const [newLocation, setNewLocation] = useState({
    coordinates: ['', ''],
    address: '',
    description: '',
    day: ''
  })
  const [newImage, setNewImage] = useState('')
  const [imageFiles, setImageFiles] = useState([])
  const [coverImageFile, setCoverImageFile] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    defaultValues: {
      name: '',
      duration: '',
      maxGroupSize: '',
      difficulty: 'easy',
      price: '',
      priceDiscount: '',
      summary: '',
      description: '',
      startLocation: {
        coordinates: ['', ''],
        address: '',
        description: ''
      },
      secretTour: false
    }
  })

  const onSubmit = async (data) => {
    try {
      // Prepare tour data
      const tourData = {
        ...data,
        duration: parseInt(data.duration),
        maxGroupSize: parseInt(data.maxGroupSize),
        price: parseFloat(data.price),
        priceDiscount: data.priceDiscount ? parseFloat(data.priceDiscount) : undefined,
        startDates: startDates.filter(date => date.trim() !== ''),
        locations: locations.filter(loc => loc.address.trim() !== ''),
        images: images.filter(img => img.trim() !== ''),
        startLocation: {
          ...data.startLocation,
          coordinates: data.startLocation.coordinates.map(coord => 
            coord ? parseFloat(coord) : undefined
          ).filter(coord => coord !== undefined)
        }
      }

      // Remove empty fields
      Object.keys(tourData).forEach(key => {
        if (tourData[key] === '' || tourData[key] === null || tourData[key] === undefined) {
          delete tourData[key]
        }
      })

      console.log('Creating tour with data:', tourData)
      await dispatch(createTour(tourData)).unwrap()
      navigate('/admin/tours')
    } catch (error) {
      console.error('Error creating tour:', error)
    }
  }

  const addStartDate = () => {
    if (newStartDate.trim()) {
      setStartDates([...startDates, newStartDate])
      setNewStartDate('')
    }
  }

  const removeStartDate = (index) => {
    setStartDates(startDates.filter((_, i) => i !== index))
  }

  const addLocation = () => {
    if (newLocation.address.trim() && newLocation.day.trim()) {
      setLocations([...locations, { ...newLocation }])
      setNewLocation({
        coordinates: ['', ''],
        address: '',
        description: '',
        day: ''
      })
    }
  }

  const removeLocation = (index) => {
    setLocations(locations.filter((_, i) => i !== index))
  }

  const addImage = () => {
    if (newImage.trim()) {
      setImages([...images, newImage])
      setNewImage('')
    }
  }

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0]
    setCoverImageFile(file)
  }

  const handleImageFilesChange = (e) => {
    const files = Array.from(e.target.files)
    setImageFiles(prev => [...prev, ...files])
  }

  const removeImageFile = (index) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Creating tour..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Tour</h1>
          <p className="text-gray-600">Fill in the details below to create a new tour</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tour Name *
                </label>
                <Input
                  {...register('name', { required: 'Tour name is required' })}
                  placeholder="e.g., The Forest Hiker, Amazing Tour of New York"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (days) *
                  </label>
                  <Input
                    type="number"
                    {...register('duration', { 
                      required: 'Duration is required',
                      min: { value: 1, message: 'Duration must be at least 1 day' }
                    })}
                    placeholder="e.g., 5"
                    className={errors.duration ? 'border-red-500' : ''}
                  />
                  {errors.duration && (
                    <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Group Size *
                  </label>
                  <Input
                    type="number"
                    {...register('maxGroupSize', { 
                      required: 'Max group size is required',
                      min: { value: 1, message: 'Group size must be at least 1' }
                    })}
                    placeholder="e.g., 25"
                    className={errors.maxGroupSize ? 'border-red-500' : ''}
                  />
                  {errors.maxGroupSize && (
                    <p className="text-red-500 text-sm mt-1">{errors.maxGroupSize.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($) *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register('price', { 
                      required: 'Price is required',
                      min: { value: 0, message: 'Price must be positive' }
                    })}
                    placeholder="e.g., 297.00"
                    className={errors.price ? 'border-red-500' : ''}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Price ($)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register('priceDiscount')}
                    placeholder="e.g., 250.00 (optional)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty *
                </label>
                <select
                  {...register('difficulty', { required: 'Difficulty is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="difficult">Difficult</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Summary *
                </label>
                <textarea
                  {...register('summary', { required: 'Summary is required' })}
                  rows={3}
                  placeholder="Brief description of the tour (2-3 sentences)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.summary && (
                  <p className="text-red-500 text-sm mt-1">{errors.summary.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  {...register('description', { required: 'Description is required' })}
                  rows={6}
                  placeholder="Detailed description of the tour, what's included, itinerary, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Start Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Tour Starting Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">📍 Starting Location:</h4>
                <p className="text-sm text-blue-800">
                  Simply enter the address where your tour starts. Coordinates are optional and can be added later if needed.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Starting Address *
                </label>
                <Input
                  {...register('startLocation.address', { 
                    required: 'Starting address is required' 
                  })}
                  placeholder="e.g., Central Park, New York, NY or Islamabad G9-1, Pakistan"
                  className={errors.startLocation?.address ? 'border-red-500' : ''}
                />
                {errors.startLocation?.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.startLocation.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude (optional)
                  </label>
                  <Input
                    type="number"
                    step="any"
                    {...register('startLocation.coordinates.0')}
                    placeholder="e.g., -74.0060 (optional)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Can be left empty if you don't know coordinates</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude (optional)
                  </label>
                  <Input
                    type="number"
                    step="any"
                    {...register('startLocation.coordinates.1')}
                    placeholder="e.g., 40.7128 (optional)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Can be left empty if you don't know coordinates</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Starting Point Description
                </label>
                <textarea
                  {...register('startLocation.description')}
                  rows={3}
                  placeholder="e.g., Meet at the main entrance near the fountain, look for the blue umbrella"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Helpful details for tourists to find the starting point</p>
              </div>
            </CardContent>
          </Card>

          {/* Start Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Tour Start Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">📅 Add tour dates:</h4>
                <p className="text-sm text-green-800">Add the dates when this tour will be available. You can add multiple dates.</p>
              </div>

              <div className="flex gap-2">
                <Input
                  type="date"
                  value={newStartDate}
                  onChange={(e) => setNewStartDate(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={addStartDate}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {startDates.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Tour Dates:</h4>
                  {startDates.map((date, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span>{new Date(date).toLocaleDateString()}</span>
                      <Button
                        type="button"
                        onClick={() => removeStartDate(index)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tour Locations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Tour Stops & Locations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">🗺️ Add tour stops:</h4>
                <p className="text-sm text-green-800">Add different locations your tour will visit (optional). Just enter the address and day number.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location Address
                  </label>
                  <Input
                    value={newLocation.address}
                    onChange={(e) => setNewLocation({
                      ...newLocation,
                      address: e.target.value
                    })}
                    placeholder="e.g., Times Square, New York, NY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tour Day
                  </label>
                  <Input
                    type="number"
                    value={newLocation.day}
                    onChange={(e) => setNewLocation({
                      ...newLocation,
                      day: e.target.value
                    })}
                    placeholder="e.g., 1 (for day 1 of tour)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What happens at this location?
                </label>
                <textarea
                  value={newLocation.description}
                  onChange={(e) => setNewLocation({
                    ...newLocation,
                    description: e.target.value
                  })}
                  rows={2}
                  placeholder="e.g., Visit the famous landmark, take photos, 30-minute break, lunch stop"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <Button
                type="button"
                onClick={addLocation}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Tour Stop
              </Button>

              {locations.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Tour Stops:</h4>
                  {locations.map((location, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium">Day {location.day}: {location.address}</p>
                          {location.description && (
                            <p className="text-sm text-gray-600 mt-1">{location.description}</p>
                          )}
                        </div>
                        <Button
                          type="button"
                          onClick={() => removeLocation(index)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ImageIcon className="h-5 w-5 mr-2" />
                Tour Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">📸 Add tour images:</h4>
                <p className="text-sm text-purple-800">Upload images from your computer or add image URLs. The first image will be used as the cover image.</p>
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {coverImageFile && (
                  <p className="text-sm text-green-600 mt-1">✓ {coverImageFile.name} selected</p>
                )}
              </div>

              {/* Additional Images Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Tour Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageFilesChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">You can select multiple images at once</p>
                
                {imageFiles.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {imageFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm">{file.name}</span>
                        <Button
                          type="button"
                          onClick={() => removeImageFile(index)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Alternative: URL Input */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-700 mb-2">Or add images by URL:</h4>
                <div className="flex gap-2">
                  <Input
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="https://example.com/tour-image.jpg"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={addImage}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {images.length > 0 && (
                  <div className="space-y-2 mt-3">
                    <h4 className="font-medium text-gray-700">Image URLs:</h4>
                    {images.map((image, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="truncate text-sm">{image}</span>
                        <Button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tour Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                Tour Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="secretTour"
                  {...register('secretTour')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="secretTour" className="ml-2 block text-sm text-gray-700">
                  Secret Tour (only visible to admin)
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              onClick={() => navigate('/admin/tours')}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Tour'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateTourForm