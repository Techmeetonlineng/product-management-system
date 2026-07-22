# OnCampus Marketplace - Product Management System

A comprehensive marketplace platform for managing products, vendors, and customers with role-based access control and modern web technologies.

## 🎯 Project Overview

**OnCampus Marketplace** is a full-stack e-commerce platform designed for campus vendors and students to buy and sell products. The system features:

- **Admin Dashboard**: Manage vendors, products, categories, and approvals
- **Vendor Portal**: List and manage products with inventory tracking
- **Customer Interface**: Browse and purchase approved products
- **Role-Based Access Control**: Admin, Vendor, and Customer roles
- **Product Approval Workflow**: Admin approval required before customer visibility
- **Real-time Notifications**: SweetAlert2 integration for user feedback

---

## 📋 Features

### Admin Features

- Dashboard with statistics (total vendors, pending vendors, total products)
- Product approval/rejection workflow
- Vendor account management (approve, reject, suspend)
- Category management
- Customer management
- Analytics and reports

### Vendor Features

- Product creation and management
- Inventory management
- Order tracking
- Profile management
- Account status monitoring (pending approval)

### Customer Features

- Browse approved products
- Filter by category
- View product details
- Shopping cart management
- Order history

---

## 🛠️ Tech Stack

### Frontend

- **HTML5** / **CSS3** / **JavaScript (ES6+)**
- **Bootstrap 5** - Responsive UI framework
- **SweetAlert2** - Beautiful alerts and modals
- **Font Awesome** - Icon library
- **Fetch API** - HTTP requests

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **pg (node-postgres)** - Database driver with Promise support
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling

### Database

- **PostgreSQL** - Relational database

---

## 📁 Project Structure

```
product-management-system/
├── client/                          # Frontend application
│   ├── assets/
│   │   ├── css/                     # Stylesheets
│   │   ├── images/                  # Image assets
│   │   └── js/
│   │       ├── config.js            # API configuration
│   │       ├── api-service.js       # Centralized API client
│   │       ├── utils.js             # Utility functions
│   │       ├── auth.js              # Authentication logic
│   │       ├── admin/               # Admin dashboard modules
│   │       └── vendor/              # Vendor portal modules
│   ├── pages/                       # HTML pages
│   │   ├── admin/                   # Admin pages
│   │   ├── vendor/                  # Vendor pages
│   │   └── customer/                # Customer pages
│   ├── login.html                   # Login page
│   ├── register.html                # Registration page
│   └── index.html                   # Landing page
│
├── server/                          # Backend application
│   ├── app.js                       # Express app setup
│   ├── config/
│   │   └── database.js              # Database configuration
│   ├── controllers/                 # Business logic
│   ├── models/                      # Database operations
│   ├── routes/                      # API routes
│   ├── middleware/                  # Custom middleware
│   ├── validations/                 # Input validation
│   ├── utils/                       # Utility functions
│   └── uploads/                     # Uploaded files
│
├── database/                        # Database files
│   ├── schema.sql                   # Original MySQL schema (reference only)
│   ├── seed.sql                     # Original MySQL sample data (reference only)
│   ├── schema_postgresql.sql        # PostgreSQL schema (use this)
│   ├── seed_postgresql.sql          # PostgreSQL sample data (use this)
│   ├── seed.js                      # PostgreSQL seeder script
│   └── reset-database.sql           # Reset script
│
├── script/                          # Utility scripts
├── docs/                            # Documentation
├── API_DOCUMENTATION.md             # API reference
├── package.json                     # Dependencies
├── .env                             # Environment variables
└── README.md                        # This file
```

---

## ⚙️ Installation

### Prerequisites

- Node.js (v14+)
- PostgreSQL (v13+)
- npm or yarn

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd product-management-system
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment

Create `.env` file in the root directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=oncampus_marketplace

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

### Step 4: Database Setup

```bash
# Create database and tables
psql -U postgres -d oncampus_marketplace -f database/schema_postgresql.sql

# (Optional) Seed sample data
psql -U postgres -d oncampus_marketplace -f database/seed_postgresql.sql
```

### Step 5: Start Application

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

Application will be available at: `http://localhost:5000`

---

## 🔐 Authentication & Roles

### Role Hierarchy

