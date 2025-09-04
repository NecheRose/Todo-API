# Todo-API

A Todo-API is a **secure and scalable Task Management API** built with Node.js and Express. It allows users to manage personal tasks efficiently. Users can create, read, update, and delete tasks, categorize them, set deadlines, mark tasks as complete/incomplete, and authenticate via JWT or Google OAuth.

---

## ✨ Key Features

- **User Management:** Registration, login, password reset, profile update  
- **Authentication:** JWT-based, Optional Google OAuth (via Passport.js)
- **Authorization:** Role-based access (Admin/User)  
- **Token Management:** Store and validate refresh tokens using Redis  
- **Validation:** Input validation (via express-validator)
- **Security:** Rate limiting to prevent brute-force attacks Password hashing
- **Schedule/Reminders:** Scheduling tasks and reminders for deadlines (via node-cron)
- **Subscription:** For paid plans (premium benefits) 
- **Audit logging:** Log all users activities on the app
- **Realtime:** Socket.IO (Task updates)


---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB, Mongoose  
- **Authentication:** JWT, bcrypt, crypto  
- **Token Management/Caching:** Redis   
- **Validation:** Express-Validator  
- **Email Integration:** Nodemailer / SendGrid  
- **Environment Management:** dotenv  

---

## 🚀 Getting Started

Follow these steps to get the project running locally.

### 1. Prerequisites

- [Node.js](https://nodejs.org/en/) v18.17+  
- [npm](https://www.npmjs.com/)  
- MongoDB Atlas or Compass

### 2. Installation

# Clone the repo
```bash
git clone https://github.com/yourusername/Todo-API.git
cd shopmate-backend
```
# Install dependencies
```bash
npm install
```

### 3. Set up Environment Variables
   
   Create a `.env` file in the root of the project and add the following:

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string

   # JWT setup
   ACCESS_TOKEN_SECRET
   REFRESH_TOKEN_SECRET

   # Email (for nodemailer setup)
   SENDGRID_HOST=sendgrid.net
   SENDGRID_PORT=465
   SENDGRID_SECURE=true
   SENDGRID_USER
   SENDGRID_API_KEY
   EMAIL_USER=your_email

   # Redis setup (Refresh token management)
   REDIS_HOST=your_redis_host
   REDIS_PORT=your_redis_port
   REDIS_PASSWORD=your_redis_password
   ```

### 4. Start development server
   ```bash
   npm run dev
   ```

## 📖 API Documentation

The Todo-API is fully documented with Postman for easy testing and collaboration.  
Explore endpoints inside the Todo-API Workspace for request/response samples.

### Collections Included
- **Auth APIs** – Register, login, logout, email verification, password reset, etc.  
- **User APIs** – Profile management, update, password change, account deletion. 
- **Category APIs** – Initialize and verify payments.   
- **Task APIs** – Create, edit and delete tasks.  
- **Payment APIs** – Initialize and verify payments for premium plans. 

