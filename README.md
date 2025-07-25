# Docora Backend

A Node.js backend API for an online hospital consultation system built with Express.js, MongoDB, and Socket.IO for real-time communication.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Documentation](#api-documentation)
- [Socket.IO Events](#socketio-events)
- [Contributing](#contributing)

## ✨ Features

- User authentication and authorization
- Real-time chat functionality
- Video/Audio call support
- RESTful API design
- MongoDB integration
- Socket.IO for real-time communication
- Modular architecture
- Express.js middleware integration

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Real-time Communication**: Socket.IO
- **Environment Management**: dotenv
- **CORS**: cors middleware
- **Development**: nodemon

## 📁 Project Structure

```
docora_backend/
├── app.js                          # Express app configuration and middleware setup
├── server.js                       # Server entry point and configuration
├── package.json                    # Project dependencies and scripts
├── README.md                       # Project documentation
│
├── src/                            # Source code directory
│   ├── api/                        # API layer
│   │   └── v1/                     # API version 1
│   │       ├── controllers/        # Request handlers and business logic
│   │       │   ├── auth.controller.js    # Authentication related controllers
│   │       │   └── user.controller.js    # User management controllers
│   │       │
│   │       ├── middlewares/        # Custom middleware functions
│   │       │   ├── auth.middleware.js     # Authentication middleware
│   │       │   └── validate.middleware.js # Request validation middleware
│   │       │
│   │       └── routes/             # API route definitions
│   │           ├── auth.routes.js         # Authentication routes
│   │           ├── user.routes.js         # User management routes
│   │           └── index.js               # Route aggregation
│   │
│   ├── config/                     # Configuration files
│   │   ├── database.js             # Database connection configuration
│   │   ├── index.js                # Main configuration exports
│   │   └── socket.js               # Socket.IO configuration
│   │
│   ├── models/                     # Database models (Mongoose schemas)
│   │   └── User.model.js           # User data model
│   │
│   ├── services/                   # Business logic and external service integrations
│   │   └── auth.service.js         # Authentication service layer
│   │
│   ├── sockets/                    # Socket.IO event handlers
│   │   ├── call.handler.js         # Video/Audio call events
│   │   ├── chat.handler.js         # Chat messaging events
│   │   └── index.js                # Socket event aggregation
│   │
│   └── utils/                      # Utility functions and helpers
│       ├── ApiError.js             # Custom error handling class
│       ├── ApiResponse.js          # Standardized API response format
│       └── asyncHandler.js         # Async function wrapper for error handling
```

### 📂 Directory Explanations

#### `/src/api/v1/`
Contains the API layer with versioned endpoints:
- **controllers/**: Handle HTTP requests, process data, and return responses
- **middlewares/**: Custom middleware for authentication, validation, etc.
- **routes/**: Define API endpoints and link them to controllers

#### `/src/config/`
Configuration files for various services:
- **database.js**: MongoDB connection setup
- **socket.js**: Socket.IO server configuration
- **index.js**: Centralized configuration exports

#### `/src/models/`
Mongoose schemas and models:
- **User.model.js**: User data structure and validation

#### `/src/services/`
Business logic layer:
- **auth.service.js**: Authentication and authorization logic

#### `/src/sockets/`
Real-time communication handlers:
- **call.handler.js**: Video/Audio call events and room management
- **chat.handler.js**: Real-time messaging functionality

#### `/src/utils/`
Helper functions and utilities:
- **ApiError.js**: Custom error class for consistent error handling
- **ApiResponse.js**: Standardized response format
- **asyncHandler.js**: Wrapper for async route handlers

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ayeminaung010/docora_backend.git
   cd docora_backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=8000

# Database
MONGODB_URI=mongodb://localhost:27017/docora

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:3000
```

## 📜 Available Scripts

```bash
# Start the production server
npm start

# Start the development server with nodemon
npm run dev

# Run tests (to be implemented)
npm test
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user profile

### User Endpoints
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user profile
- `DELETE /api/v1/users/:id` - Delete user

## 🔌 Socket.IO Events

### Chat Events
- `join-chat` - Join a chat room
- `send-message` - Send a message
- `message-received` - Receive a message
- `typing` - User typing indicator

### Call Events
- `join-call` - Join a video/audio call
- `call-user` - Initiate a call
- `answer-call` - Answer incoming call
- `end-call` - End the call
- `call-ended` - Call ended notification

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **ayeminaung010** - *Initial work* - [GitHub](https://github.com/ayeminaung010)

## 🆘 Support

If you have any questions or need help, please open an issue on GitHub.