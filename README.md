# Inventory Management System

A modern, full-stack Inventory Management System built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- User Authentication & Authorization
- Product Management
- Inventory Tracking
- Order Management
- Dashboard with Analytics
- Profile Management

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Bcrypt for Password Hashing
- Nodemailer for Email Services

### Frontend
- React.js
- Redux Toolkit for State Management
- Material-UI for UI Components
- React Router for Navigation
- Axios for API Calls
- React Toastify for Notifications

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd inventory-management-system
```

2. Install Backend Dependencies
```bash
cd backend
npm install
```

3. Install Frontend Dependencies
```bash
cd frontend
npm install
```

4. Create a .env file in the backend directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_HOST=your_email_host
EMAIL_PORT=your_email_port
EMAIL_USER=your_email_username
EMAIL_PASS=your_email_password
```

### Running the Application

1. Start the Backend Server
```bash
cd backend
npm start
```

2. Start the Frontend Development Server
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- POST `/api/users/register` - Register a new user
- POST `/api/users/login` - Login user
- GET `/api/users/logout` - Logout user

### User Management
- GET `/api/users/getUser` - Get user profile
- PATCH `/api/users/updateuser` - Update user profile
- PATCH `/api/users/changepassword` - Change password

### Products
- GET `/api/products` - Get all products
- POST `/api/products` - Create a new product
- PUT `/api/products/:id` - Update a product
- DELETE `/api/products/:id` - Delete a product

### Inventory
- GET `/api/inventory` - Get inventory items
- PUT `/api/inventory/:id` - Update inventory item

### Orders
- GET `/api/orders` - Get all orders
- POST `/api/orders` - Create a new order
- PUT `/api/orders/:id` - Update an order
- PUT `/api/orders/:id/status` - Update order status

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.