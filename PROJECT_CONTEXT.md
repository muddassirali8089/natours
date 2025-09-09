# Natours Project - Complete Codebase Context

## Project Overview
**Natours** is a full-stack tour booking application with:
- **Backend**: Node.js/Express.js API with MongoDB/Mongoose
- **Frontend**: React.js with Redux Toolkit, Tailwind CSS
- **Features**: User authentication, tour management, reviews, admin dashboard, image uploads (Cloudinary)

## Backend Architecture

### Core Technologies
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Image Storage**: Cloudinary
- **File Upload**: Multer + Streamifier
- **Security**: bcryptjs, rate limiting, CORS
- **Email**: Nodemailer for verification emails

### Project Structure
```
backend/
├── controllers/          # Business logic
├── models/              # Mongoose schemas
├── routes/              # API endpoints
├── utils/               # Utility functions
├── connection/          # Database connection
├── dev-data/           # Sample data and templates
├── public/             # Static files
└── views/              # Pug templates (legacy)
```

### Key Backend Files

#### Models
- **`models/user.model.js`**: User schema with authentication, roles, photo field
- **`models/tour.model.js`**: Tour schema with geospatial data, pricing, guides
- **`models/review.model.js`**: Review schema with ratings and tour/user references

#### Controllers
- **`controllers/user.controller.js`**: User CRUD, profile updates, photo uploads
- **`controllers/authController.js`**: Authentication, password reset, email verification
- **`controllers/tour.controller.js`**: Tour CRUD, statistics, geospatial queries
- **`controllers/review.controller.js`**: Review CRUD operations

#### Routes
- **`routes/user.routes.js`**: User endpoints with Multer for file uploads
- **`routes/tour.routes.js`**: Tour endpoints with geospatial features
- **`routes/review.routes.js`**: Review endpoints

#### Utils
- **`utils/cloudinary.js`**: Cloudinary configuration for image storage
- **`utils/jwt.js`**: JWT token generation and verification
- **`utils/AppError.js`**: Custom error handling
- **`utils/email.js`**: Email service configuration

### API Endpoints Structure
```
/api/v1/
├── users/
│   ├── GET /me                    # Get current user profile
│   ├── PATCH /updateMe           # Update profile (name, photo)
│   ├── PATCH /updateMyPassword   # Update password
│   └── GET /                     # Get all users (admin)
├── tours/
│   ├── GET /                     # Get all tours (with filtering)
│   ├── GET /:id                  # Get single tour
│   ├── POST /                    # Create tour (admin)
│   ├── PATCH /:id                # Update tour (admin)
│   ├── DELETE /:id               # Delete tour (admin)
│   ├── GET /tour-stats           # Get tour statistics
│   └── GET /monthly-plan/:year   # Get monthly plan
└── reviews/
    ├── GET /                     # Get all reviews
    ├── POST /                    # Create review
    ├── PATCH /:id                # Update review
    └── DELETE /:id               # Delete review
```

### Authentication & Authorization
- **JWT Strategy**: Token-based authentication
- **Roles**: `user`, `admin`, `guide`
- **Protected Routes**: Middleware protection for sensitive endpoints
- **Password Security**: bcryptjs hashing with salt rounds
- **Email Verification**: Token-based email verification system

### Image Upload System
- **Cloudinary Integration**: Direct upload to Cloudinary
- **Multer Configuration**: Memory storage, 5MB limit, image type validation
- **Streamifier**: Converts buffers to streams for Cloudinary upload
- **Default Images**: Fallback to default avatar for users
- **Image Transformations**: Automatic resizing and face detection

## Frontend Architecture

### Core Technologies
- **Framework**: React.js 18
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **HTTP Client**: Custom API client with interceptors

### Project Structure
```
frontend/src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components (Navbar, Footer)
│   └── ui/             # Generic UI components
├── features/           # Feature-based Redux slices
│   ├── auth/           # Authentication state
│   ├── tour/           # Tour management
│   ├── review/         # Review management
│   ├── user/           # User management
│   └── ui/             # UI state
├── pages/              # Page components
│   ├── auth/           # Login, Signup pages
│   ├── admin/          # Admin dashboard and management
│   └── user/           # User profile pages
├── services/           # API services
│   └── api/            # API client and endpoints
├── store/              # Redux store configuration
└── utils/              # Utility functions
```

### Key Frontend Files

#### Redux Slices
- **`features/auth/authSlice.js`**: Authentication state, login/logout, profile updates
- **`features/tour/tourSlice.js`**: Tour state, CRUD operations, statistics
- **`features/review/reviewSlice.js`**: Review state and operations
- **`features/user/userSlice.js`**: User management state
- **`features/ui/uiSlice.js`**: UI state (loading, modals, etc.)

#### API Services
- **`services/api/apiClient.js`**: Centralized HTTP client with token management
- **`services/api/authAPI.js`**: Authentication API calls
- **`services/api/tourAPI.js`**: Tour-related API calls
- **`services/api/reviewAPI.js`**: Review API calls
- **`services/api/userAPI.js`**: User management API calls

#### Components
- **`components/layout/Navbar.jsx`**: Navigation with user info and photo
- **`components/layout/Footer.jsx`**: Footer component
- **`components/auth/ProtectedRoute.jsx`**: Route protection wrapper
- **`components/ui/`**: Reusable UI components (Button, Card, Input, etc.)

#### Pages
- **`pages/HomePage.jsx`**: Landing page with tour listings
- **`pages/ToursPage.jsx`**: Tour listing and filtering
- **`pages/TourDetailPage.jsx`**: Individual tour details
- **`pages/user/ProfilePage.jsx`**: User profile with photo upload
- **`pages/admin/AdminDashboard.jsx`**: Admin statistics dashboard
- **`pages/admin/AdminTours.jsx`**: Tour management
- **`pages/admin/AdminUsers.jsx`**: User management
- **`pages/admin/AdminReviews.jsx`**: Review management

### State Management Patterns
- **Redux Toolkit**: Modern Redux with createSlice and createAsyncThunk
- **Async Thunks**: API calls with loading, success, error states
- **Selectors**: Computed state selectors for components
- **Normalized State**: Structured state for tours, users, reviews

### UI/UX Patterns
- **Responsive Design**: Mobile-first with Tailwind CSS
- **Loading States**: Spinners and skeleton loaders
- **Error Handling**: User-friendly error messages
- **Form Validation**: Client-side validation with React Hook Form
- **Image Handling**: Photo uploads with preview and validation

## Key Features Implementation

### User Authentication
- **Login/Signup**: Email and password authentication
- **JWT Tokens**: Stored in localStorage with automatic refresh
- **Protected Routes**: Route-level authentication checks
- **Password Reset**: Email-based password reset flow
- **Email Verification**: Token-based email verification

### Tour Management
- **CRUD Operations**: Full tour lifecycle management
- **Geospatial Features**: Location-based tour queries
- **Image Galleries**: Multiple images per tour
- **Pricing**: Dynamic pricing with currency formatting
- **Statistics**: Tour performance metrics

### Review System
- **Rating System**: 1-5 star ratings
- **Review Text**: User-written reviews
- **Tour Association**: Reviews linked to specific tours
- **User Association**: Reviews linked to users
- **Aggregation**: Average ratings and review counts

### Admin Dashboard
- **Statistics**: Real-time data from all APIs
- **User Management**: User roles, verification status
- **Tour Management**: Tour CRUD with statistics
- **Review Management**: Review moderation
- **Photo Management**: User photo display and management

### Image Upload System
- **Cloudinary Integration**: Direct upload to cloud storage
- **File Validation**: Type and size validation
- **Preview System**: Image preview before upload
- **Error Handling**: Upload error management
- **Default Images**: Fallback for missing photos

## Development Patterns

### Backend Patterns
- **MVC Architecture**: Clear separation of concerns
- **Middleware Pattern**: Reusable middleware functions
- **Error Handling**: Centralized error handling with AppError
- **Async/Await**: Modern async patterns throughout
- **Validation**: Mongoose schema validation
- **Security**: Input sanitization and validation

### Frontend Patterns
- **Component Composition**: Reusable component architecture
- **Custom Hooks**: Reusable logic extraction
- **Error Boundaries**: Error handling at component level
- **Lazy Loading**: Code splitting for performance
- **Memoization**: Performance optimization with React.memo

### API Patterns
- **RESTful Design**: Standard HTTP methods and status codes
- **Consistent Responses**: Standardized API response format
- **Error Handling**: Structured error responses
- **Pagination**: Efficient data loading
- **Filtering**: Advanced query capabilities

## Environment Configuration
- **Environment Variables**: Secure configuration management
- **Database URLs**: MongoDB connection strings
- **API Keys**: Cloudinary, JWT secrets
- **Email Configuration**: SMTP settings for notifications

## Security Considerations
- **Password Hashing**: bcryptjs with salt rounds
- **JWT Security**: Secure token generation and validation
- **Input Validation**: Server-side validation for all inputs
- **Rate Limiting**: API rate limiting for security
- **CORS Configuration**: Cross-origin request handling
- **File Upload Security**: Type and size validation

## Performance Optimizations
- **Database Indexing**: Optimized queries with proper indexes
- **Image Optimization**: Cloudinary transformations
- **Code Splitting**: Frontend bundle optimization
- **Caching**: Strategic caching for frequently accessed data
- **Lazy Loading**: On-demand component loading

## Testing Strategy
- **API Testing**: Postman collection for endpoint testing
- **Error Scenarios**: Comprehensive error handling testing
- **User Flows**: End-to-end user journey testing
- **Data Validation**: Input validation testing

This context provides a comprehensive overview of the entire Natours project, covering both backend and frontend architecture, key features, development patterns, and implementation details. Use this as a reference for understanding the codebase structure and making informed decisions about the project.
