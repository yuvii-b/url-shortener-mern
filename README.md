# 🔗 NovaLink - URL Shortener (MERN)

A modern, feature-rich URL shortening platform built with the MERN stack. Create short, memorable links instantly without authentication. Track analytics, manage links, and gain insights with a beautiful, responsive interface supporting dark mode.

## 📋 Overview

NovaLink is a full-stack web application that simplifies URL sharing and analytics. Whether you're a casual user shortening a quick link or a power user analyzing click patterns, NovaLink provides an intuitive experience with real-time data updates. Built with modern technologies, it's production-ready and deployable to Vercel and Render.

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Verification](#verification-checklist)
- [Authentication & Security](#-authentication--security)
- [API Endpoints](#-api-endpoints)
  - [Authentication](#authentication--api-auth)
  - [URL Management](#url-management--api-url)
  - [Analytics](#analytics--api-analytics)
- [UI/UX Features](#️-uiux-features)
- [Scripts](#-scripts)
- [Deployment Guide](#-deployment-guide)
  - [Frontend (Vercel)](#frontend-vercel)
  - [Backend (Render)](#backend-render)
  - [Keep Backend Active (Uptime Robot)](#keep-backend-active-uptime-robot)
  - [Database (MongoDB Atlas)](#database-mongodb-atlas)
- [Database Schema](#-database-schema)
- [Common Issues & Solutions](#️-common-issues--solutions)
- [Testing](#-testing)
- [License](#-license)

## ✨ Features

### 👥 Guest Features (No Login Required)
- **Instant URL Shortening** - Create short, shareable links in seconds
- **No Registration** - Start shortening URLs immediately without signup
- **Copy to Clipboard** - Quick copy functionality with visual feedback
- **Direct Opening** - Open original URLs directly from the app
- **Persistent Guest Links** - Links are stored locally for easy management
- **Guest Link Claiming** - Claim previously created guest links after registration

### 🔐 Authenticated User Features
- **Account Management** - Register, login, and manage your profile
- **Link Management Dashboard** - View, search, organize, and delete your links
- **Advanced Analytics** - Track clicks, referrers, geographic data, and trends
- **Real-time Updates** - Auto-refreshing analytics every 15 seconds
- **Analytics Dashboard** - Interactive charts with:
  - Click trends over time (line chart)
  - Top performing links (bar chart)
  - Referrer analysis (pie chart)
  - Geographic distribution (bar chart)
- **Bulk Operations** - Manage multiple links efficiently

### 🎨 UI/UX Features
- **Responsive Design** - Seamless experience across all devices
- **Dark Mode Support** - Eye-friendly theme toggle with persistent preferences
- **Spotlight Cards** - Highlighted short URLs with full link display
- **Real-time Notifications** - Toast notifications for user feedback
- **Loading States** - Clear visual feedback during async operations
- **Smooth Animations** - Polished transitions and page loading effects
- **Vercel Analytics** - Built-in page tracking and insights
- **SPA Navigation** - Fast, client-side routing without page reloads

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern UI library with hooks
- **Vite 5.4.18** - Lightning-fast build tool
- **React Router DOM 6.30.1** - Client-side routing
- **Axios 1.8.4** - Promise-based HTTP client
- **Chart.js 4.4.8** - Interactive data visualization
- **react-chartjs-2 5.3.0** - React wrapper for Chart.js
- **@vercel/analytics 2.0.1** - Production analytics
- **Vitest 3.0.9** - Lightning-fast unit testing
- **React Testing Library 16.3.0** - Component testing
- **CSS3 with Variables** - Dynamic theming system

### Backend
- **Node.js (ES6+)** - JavaScript runtime
- **Express 4.18.2** - Minimalist web framework
- **MongoDB 8.0.3** - NoSQL database with Mongoose
- **Mongoose 8.0.3** - MongoDB object modeling
- **JWT (jsonwebtoken 9.0.2)** - Token-based authentication
- **bcryptjs 2.4.3** - Password hashing
- **express-validator 7.0.1** - Input validation and sanitization
- **CORS 2.8.5** - Cross-origin resource sharing
- **Nodemon 3.0.2** - Development auto-reload

## 🏗️ Architecture

```
url-shortener-mern/
├── frontend/                      # React + Vite application
│   ├── public/
│   │   └── favicon.svg           # URL-themed chain link icon
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx        # Main layout with sidebar
│   │   │   ├── StatCard.jsx      # Analytics metric cards
│   │   │   └── ChartPanel.jsx    # Reusable chart component
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Auth state management
│   │   ├── pages/
│   │   │   ├── HomePage.jsx      # URL shortener form
│   │   │   ├── LinksPage.jsx     # User links list with search
│   │   │   ├── AnalyticsPage.jsx # Dashboard with charts
│   │   │   ├── AuthPage.jsx      # Login/Register forms
│   │   │   ├── LockedSectionPage.jsx # Guest access overlay
│   │   │   └── QrComingSoonPage.jsx  # QR codes feature placeholder
│   │   ├── services/
│   │   │   ├── apiClient.js      # Axios instance with base URL
│   │   │   ├── authApi.js        # Auth API calls
│   │   │   ├── urlApi.js         # URL API calls
│   │   │   └── analyticsApi.js   # Analytics API calls
│   │   ├── utils/
│   │   │   ├── formatters.js     # Date/text formatting utilities
│   │   │   └── guestLinks.js     # Local guest link management
│   │   ├── App.jsx               # Route definitions
│   │   ├── main.jsx              # React root with Analytics
│   │   └── styles.css            # Global styles with theme variables
│   ├── vercel.json               # SPA rewrite configuration
│   └── package.json
│
├── backend/                       # Express.js + MongoDB API
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── urlController.js      # URL CRUD and redirect
│   │   └── analyticsController.js # Analytics aggregation
│   ├── middleware/
│   │   └── auth.js               # JWT validation & optional auth
│   ├── models/
│   │   ├── User.js               # User schema (name, email, password)
│   │   ├── Url.js                # URL schema with click tracking
│   │   └── Analytics.js          # Analytics schema (clicks, referrers)
│   ├── routes/
│   │   ├── auth.js               # /api/auth/* endpoints
│   │   ├── url.js                # /api/url/* endpoints
│   │   └── analytics.js          # /api/analytics/* endpoints
│   ├── services/
│   │   ├── authService.js        # Auth business logic
│   │   ├── urlService.js         # URL management logic
│   │   └── analyticsService.js   # Analytics calculations
│   ├── utils/
│   │   └── hashGenerator.js      # Short code generation (prime-based)
│   ├── package.json
│   └── server.js                 # Express app entry point
│
├── README.md                      # This file
└── .gitignore
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **npm** v9 or higher
- **MongoDB** (local instance or MongoDB Atlas)
- **Git** version control

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/yuvii-b/url-shortener-mern.git
cd url-shortener-mern/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create `backend/.env`:
```env
# Server
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/url-shortener?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_key_min_32_chars

# CORS Configuration (optional in local dev)
FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Environment
NODE_ENV=development
```

4. **Start the backend server**
```bash
npm run dev
```
Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ../frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

4. **Start the development server**
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

## 🔐 Authentication & Security

### Authentication Flow
- JWT-based authentication with 30-day expiration
- Password hashing with bcryptjs (bcrypt algorithm)
- Token stored securely in browser's auth context
- Optional authentication for public endpoints (guest shortening)

### Route Protection
```javascript
// Public routes - no token required
POST /api/url/shorten
GET /:shortCode

// Optional token routes - works with or without auth
POST /api/url/shorten (with Bearer token for account link)

// Protected routes - token required
GET /api/url/user
GET /api/analytics/dashboard
GET /api/analytics/url/:urlId
POST /api/url/claim
DELETE /api/url/:id
```

### Guest vs Authenticated Users
- **Guest Links**: Created without login, stored locally in browser
- **Account Links**: User must be logged in, stored in MongoDB
- **Claiming**: Guests can claim previous links after registration

## 📡 API Endpoints

### Authentication (`/api/auth`)
```http
POST /api/auth/register
Content-Type: application/json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepass123"
}
Response: { id, username, email, token }
```

```http
POST /api/auth/login
Content-Type: application/json
{
  "email": "john@example.com",
  "password": "securepass123"
}
Response: { id, username, email, token }
```

```http
GET /api/auth/me
Authorization: Bearer <token>
Response: { id, username, email }
```

### URL Management (`/api/url`)
```http
POST /api/url/shorten
Content-Type: application/json

{
  "originalUrl": "https://www.example.com/very/long/url/path"
}
Response: { 
  id, 
  shortCode, 
  originalUrl, 
  shortUrl,
  userId,
  clicks, 
  createdAt 
}
```

```http
GET /api/url/user
Authorization: Bearer <token>
Response: [
  { id, shortCode, originalUrl, shortUrl, clicks, createdAt },
  ...
]
```

```http
GET /:shortCode
(No auth required - public redirect)
Action: Redirects to original URL, tracks analytics
```

```http
POST /api/url/claim
Authorization: Bearer <token>
Content-Type: application/json
{
  "shortCodes": ["abc123", "def456"]
}
Response: { claimed, message }
```

```http
DELETE /api/url/:id
Authorization: Bearer <token>
Response: { message: "URL deleted successfully" }
```

### Analytics (`/api/analytics`)
```http
GET /api/analytics/dashboard
Authorization: Bearer <token>
Response: {
  summary: {
    totalUrls: 42,
    totalClicks: 1250,
    mostPopularUrl: { shortCode, clicks }
  },
  charts: {
    clicksOverTime: { labels: [...], data: [...] },
    topUrlsChart: { labels: [...], data: [...] }
  }
}
```

```http
GET /api/analytics/url/:urlId
Authorization: Bearer <token>
Response: {
  analytics: {
    referrerData: { labels: [...], data: [...] },
    countryData: { labels: [...], data: [...] }
  }
}
```

## 🎨 UI/UX Features

### Design System
- **Color Scheme**: Blue & white for light mode, dark slate (#0c1220) for dark mode
- **Typography**: Space Grotesk font family for modern feel
- **Spacing**: 8px grid system for consistency
- **Animations**: Smooth 0.2-0.35s transitions on interactions
- **Icons**: Font Awesome integration for professional look

### Key Components
- **Spotlight Card**: Highlighted short URL with copy feedback
- **Sidebar Navigation**: Collapsible with icon-based menu
- **Theme Toggle**: Smooth slider for dark/light mode
- **StatCards**: Metric display cards for analytics
- **Chart Panels**: Reusable chart wrapper for different chart types

### Responsive Breakpoints
- Mobile: < 769px
- Tablet: 769px - 1024px
- Desktop: > 1024px

## 📝 Scripts

### Backend (`backend/package.json`)
```bash
npm run dev      # Start with nodemon (auto-reload on file changes)
npm start        # Start with node (production)
```

### Frontend (`frontend/package.json`)
```bash
npm run dev      # Start Vite dev server with HMR
npm run build    # Build for production (outputs to dist/)
npm run preview  # Preview production build locally
npm test         # Run Vitest test suite
```

## 🌐 Deployment Guide

### Frontend (Vercel)

1. **Push to GitHub**
```bash
git push origin main
```

2. **Import in Vercel**
- Go to https://vercel.com
- Click "Import Project"
- Select your GitHub repository
- Set project root to `frontend`

3. **Configure Build Settings**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

4. **Add Environment Variables**
```
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

5. **Deploy** - Vercel auto-deploys on push

**Note**: `frontend/vercel.json` includes SPA rewrite rules. All routes redirect to `/index.html` for client-side routing.

### Backend (Render)

1. **Create Web Service**
- Go to https://render.com
- Select "New +" → "Web Service"
- Connect GitHub repository
- Set root directory to `backend`

2. **Configure Deployment**
- Environment: Node
- Build Command: `npm install`
- Start Command: `npm start`

3. **Add Environment Variables**
```
PORT=5000
MONGODB_URI=your_atlas_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=https://your-app.vercel.app
NODE_ENV=production
```

4. **Deploy** - Render watches repo and auto-deploys

### Keep Backend Active (Uptime Robot)

Render's free tier spins down inactive services after 15 minutes. To keep your API alive, use **Uptime Robot** to ping your backend every 5 minutes.

**Why This Matters**: URL redirects must be instant. When the backend cold-starts (boots from sleep), users experience 30+ second delays when clicking short links, creating a poor user experience. Keeping the backend active ensures redirect responses are fast and reliable.

1. **Sign up for Uptime Robot**
- Go to https://uptimerobot.com
- Create a free account

2. **Create a New Monitor**
- Click "Add New Monitor"
- Choose **Monitor Type**: HTTP(s)
- Enter **URL**: `https://your-backend.onrender.com/`
- Set **Monitoring Interval**: 5 minutes
- Add **Alert Contacts** (optional)

3. **Configure Monitor Settings**
- Monitor Friendly Name: "NovaLink Backend Health Check"
- Check Frequency: Every 5 minutes
- Timeout: 30 seconds
- Expected HTTP Response Code: 200

4. **Activate Monitor**
- Click "Create Monitor"
- Monitor will start sending requests every 5 minutes
- Your backend will stay awake 24/7

**Note**: This free approach works well for development. For production with guaranteed uptime, consider upgrading to Render's paid tier ($7+/month) which includes always-on service.

### Database (MongoDB Atlas)

1. **Create Free Cluster**
- Go to https://www.mongodb.com/cloud/atlas
- Sign up and create a shared cluster
- Choose your region

2. **Create Database User**
- Network Access → Add IP Address → 0.0.0.0/0 (development)
- Database Access → Add User with strong password

3. **Get Connection String**
- Click "Connect"
- Select "Drivers"
- Copy MongoDB URI
- Replace `<username>` and `<password>`

4. **Configure Backend**
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/url-shortener?retryWrites=true&w=majority
```

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  createdAt: Date
}
```

### URLs Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (null for guest links),
  originalUrl: String,
  shortCode: String (unique),
  clicks: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Analytics Collection
```javascript
{
  _id: ObjectId,
  urlId: ObjectId,
  referrer: String,
  country: String,
  timestamp: Date,
  userAgent: String
}
```

## ⚠️ Common Issues & Solutions

### Issue: 404 on Route Refresh
**Problem**: Refreshing on `/analytics` or `/links` shows 404
**Solution**: `frontend/vercel.json` already configured with SPA rewrites

### Issue: CORS Blocked
**Problem**: Browser shows "CORS policy: Cross-Origin Request Blocked"
**Solution**: Ensure backend env has `FRONTEND_URL=your_deployed_frontend_url`

### Issue: 404 on Auth Endpoints
**Problem**: Getting 404 on `/auth/register`
**Solution**: Frontend env must include `/api` in URL: `VITE_API_BASE_URL=http://localhost:5000/api`

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm test              # Run tests once
npm test -- --watch  # Watch mode
```

### Backend Syntax Check
```bash
cd backend
node --check server.js
node --check models/Url.js
```

### Production Build Test
```bash
cd frontend
npm run build
# Check dist/ folder is created
```

## 📄 License

ISC - Open Source

## 👥 Author

- **Yuvaraj B** - Full-stack development
- Built with ❤️ using React, Express, and MongoDB

---
