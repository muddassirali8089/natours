import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
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
import { createTour, updateTour, fetchTour, selectCurrentTour } from '../../features/tour/tourSlice'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const CreateTourForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { tourId } = useParams()
  const { isLoading: loading, error } = useSelector(state => state.tours)
  const tour = useSelector(selectCurrentTour)
  
  // Determine if we're in edit mode
  const isEditMode = !!tourId
  
  const [startDates, setStartDates] = useState(['2024-03-15', '2024-03-22', '2024-03-29'])
  const [locations, setLocations] = useState([
    {
      address: 'Times Square, New York, NY, USA',
      day: '1',
      description: 'Visit the famous landmark, take photos, shopping'
    },
    {
      address: 'Statue of Liberty, New York, NY, USA', 
      day: '2',
      description: 'Boat tour to the island, learn about history'
    }
  ])
  const [newStartDate, setNewStartDate] = useState('')
  const [newLocation, setNewLocation] = useState({
    address: '',
    description: '',
    day: ''
  })
  const [coverImageFile, setCoverImageFile] = useState(null)
  const [imageFiles, setImageFiles] = useState([])
  const [validationErrors, setValidationErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    defaultValues: {
      name: 'Test Tour - Amazing Adventure',
      duration: '5',
      maxGroupSize: '25',
      difficulty: 'easy',
      price: '297.01',
      priceDiscount: '250.00',
      summary: 'An amazing test tour with beautiful scenery and great experiences.',
      description: 'This is a detailed description of our amazing test tour. You will visit beautiful locations, meet amazing people, and create unforgettable memories. Perfect for families and adventure seekers alike.',
      secretTour: true,
      startLocation: {
        address: 'Central Park, New York, NY, USA',
        description: 'Meet at the main entrance near the fountain'
      }
    }
  })

  // Load tour data when in edit mode
  useEffect(() => {
    if (isEditMode && tourId) {
      dispatch(fetchTour(tourId))
    }
  }, [dispatch, isEditMode, tourId])

  // Populate form when tour data is loaded (edit mode)
  useEffect(() => {
    if (isEditMode && tour) {
      console.log('🔄 EDIT MODE - Tour data loaded:')
      console.log('📋 Full tour object:', tour)
      console.log('📊 Tour details:')
      console.log('  - ID:', tour._id)
      console.log('  - Name:', tour.name)
      console.log('  - Duration:', tour.duration)
      console.log('  - Max Group Size:', tour.maxGroupSize)
      console.log('  - Difficulty:', tour.difficulty)
      console.log('  - Price:', tour.price)
      console.log('  - Price Discount:', tour.priceDiscount)
      console.log('  - Summary:', tour.summary)
      console.log('  - Description:', tour.description)
      console.log('  - Secret Tour:', tour.secretTour)
      console.log('  - Start Location:', tour.startLocation)
      console.log('  - Start Dates:', tour.startDates)
      console.log('  - Locations:', tour.locations)
      console.log('  - Image Cover:', tour.imageCover)
      console.log('  - Images:', tour.images)
      
      // Set form values
      setValue('name', tour.name || '')
      setValue('duration', tour.duration || '')
      setValue('maxGroupSize', tour.maxGroupSize || '')
      setValue('difficulty', tour.difficulty || 'easy')
      setValue('price', tour.price || '')
      setValue('priceDiscount', tour.priceDiscount || '')
      setValue('summary', tour.summary || '')
      setValue('description', tour.description || '')
      setValue('secretTour', tour.secretTour || false)
      setValue('startLocation', tour.startLocation || { address: '', description: '' })
      
      // Set arrays
      setStartDates(tour.startDates || [])
      setLocations(tour.locations || [])
    }
  }, [isEditMode, tour, setValue])

  // Validation function
  const validateForm = (data) => {
    const errors = {}
    
    console.log('🔍 VALIDATION DEBUG:')
    console.log('  - Form data:', data)
    console.log('  - Start dates state:', startDates)
    console.log('  - Locations state:', locations)
    console.log('  - Start location from form:', data.startLocation)
    console.log('  - Start location from watch:', watch('startLocation.address'))
    
    // Basic field validation
    if (!data.name || data.name.trim().length < 3) {
      errors.name = 'Tour name must be at least 3 characters long'
    }
    
    if (!data.duration || isNaN(data.duration) || data.duration < 1) {
      errors.duration = 'Duration must be a positive number'
    }
    
    if (!data.maxGroupSize || isNaN(data.maxGroupSize) || data.maxGroupSize < 1) {
      errors.maxGroupSize = 'Max group size must be a positive number'
    }
    
    if (!data.price || isNaN(data.price) || data.price < 0) {
      errors.price = 'Price must be a valid positive number'
    }
    
    if (data.priceDiscount && (isNaN(data.priceDiscount) || data.priceDiscount < 0)) {
      errors.priceDiscount = 'Price discount must be a valid positive number'
    }
    
    if (data.priceDiscount && parseFloat(data.priceDiscount) >= parseFloat(data.price)) {
      errors.priceDiscount = 'Price discount must be less than the original price'
    }
    
    if (!data.summary || data.summary.trim().length < 10) {
      errors.summary = 'Summary must be at least 10 characters long'
    }
    
    // Description is optional - no validation needed
    
    if (!data.difficulty || !['easy', 'medium', 'difficult'].includes(data.difficulty)) {
      errors.difficulty = 'Please select a valid difficulty level'
    }
    
    // Start location validation - check both form data and watch value
    const startLocationAddress = data.startLocation?.address || watch('startLocation.address')
    if (!startLocationAddress || startLocationAddress.trim().length < 1) {
      errors.startLocation = 'Start location address is required'
    }
    
    // Start dates validation - check both state and form data
    const currentStartDates = startDates && startDates.length > 0 ? startDates : []
    if (currentStartDates.length === 0) {
      errors.startDates = 'At least one start date is required'
    } else {
      for (let i = 0; i < currentStartDates.length; i++) {
        const date = new Date(currentStartDates[i])
        if (isNaN(date.getTime())) {
          errors.startDates = `Invalid date format for start date ${i + 1}`
          break
        }
        // Allow past dates since tours repeat every year
      }
    }
    
    // Locations validation - check both state and form data
    const currentLocations = locations && locations.length > 0 ? locations : []
    if (currentLocations.length === 0) {
      errors.locations = 'At least one location is required'
    } else {
      for (let i = 0; i < currentLocations.length; i++) {
        const location = currentLocations[i]
        if (!location.address || location.address.trim().length < 1) {
          errors.locations = `Location ${i + 1} address is required`
          break
        }
        if (!location.day || isNaN(location.day) || location.day < 1) {
          errors.locations = `Location ${i + 1} day must be a positive number`
          break
        }
        if (location.day > data.duration) {
          errors.locations = `Location ${i + 1} day cannot be greater than tour duration`
          break
        }
      }
    }
    
    // Image validation - only require new image if not in edit mode or no existing image
    if (!isEditMode && !coverImageFile) {
      errors.coverImage = 'Cover image is required'
    } else if (coverImageFile) {
      // Check file size (5MB limit)
      if (coverImageFile.size > 5 * 1024 * 1024) {
        errors.coverImage = 'Cover image must be less than 5MB'
      }
      // Check file type
      if (!coverImageFile.type.startsWith('image/')) {
        errors.coverImage = 'Cover image must be a valid image file'
      }
    }
    
    // Additional images validation
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i]
      if (file.size > 5 * 1024 * 1024) {
        errors.additionalImages = `Additional image ${i + 1} must be less than 5MB`
        break
      }
      if (!file.type.startsWith('image/')) {
        errors.additionalImages = `Additional image ${i + 1} must be a valid image file`
        break
      }
    }
    
    return errors
  }


  const onSubmit = async (data) => {
    try {
      // Clear previous validation errors
      setValidationErrors({})
      setIsSubmitting(true)

      // Check authentication first
      const token = localStorage.getItem('token')
      if (!token) {
        setValidationErrors({ auth: 'You are not logged in! Please log in first.' })
        setTimeout(() => navigate('/login'), 2000)
        return
      }

      // Check if token is valid JWT format
      const tokenParts = token.split('.')
      if (tokenParts.length !== 3) {
        setValidationErrors({ auth: 'Invalid token format! Please log in again.' })
        localStorage.removeItem('token')
        setTimeout(() => navigate('/login'), 2000)
        return
      }
      
      // Check token expiration
      try {
        const payload = JSON.parse(atob(tokenParts[1]))
        const now = Math.floor(Date.now() / 1000)
        if (payload.exp && payload.exp < now) {
          setValidationErrors({ auth: 'Token has expired! Please log in again.' })
          localStorage.removeItem('token')
          setTimeout(() => navigate('/login'), 2000)
          return
        }
      } catch (error) {
        setValidationErrors({ auth: 'Invalid token! Please log in again.' })
        localStorage.removeItem('token')
        setTimeout(() => navigate('/login'), 2000)
        return
      }

      // Validate form data
      const formErrors = validateForm(data)
      if (Object.keys(formErrors).length > 0) {
        setValidationErrors(formErrors)
        setIsSubmitting(false)
        return
      }

      // Create FormData for file uploads
      const formData = new FormData()
      
      // Add basic tour data
      formData.append('name', data.name)
      formData.append('duration', data.duration)
      formData.append('maxGroupSize', data.maxGroupSize)
      formData.append('difficulty', data.difficulty)
      formData.append('price', data.price)
      if (data.priceDiscount && data.priceDiscount > 0) {
        formData.append('priceDiscount', data.priceDiscount)
      }
      formData.append('summary', data.summary)
      formData.append('description', data.description)
      formData.append('secretTour', data.secretTour)
      
      // Add start location
      formData.append('startLocation[address]', data.startLocation.address)
      if (data.startLocation.description) {
        formData.append('startLocation[description]', data.startLocation.description)
      }
      
      // Add start dates
      startDates.forEach((date, index) => {
        formData.append(`startDates[${index}]`, date)
      })
      
      // Add locations
      locations.forEach((location, index) => {
        formData.append(`locations[${index}][address]`, location.address)
        formData.append(`locations[${index}][day]`, location.day)
        if (location.description) {
          formData.append(`locations[${index}][description]`, location.description)
        }
      })
      
      // Add cover image
      if (coverImageFile) {
        formData.append('coverImage', coverImageFile)
        console.log('📸 Cover image added:', coverImageFile.name)
      }
      
      // Add additional images
      imageFiles.forEach((file, index) => {
        formData.append('images', file)
        console.log('📸 Additional image added:', file.name)
      })

      console.log('🚀 Creating tour with FormData...')
      console.log('📅 Start dates:', startDates)
      console.log('📍 Locations:', locations)
      console.log('🖼️ Cover image:', coverImageFile?.name || 'None')
      console.log('🖼️ Additional images:', imageFiles.length)
      
      // Debug FormData contents
      console.log('📋 FormData contents:')
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value)
      }

      // Client-side validation before sending
      const price = parseFloat(data.price)
      const priceDiscount = parseFloat(data.priceDiscount)
      
      if (data.priceDiscount && priceDiscount >= price) {
        setValidationErrors({ 
          priceDiscount: `Discount price (${priceDiscount}) must be less than regular price (${price})` 
        })
        return
      }
      
      if (data.name && data.name.length < 10) {
        setValidationErrors({ 
          name: `Tour name must be at least 10 characters long (current: ${data.name.length})` 
        })
        return
      }

      // Dispatch create or update action
      if (isEditMode) {
        console.log('🔄 EDIT MODE - Data being sent:')
        console.log('📋 Form Data:', data)
        console.log('🆔 Tour ID:', tourId)
        console.log('💰 Price validation check:')
        console.log('  - New price:', data.price)
        console.log('  - New priceDiscount:', data.priceDiscount)
        console.log('  - Is priceDiscount < price?', parseFloat(data.priceDiscount) < parseFloat(data.price))
        console.log('📊 FormData contents:')
        for (let [key, value] of formData.entries()) {
          console.log(`  ${key}:`, value)
        }
        
        await dispatch(updateTour({ tourId, tourData: formData })).unwrap()
        setValidationErrors({ success: 'Tour updated successfully! Redirecting...' })
      } else {
        await dispatch(createTour(formData)).unwrap()
        setValidationErrors({ success: 'Tour created successfully! Redirecting...' })
      }
      
      // Success - show success message and redirect
      setTimeout(() => {
        navigate('/admin/tours')
      }, 2000)
      
    } catch (error) {
      console.error('❌ Error creating tour:', error)
      
      // Handle different types of errors
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        setValidationErrors({ auth: 'Authentication failed. Please log in again.' })
        localStorage.removeItem('token')
        setTimeout(() => navigate('/login'), 2000)
      } else if (error.message?.includes('403') || error.message?.includes('Forbidden')) {
        setValidationErrors({ auth: 'You do not have permission to create tours.' })
      } else if (error.message?.includes('validation')) {
        setValidationErrors({ general: 'Please check your form data and try again.' })
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        setValidationErrors({ general: 'Network error. Please check your connection and try again.' })
      } else {
        setValidationErrors({ general: `Error creating tour: ${error.message || 'Unknown error'}` })
      }
    } finally {
      setIsSubmitting(false)
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
        address: '',
        description: '',
        day: ''
      })
    }
  }

  const removeLocation = (index) => {
    setLocations(locations.filter((_, i) => i !== index))
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditMode ? 'Edit Tour' : 'Create New Tour'}
          </h1>
          <p className="text-gray-600">
            {isEditMode ? 'Update the tour details below' : 'Fill in the details below to create a new tour'}
          </p>
          
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">🧪 Testing Made Easy:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Form is pre-filled</strong> with test data - just click "Create Tour"</li>
              <li>• <strong>"Test Auth"</strong> button checks if your token is valid</li>
              <li>• <strong>"Refresh Token"</strong> button refreshes your authentication</li>
              <li>• <strong>"Test (No Images)"</strong> button creates a tour without images</li>
              <li>• <strong>"Clear Form"</strong> button resets everything</li>
              <li>• <strong>Make sure you're logged in</strong> as an admin user</li>
            </ul>
          </div>
        </div>

        {/* Success Message */}
        {validationErrors.success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <span className="text-green-700 font-medium">✅ {validationErrors.success}</span>
          </div>
        )}

        {/* Authentication Errors */}
        {validationErrors.auth && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700 font-medium">🔐 {validationErrors.auth}</span>
          </div>
        )}

        {/* General Errors */}
        {validationErrors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">{validationErrors.general}</span>
          </div>
        )}

        {/* Redux Error (fallback) */}
        {error && !validationErrors.general && !validationErrors.auth && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Validation Errors Summary */}
        {Object.keys(validationErrors).length > 0 && !validationErrors.success && !validationErrors.auth && !validationErrors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="text-red-800 font-medium mb-2">Please fix the following errors:</h4>
            <ul className="text-red-700 text-sm space-y-1">
              {Object.entries(validationErrors)
                .filter(([key]) => !['success', 'auth', 'general'].includes(key))
                .map(([key, message]) => (
                  <li key={key}>• {message}</li>
                ))}
            </ul>
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
                  className={errors.name || validationErrors.name ? 'border-red-500' : ''}
                />
                {(errors.name || validationErrors.name) && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name?.message || validationErrors.name}
                  </p>
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
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={6}
                  placeholder="Detailed description of the tour, what's included, itinerary, etc. (optional)"
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
                {validationErrors.coverImage && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.coverImage}</p>
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

          {/* Submit Buttons */}
          <div className="flex justify-between">
            <div className="flex space-x-2">
              <Button
                type="button"
                onClick={() => {
                  if (confirm('Clear all form data?')) {
                    window.location.reload()
                  }
                }}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                Clear Form
              </Button>
              <Button
                type="button"
                onClick={async () => {
                  try {
                    const token = localStorage.getItem('token')
                    if (!token) {
                      alert('❌ You are not logged in! Please log in first.')
                      navigate('/login')
                      return
                    }

                    // Test with minimal data (no images)
                    const testData = {
                      name: 'Test Tour - No Images',
                      duration: 3,
                      maxGroupSize: 15,
                      difficulty: 'easy',
                      price: 199.00,
                      summary: 'A simple test tour without images',
                      description: 'This is a test tour to verify the API works without image uploads.',
                      startLocation: {
                        address: 'Test Location, Test City',
                        description: 'Test meeting point'
                      },
                      startDates: ['2024-04-01'],
                      locations: [{
                        address: 'Test Stop 1',
                        day: 1,
                        description: 'Test stop description'
                      }]
                    }

                    console.log('🧪 Testing with minimal data:', testData)
                    await dispatch(createTour(testData)).unwrap()
                    alert('✅ Test tour created successfully!')
                  } catch (error) {
                    console.error('❌ Test failed:', error)
                    alert(`❌ Test failed: ${error.message}`)
                  }
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                Test (No Images)
              </Button>
              <Button
                type="button"
                onClick={async () => {
                  try {
                    // Try to get current user to refresh token
                    const { getCurrentUser } = await import('../../features/auth/authSlice')
                    await dispatch(getCurrentUser()).unwrap()
                    alert('✅ Token refreshed! Try creating a tour now.')
                  } catch (error) {
                    console.error('❌ Token refresh failed:', error)
                    alert('❌ Token refresh failed. Please log in again.')
                    localStorage.removeItem('token')
                    navigate('/login')
                  }
                }}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Refresh Token
              </Button>
              <Button
                type="button"
                onClick={async () => {
                  try {
                    // Test authentication by calling a simple protected endpoint
                    const response = await fetch('http://localhost:8000/api/v1/users/me', {
                      method: 'GET',
                      headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                      }
                    })
                    
                    if (response.ok) {
                      const data = await response.json()
                      alert(`✅ Auth test passed! User: ${data.data.user.name} (${data.data.user.roles.join(', ')})`)
                    } else {
                      const error = await response.json()
                      alert(`❌ Auth test failed: ${error.message}`)
                    }
                  } catch (error) {
                    console.error('❌ Auth test error:', error)
                    alert(`❌ Auth test error: ${error.message}`)
                  }
                }}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Test Auth
              </Button>
            </div>
            
            <div className="flex space-x-4">
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
                disabled={loading || isSubmitting}
              >
                {(loading || isSubmitting) ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    {isEditMode ? 'Updating Tour...' : 'Creating Tour...'}
                  </>
                ) : (
                  isEditMode ? 'Update Tour' : 'Create Tour'
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateTourForm