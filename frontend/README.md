# Natours Frontend

A modern, responsive React frontend for the Natours tour booking platform. Built with Vite, React, Redux Toolkit, and TailwindCSS.

## 🚀 Features

- **Modern React Architecture**: Built with React 18, Vite, and modern ES6+ features
- **State Management**: Redux Toolkit with feature-based slices for scalable state management
- **Secure Authentication**: HTTP-only cookies for secure session handling
- **Responsive Design**: Mobile-first design with TailwindCSS
- **Professional UI**: Clean, modern interface with reusable components
- **Admin Panel**: Comprehensive admin dashboard for tour and user management
- **Type Safety**: PropTypes and comprehensive error handling

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Styling**: TailwindCSS
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **HTTP Client**: Fetch API with custom wrapper

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── auth/          # Authentication components
│   │   ├── layout/        # Layout components (Navbar, Footer)
│   │   └── ui/            # Base UI components (Button, Input, Card)
│   ├── pages/             # Page components
│   │   ├── admin/         # Admin panel pages
│   │   ├── auth/          # Authentication pages
│   │   └── user/          # User profile pages
│   ├── services/          # API services
│   │   └── api/           # API client and endpoints
│   ├── store/             # Redux store and slices
│   │   └── slices/        # Feature-based Redux slices
│   ├── App.jsx            # Main App component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:8000`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd natours/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   VITE_API_URL=http://localhost:8000/api/v1
   VITE_APP_NAME=Natours
   VITE_NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## 📱 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔐 Authentication

The frontend uses HTTP-only cookies for secure authentication:

- **Login**: `POST /api/v1/users/login`
- **Signup**: `POST /api/v1/users/signup`
- **Logout**: `POST /api/v1/users/logout`
- **Current User**: `GET /api/v1/users/me`

### Role-Based Access Control

- **User**: Basic tour browsing and booking
- **Guide**: Can create and manage tours
- **Lead Guide**: Can manage tours and view user data
- **Admin**: Full access to all features and admin panel

## 🎨 UI Components

### Base Components
- `Button` - Customizable button with variants and sizes
- `Input` - Form input with validation and error states
- `Card` - Container component with header, content, and footer
- `LoadingSpinner` - Loading indicator with customizable sizes

### Layout Components
- `Navbar` - Responsive navigation with user menu
- `Footer` - Site footer with links and contact info
- `ProtectedRoute` - Route protection with role-based access

## 📊 State Management

### Redux Slices

1. **Auth Slice** (`authSlice.js`)
   - User authentication state
   - Login, signup, logout actions
   - Profile management

2. **Tour Slice** (`tourSlice.js`)
   - Tour data and filtering
   - CRUD operations for tours
   - Search and pagination

3. **User Slice** (`userSlice.js`)
   - User management (admin)
   - User CRUD operations

4. **Review Slice** (`reviewSlice.js`)
   - Review data and management
   - Review CRUD operations

5. **UI Slice** (`uiSlice.js`)
   - Global UI state
   - Modals, notifications, loading states

## 🔧 API Integration

### API Client
- Custom `apiClient` with automatic cookie handling
- Error handling and response formatting
- Support for file uploads

### Endpoints
- **Tours**: `/api/v1/tours`
- **Users**: `/api/v1/users`
- **Reviews**: `/api/v1/reviews`
- **Auth**: `/api/v1/users/login`, `/api/v1/users/signup`

## 🎯 Key Features

### Public Features
- Tour browsing and search
- Tour detail pages with galleries
- User registration and login
- Responsive design for all devices

### User Features
- Profile management
- Password updates
- Tour bookings (UI ready)
- Review system

### Admin Features
- Dashboard with statistics
- Tour management (CRUD)
- User management
- Review moderation
- Monthly planning

## 🎨 Styling

### TailwindCSS Configuration
- Custom color palette with primary and secondary colors
- Responsive breakpoints
- Custom animations and transitions
- Component-based utility classes

### Design System
- Consistent spacing and typography
- Modern card-based layouts
- Professional color scheme
- Accessible contrast ratios

## 🔒 Security Features

- HTTP-only cookies for authentication
- No sensitive data in localStorage
- Protected routes with role-based access
- Input validation and sanitization
- XSS protection

## 📱 Responsive Design

- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interface
- Optimized for all screen sizes

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
Set the following environment variables for production:
- `VITE_API_URL` - Backend API URL
- `VITE_APP_NAME` - Application name
- `VITE_NODE_ENV` - Environment (production)

### Deployment Options
- **Vercel**: Connect GitHub repository for automatic deployments
- **Netlify**: Drag and drop build folder or connect repository
- **AWS S3**: Upload build folder to S3 bucket
- **Docker**: Use provided Dockerfile for containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

Built with ❤️ using React, Redux Toolkit, and TailwindCSS