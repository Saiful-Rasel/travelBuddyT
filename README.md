# TravelBuddyT

**Live Demo:**https://travel-buddy-t.vercel.app/          
**GitHub Demo:**https://github.com/Saiful-Rasel/travelBuddyT

---

## Project Overview

TravelBuddyT is a comprehensive travel planning application that allows users to create, manage, and share travel plans. It includes features for reviewing trips, matching travel partners, and handling payments securely. The admin panel provides full control over user data and travel plans.

---

## Features

- User authentication (signup/login) with JWT
- Create, update, and delete travel plans
- Match with other travelers based on plans
- Leave reviews for travel plans and users
- Admin panel for managing users, payments, and travel plans
- Payment integration with secure transaction handling
- Responsive UI for mobile, tablet, and desktop

---

## Technology Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, ShadCN UI  
- **Backend:** Node.js, Express, TypeScript  
- **Database:** Prisma ORM, PostgreSQL/MySQL (choose your DB)  
- **Authentication:** JWT, Cookies  
- **Deployment:** Vercel (frontend), Render / Heroku (backend)  
- **Others:** Sonner for notifications, CORS configuration for secure API calls  

---

## Setup & Usage Instructions

### Prerequisites

- Node.js >= 18.x
- npm or yarn
- PostgreSQL or MySQL database
- `.env` file with configuration

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/TravelBuddyT.git
cd TravelBuddyT
# For backend
cd backend
npm install

# For frontend
cd ../frontend
npm install

## Environment Variables

Create a `.env` file in the `backend` folder and add the following variables:

```env
# Server
PORT=8000

# Database
DATABASE_URL=postgresql://<DB_USER>:<DB_PASSWORD>@<DB_HOST>:<DB_PORT>/<DB_NAME>?schema=public

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>

# Hashing
SALT_ROUND=10

# JWT Config
JWT_SECRET=<your_jwt_secret>
REFRESH_TOKEN_SECRET=<your_refresh_token_secret>
EXPIRES_IN=1d
REFRESH_TOKEN_EXPIRES_IN=7d

# Reset password token
RESET_PASS_TOKEN=<your_reset_pass_token_secret>
RESET_PASS_TOKEN_EXPIRES_IN=15m
RESET_PASS_LINK=<your_frontend_reset_password_url>

# Email (for sending emails)
EMAIL=<your_email_address>
APP_PASS=<your_email_app_password>

# Admin creation
ADMIN_EMAIL=<admin_email>
ADMIN_PASSWORD=<admin_password>

# SSLCommerz (Payment Gateway)
STORE_ID=<your_ssl_store_id>
STORE_PASSWORD=<your_ssl_store_password>

# Node environment
NODE_ENV=production
