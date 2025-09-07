# 🚀 API Testing Endpoints - Natours Backend

## 📋 **Authentication Required**
Most endpoints require authentication. Use the login endpoint first to get a JWT token, then include it in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 **Authentication Endpoints**

### **1. User Registration**
```http
POST /api/v1/users/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

### **2. User Login**
```http
POST /api/v1/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### **3. Admin Login (for testing admin routes)**
```http
POST /api/v1/users/login
Content-Type: application/json

{
  "email": "admin@natours.io",
  "password": "test1234"
}
```

---

## 🏔️ **Tour Endpoints (Factory Functions)**

### **1. Create Tour** ✅ *Using createOne Factory*
```http
POST /api/v1/tours
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "The Forest Hiker",
  "duration": 5,
  "maxGroupSize": 25,
  "difficulty": "easy",
  "ratingsAverage": 4.7,
  "ratingsQuantity": 37,
  "price": 397,
  "summary": "Breathtaking hike through the Canadian Banff National Park",
  "description": "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\n\nExcepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum!",
  "imageCover": "tour-1-cover.jpg",
  "images": ["tour-1-1.jpg", "tour-1-2.jpg", "tour-1-3.jpg"],
  "startDates": ["2024-04-01T10:00:00.000Z", "2024-07-01T10:00:00.000Z", "2024-10-01T10:00:00.000Z"]
}
```

### **2. Update Tour** ✅ *Using updateOne Factory*
```http
PATCH /api/v1/tours/5c88fa8cf4afda39709c2955
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "The Forest Hiker - Updated",
  "price": 450,
  "difficulty": "medium"
}
```

### **3. Delete Tour** ✅ *Using deleteOne Factory*
```http
DELETE /api/v1/tours/5c88fa8cf4afda39709c2955
Authorization: Bearer <token>
```

### **4. Get All Tours**
```http
GET /api/v1/tours
Authorization: Bearer <token>
```

### **5. Get Single Tour**
```http
GET /api/v1/tours/5c88fa8cf4afda39709c2955
```

---

## 👥 **User Endpoints (Factory Functions)**

### **1. Update User (Admin Only)** ✅ *Using updateOne Factory*
```http
PATCH /api/v1/users/5c8a1dfa2f8fb814b56fa181
Content-Type: application/json
Authorization: Bearer <admin-token>

{
  "name": "Updated User Name",
  "email": "updated@example.com",
  "role": "guide"
}
```

### **2. Delete User (Admin Only)** ✅ *Using deleteOne Factory*
```http
DELETE /api/v1/users/5c8a1dfa2f8fb814b56fa181
Authorization: Bearer <admin-token>
```

### **3. Update My Profile (Current User)**
```http
PATCH /api/v1/users/updateMe
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "My New Name",
  "email": "mynewemail@example.com"
}
```

### **4. Delete My Account**
```http
DELETE /api/v1/users/deleteMe
Authorization: Bearer <token>
```

### **5. Get All Users (Admin)**
```http
GET /api/v1/users
Authorization: Bearer <admin-token>
```

### **6. Get Single User**
```http
GET /api/v1/users/5c8a1dfa2f8fb814b56fa181
Authorization: Bearer <token>
```

---

## ⭐ **Review Endpoints (Factory Functions)**

### **1. Create Review** ✅ *Using createOne Factory*
```http
POST /api/v1/tours/5c88fa8cf4afda39709c2955/reviews
Content-Type: application/json
Authorization: Bearer <token>

{
  "review": "This tour was absolutely amazing! The guide was knowledgeable and the views were breathtaking.",
  "rating": 5
}
```

### **2. Update Review** ✅ *Using updateOne Factory*
```http
PATCH /api/v1/tours/5c88fa8cf4afda39709c2955/reviews/5c88fa8cf4afda39709c2956
Content-Type: application/json
Authorization: Bearer <token>

{
  "review": "Updated review: Even better than I initially thought!",
  "rating": 5
}
```

### **3. Delete Review** ✅ *Using deleteOne Factory*
```http
DELETE /api/v1/tours/5c88fa8cf4afda39709c2955/reviews/5c88fa8cf4afda39709c2956
Authorization: Bearer <token>
```

### **4. Get All Reviews for a Tour**
```http
GET /api/v1/tours/5c88fa8cf4afda39709c2955/reviews
```

### **5. Get All Reviews (General)**
```http
GET /api/v1/reviews
```

---

## 🧪 **Testing Scenarios**

### **Scenario 1: Complete CRUD Flow for Tours**
1. **Create** a new tour using `POST /api/v1/tours`
2. **Read** the tour using `GET /api/v1/tours/{id}`
3. **Update** the tour using `PATCH /api/v1/tours/{id}`
4. **Delete** the tour using `DELETE /api/v1/tours/{id}`

### **Scenario 2: Review Management**
1. **Create** a review for a tour using `POST /api/v1/tours/{tourId}/reviews`
2. **Update** the review using `PATCH /api/v1/tours/{tourId}/reviews/{reviewId}`
3. **Delete** the review using `DELETE /api/v1/tours/{tourId}/reviews/{reviewId}`

### **Scenario 3: User Management (Admin)**
1. **Login** as admin using `POST /api/v1/users/login`
2. **Update** any user using `PATCH /api/v1/users/{userId}`
3. **Delete** any user using `DELETE /api/v1/users/{userId}`

---

## 📝 **Sample Response Formats**

### **Success Response (Create/Update)**
```json
{
  "status": "success",
  "data": {
    "data": {
      "_id": "5c88fa8cf4afda39709c2955",
      "name": "The Forest Hiker",
      "price": 397,
      // ... other fields
    }
  }
}
```

### **Success Response (Delete)**
```json
{
  "status": "success",
  "data": null
}
```

### **Error Response**
```json
{
  "status": "error",
  "message": "No document found with that ID"
}
```

---

## 🔧 **Testing Tools**

### **Using Postman:**
1. Import the endpoints above
2. Set up environment variables for `base_url` and `token`
3. Use the token from login response in Authorization header

### **Using cURL:**
```bash
# Login and get token
curl -X POST http://localhost:3000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Use token in subsequent requests
curl -X GET http://localhost:3000/api/v1/tours \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### **Using Thunder Client (VS Code):**
1. Create a new request
2. Set method, URL, headers, and body
3. Save token from login response for reuse

---

## ⚠️ **Important Notes**

1. **Replace IDs**: Use actual document IDs from your database
2. **Token Management**: Get fresh tokens when they expire
3. **Role Testing**: Test both user and admin roles
4. **Error Handling**: Test with invalid IDs, missing fields, etc.
5. **Validation**: Test with invalid data to see validation errors

---

## 🎯 **Quick Test Checklist**

- [ ] Create tour using factory
- [ ] Update tour using factory  
- [ ] Delete tour using factory
- [ ] Create review using factory
- [ ] Update review using factory
- [ ] Delete review using factory
- [ ] Update user using factory (admin)
- [ ] Delete user using factory (admin)
- [ ] Update profile (custom implementation)
- [ ] Test error handling with invalid IDs
- [ ] Test authentication/authorization

Happy Testing! 🚀
