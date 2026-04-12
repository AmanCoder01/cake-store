# 🎂 Cake Store - Production Ready MERN Stack Application

A premium, scalable eCommerce platform for artisanal cakes, built with modern web technologies and startup-grade architecture.

![Cake Store Preview](https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=1200)

## 🧱 Tech Stack

- **Frontend**: React.js, Tailwind CSS, Redux Toolkit, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Token) with Role-Based Access Control
- **Security**: Helmet, Rate Limiting, Mongo Sanitize, XSS Prevention

## 🚀 Key Features

### For Customers
- **Elegant UI**: Mobile-responsive, glassmorphism design with smooth animations.
- **Advanced Filtering**: Search, sort by price/rating, and category filters.
- **Dynamic Cart**: Add/remove items and update quantities with real-time totals.
- **Secure Checkout**: Address management and Cash on Delivery (COD) payment.
- **Order Tracking**: View order history and real-time status updates.

### For Admins
- **Dashboard**: Professional analytics with revenue graphs and key metrics.
- **Product Management**: Full CRUD operations with image URL support and stock tracking.
- **Order Control**: Manage all customer orders and update delivery status.
- **Security**: Hidden admin routes restricted to authenticated admin users only.

## 🛠️ Installation & Setup

### 1. Prerequisites
- Node.js (v16+)
- MongoDB Atlas Account or Local MongoDB

### 2. Clone and Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 3. Environment Variables
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=30d
NODE_ENV=development
```

### 4. Seed the Database
Populate the database with demo products and an admin account:
```bash
cd backend
npm run seed
```

### 5. Run the Application
```bash
# Run Backend (Port 5000)
cd backend
npm run dev

# Run Frontend (Port 5173)
cd frontend
npm run dev
```

## 🔐 Credentials (Demo)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@cakestore.com` | `password123` |
| **User** | `customer@example.com` | `password123` | (Create one via Signup)

## 📡 Deployment Guide

### Backend (Render / Heroku)
1. Push your code to GitHub.
2. Connect your repo to Render.
3. Add Environment Variables in the Dashboard.
4. Build Command: `npm install`
5. Start Command: `node server.js`

### Frontend (Vercel / Netlify)
1. Connect your repo to Vercel.
2. Ensure the root directory is `frontend`.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Vercel will automatically detect the Vite config.

---

Built with ❤️ by **Antigravity**
