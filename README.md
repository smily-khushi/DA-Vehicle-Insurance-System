# 🚗 DA-Vehicle Insurance System

A modern, full-stack **Vehicle Insurance Management System** built with **React**, **Node.js**, **Express**, and **MongoDB**. This application provides a seamless platform for users to purchase vehicle insurance, file claims, and track their claim status in real-time. Admins can manage and process claims through an intuitive dashboard.

## ✨ Features

### 👥 User Features
- **Vehicle Insurance Plans**: Browse and purchase various insurance plans for cars and bikes
- **Instant Policy Generation**: Get policy documents instantly in your email
- **Easy Claim Filing**: 3-step wizard-based claim submission process
- **Claim Tracking**: Track your claim status in real-time with visual timeline
- **Document Upload**: Upload policy documents and repair estimates
- **Dashboard**: View active policies and recent claims history
- **24/7 Support**: Contact support team with integrated contact form

### 🛡️ Admin Features
- **Dashboard Analytics**: View statistics on policies, claims, and users
- **Claims Management**: Review and process all submitted claims
- **Status Updates**: Approve or reject claims with real-time notifications
- **Document Verification**: Download and verify uploaded policy documents
- **User Management**: View and manage all registered users
- **Policy Management**: Create and manage insurance policies

### 🎨 Technical Highlights
- **Dark Mode Support**: Beautiful glass-morphism UI with dark theme
- **Responsive Design**: Fully responsive on mobile, tablet, and desktop
- **Real-time Updates**: Claims data updates instantly
- **Secure Authentication**: Role-based access control (Admin/User)
- **Document Management**: File upload and download functionality
- **Modern Stack**: Latest versions of React, Bootstrap, Express

---

## 📋 System Requirements

- **Node.js** v14+ 
- **MongoDB** (Local or Atlas Cloud Database)
- **npm** or **yarn**

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR-USERNAME/DA-Vehicle-Insurance-System.git
cd DA-Vehicle-Insurance-System
```

### 2. Backend Setup

```bash
cd Backend

# Install dependencies
npm install

# Create .env file
# Add the following environment variables:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/insurance-system
# Or use MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/insurance-system

# Start the backend server
npm start
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd Frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173` (Vite) or `http://localhost:3000` (if using Create React App)

---

## 📁 Project Structure

```
DA-Vehicle-Insurance-System/
├── Backend/
│   ├── models/
│   │   ├── User.js          # User schema
│   │   ├── Policy.js        # Insurance policy schema
│   │   └── Claim.js         # Claim submission schema
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── policy.js        # Policy management routes
│   │   └── claim.js         # Claim submission/management routes
│   ├── uploads/             # File uploads directory
│   ├── seedAdmin.js         # Create default admin user
│   ├── seedPolicies.js      # Seed sample policies
│   ├── server.js            # Express server entry point
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MyNavbar.jsx           # Navigation bar
│   │   │   ├── HeroSection.jsx        # Landing page hero
│   │   │   ├── AdminSidebar.jsx       # Admin navigation
│   │   │   └── InsuranceCard.jsx      # Plan card component
│   │   ├── pages/
│   │   │   ├── Home.jsx               # Landing page
│   │   │   ├── Login.jsx              # Authentication
│   │   │   ├── Dashboard.jsx          # User dashboard
│   │   │   ├── VehicleInsurance.jsx   # Insurance plans & claims
│   │   │   ├── ClaimStatus.jsx        # Claim tracking
│   │   │   ├── About.jsx              # About page
│   │   │   ├── Contact.jsx            # Contact page
│   │   │   └── Admin/                 # Admin pages
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminClaimsList.jsx
│   │   │       ├── AdminClaimDetails.jsx
│   │   │       ├── AdminPolicy.jsx
│   │   │       └── AdminUsers.jsx
│   │   ├── App.jsx                    # Main App component
│   │   ├── App.css                    # Global styles
│   │   └── main.jsx                   # Entry point
│   └── package.json
│
└── .gitignore              # Git ignore rules
```

---

## 🔑 Key Features Explained

### Claim Management
1. **User Submits Claim**
   - Enter policy number and vehicle details
   - Provide incident date and description
   - Upload policy document and repair estimate
   - System generates unique Claim ID (e.g., CLM-0001-ABC)

2. **Admin Reviews Claim**
   - View all submitted claims in dashboard
   - Check uploaded documents
   - Verify user information
   - Approve or reject claim

3. **User Tracks Claim**
   - Search claim by ID
   - View real-time status updates
   - See timeline of claim processing
   - Track documents

### Insurance Plans
- **Basic Liability**: Essential coverage
- **Standard Coverage**: Comprehensive coverage
- **Premium Coverage**: Full coverage with additional benefits

---

## 🔐 Authentication

### Default Admin User
Run the seed script to create a default admin user:

```bash
cd Backend
npm run seed:admin
```

**Default Admin Credentials:**
- Email: `admin@safedrive.com`
- Password: `admin123`

⚠️ **Important**: Change default credentials in production!

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Claims
- `GET /api/claims` - Get all claims (Admin)
- `GET /api/claims/:id` - Get claim details
- `POST /api/claims` - Submit new claim
- `PATCH /api/claims/:id/status` - Update claim status (Admin)

### Policies
- `GET /api/policies` - Get all policies
- `POST /api/policies` - Create new policy (Admin)

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user details

---

## 🎯 Usage Guide

### For Users
1. **Sign Up**: Create an account with email and password
2. **Browse Plans**: View available insurance plans
3. **Purchase Policy**: Select and purchase a plan
4. **File Claim**: Go to Vehicle Insurance → Need to Raise a Claim
5. **Track Status**: Use your unique Claim ID to track progress

### For Admins
1. **Login**: Use admin credentials
2. **View Dashboard**: See statistics and recent claims
3. **Manage Claims**: Review submissions and approve/reject
4. **View Details**: Click "View Details" to see complete claim information
5. **Download Documents**: Download policy and repair estimate files

---

## 🛠️ Technologies Used

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **Bootstrap 5** - UI components
- **React Router** - Navigation
- **React Icons** - Icon library
- **Fetch API** - HTTP requests

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Multer** - File upload middleware
- **CORS** - Cross-origin requests

### Styling
- **Glass-morphism Design** - Modern UI aesthetic
- **Dark Mode** - Eye-friendly dark theme
- **Responsive Design** - Mobile-first approach

---

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/insurance-system
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Known Issues & Future Improvements

### Current Limitations
- [ ] Email notifications not yet implemented
- [ ] Payment gateway integration pending
- [ ] SMS alerts not implemented

### Planned Features
- 📧 Email notifications for claim updates
- 💳 Online payment integration
- 📱 Mobile app version
- 🔔 SMS and push notifications
- 📊 Advanced analytics for admins
- 🤖 AI-based claim assessment

---

## ⭐ Show Your Support

If you found this project helpful, please consider giving it a ⭐ on GitHub!

---

**Made with ❤️ for Insurance Innovation**