1. **Admin (Role 1)**
   - Full system access
   - Vendor and product approval
   - Category management
   - Customer support

2. **Vendor (Role 2)**
   - Create and manage products
   - Track inventory
   - View orders
   - Account status monitoring

3. **Customer (Role 3)**
   - Browse approved products
   - Place orders
   - Track purchases
   - Immediate account activation

### Registration Flow

- **Vendors**: Register → Pending Status → Awaiting Admin Approval
- **Customers**: Register → Approved Status → Immediate Access

---

## 🚀 API Architecture

### Centralized API Service

The frontend uses a centralized `APIService` class for all HTTP requests:

```javascript
// Configuration (config.js)
const CONFIG = {
  API: { BASE_URL, ENDPOINTS },
  ROLES: { ADMIN, VENDOR, CUSTOMER },
};

// Service (api-service.js)
const API = new APIService(CONFIG.API.BASE_URL, CONFIG.STORAGE_KEYS);

// Usage
await API.get(CONFIG.API.ENDPOINTS.PRODUCTS.LIST);
await API.post(CONFIG.API.ENDPOINTS.AUTH.LOGIN, data);
await API.put(CONFIG.API.ENDPOINTS.PRODUCTS.UPDATE(id), data);
```

### Benefits

✅ Single point for API configuration
✅ Automatic Bearer token injection
✅ Consistent error handling
✅ FormData support for file uploads
✅ Easy to maintain and update endpoints

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed endpoint reference.

---

## 🎨 UI Components

### Admin Dashboard

- Vendor statistics and management
- Product approval workflow
- Category management
- Pending approvals panel

### Vendor Portal

- Product inventory management
- Stock level tracking
- Order management
- Profile and settings

### Customer Interface

- Product browsing and filtering
- Search functionality
- Shopping cart
- Order history

---

## 📊 Database Schema Highlights

### Key Tables

- **users**: User profiles and authentication
- **products**: Product listings with approval status
- **categories**: Product categorization
- **roles**: User role definitions

### Important Features

- Parameterized queries prevent SQL injection
- Proper foreign key relationships
- Indexing for performance
- Timestamp tracking (created_at, updated_at)

---

## 🔄 Workflow Examples

### Product Approval Workflow

1. Vendor creates product → Status: `Pending`
2. Admin reviews product
3. Admin approves → Status: `Approved` → Visible to customers
4. OR Admin rejects → Status: `Rejected` → Not visible

### Vendor Account Workflow

1. Vendor registers → Status: `Pending`
2. Admin reviews vendor account
3. Admin approves → Status: `Approved` → Can login and create products
4. OR Admin rejects → Status: `Rejected` → Cannot access system

---

## 📝 Development Notes

### Frontend Best Practices

- Centralized API configuration
- Role-based access checks
- Consistent error handling
- Utility function library
- SweetAlert2 for user feedback

### Backend Best Practices

- Middleware for authentication/authorization
- Input validation before database operations
- Parameterized queries for security
- Consistent JSON response format
- Error logging and handling

### File Structure Best Practices

- Separation of concerns (models, controllers, routes)
- Reusable utility functions
- Centralized configuration
- Clear naming conventions

---

## 🐛 Troubleshooting

### Database Connection Error

```
Check .env file for correct credentials
Verify PostgreSQL service is running
Ensure database exists: psql -U postgres -d oncampus_marketplace -f database/schema_postgresql.sql
```

### JWT Token Error

```
Regenerate token: npm run reset-token
Verify JWT_SECRET in .env file
Check token expiration in browser console
```

### File Upload Issues

```
Check server/uploads/ directory permissions
Verify multer configuration in middleware
Check file size limits
```

---

## 📚 Additional Resources

- [API Documentation](./API_DOCUMENTATION.md) - Complete API reference
- [Database Schema](./database/schema.sql) - SQL schema
- [Environment Setup](./.env.example) - Example environment file

---

## 👥 Contributing

To contribute to this project:

1. Create a feature branch
2. Make your changes
3. Submit a pull request with description
4. Code review before merge

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 📞 Support

For support and questions:

- Check API_DOCUMENTATION.md for endpoint details
- Review database/schema.sql for data structure
- Examine existing code patterns for conventions
- Create an issue for bugs and feature requests

---

**Last Updated:** July 13, 2024
**Version:** 1.0.0
