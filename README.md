# 📘 Todo-API – Task Management API

The Todo-API is a secure and scalable Task Management backend built with Node.js + Express + MongoDB.
It helps users create, organize, and track tasks efficiently with support for categories, deadlines and reminders.

---

# ✨ Key Features

- **User Management:** Registration, login, password reset, profile update  
- **Authentication:** JWT-based  
- **Authorization:** Role-based access (Admin/User)  
- **Token Management:** Store and validate refresh tokens (cookies)  
- **Validation:** Input validation (via express-validator)  
- **Security:** Rate limiting to prevent brute-force attacks, Password hashing  
- **Deadlines/Reminders:** Setting task deadlines & reminders (via node-cron)    
- **Category Management:** 
   - System categories (e.g., Work, Personal) seeded automatically 
   - User categories for custom organization

---


## 🛠 Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB, Mongoose  
- **Authentication:** JWT, bcrypt, crypto  
- **Token Management:** Cookie based  
- **Validation:** Express-Validator  
- **Email Integration:** Nodemailer / SendGrid  
- **Environment Management:** dotenv  

---

## 📂 Project Structure  
```bash
Todo-API/
│── controllers/ # Route controllers
│ ├── adminController.js
│ ├── authController.js
│ ├── categoryController.js
│ ├── taskController.js
│ └── userController.js
│
|│── lib/ # Database connections
| ├── cloudinary.js
│ └── mongodb.js

│── middlewares/ # Middlewares
│ ├── adminMiddleware.js
│ ├── authMiddleware.js
| ├── multer.js
| └── rateLimiter.js
│
│── models/ # Mongoose schemas
│ ├── categorySchema.js
│ ├── taskSchema.js
│ └── userSchema.js
│
│── routes/ # API routes
| ├── adminRoutes.js
│ ├── authRoutes.js
│ ├── categoryRoutes.js
│ ├── taskRoutes.js
│ └── userRoutes.js
|
│── scripts/ # Admin creation
│ └── createAdmin.js│
|
│── services/ # External services
│ ├── emailService.js
│ └── taskService.js
│
│── utils/ # Helpers 
│ └── tokenManagement.js
│
│── .env # Environment variables
│── package-lock.json
|── package.json
│── server.js # App entry point

```

---

## 🚀 Getting Started

Follow these steps to get the project running locally.

### 1. Prerequisites

- Node.js[view](https://nodejs.org/en/) v18.17+  
- npm 
- MongoDB Atlas or Compass

### 2. Installation

# Clone the repo
```bash
git clone https://github.com/NecheRose/Todo-API.git
cd Todo-API
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
   SENDGRID_API_KEY
   EMAIL_USER=your_email

   # Cloudinary setup
   CLOUDINARY_CLOUD_NAME
   CLOUDINARY_API_KEY
   CLOUDINARY_API_SECRET

   ```

### 4. Start development server
   ```bash
   npm run dev
   ```

# 🛠️ Admin Creation Script  

This script allows testers to create a **Admin** account in the database for accessing admin endpoints. Each tester can create their own account with their email, password, and username.  

## 📂 File Location  
The script is located at:  

```
scripts/createAdmin.js
```

### ⚡ How to Run  

### 1. Directly with Node  
From your project root, run on the terminal:  

```bash
node scripts/createAdmin.js "Your username" your.email@example.com YourPassword123
```
Example:
```
node scripts/createAdmin.js "Nechekay" rose@gmail.com neche222
```

### 2. Using NPM Script (Optional)
Add this to your package.json under "scripts":

```
"scripts": {
  "create-admin": "node scripts/createAdmin.js"
}
```

Now you can run: 
```bash
npm run create-admin -- "Your username" your.email@example.com YourPassword123
```
  

## 📖 API Documentation

The Todo-API is fully documented with Postman for easy testing and collaboration.  
Explore endpoints inside the Todo-API Workspace for request/response samples.

### Collections Included
- **Admin APIs** – Manage users and activities.
- **Auth APIs** – Register, login, logout, email verification, password reset, etc.  
- **Category APIs** – Create, update and delete categories.   
- **Task APIs** – Create, edit, delete tasks, mark task as complete, etc.  
- **User APIs** – Profile management, update, password change, account deletion. 


### Postman Links
- **Admin APIs** - [view](https://www.postman.com/necherose/workspace/todo-api/collection/45016489-d6693964-35b7-49bd-84cc-d76d6bef31d4?action=share&creator=45016489&active-environment=45016489-290624d7-dbd7-494d-a61b-060eac0bc7e0)
- **Auth APIs** - [view](https://www.postman.com/necherose/workspace/todo-api/collection/45016489-9e7a4225-9b13-4bd4-85ab-fab7454bc379?action=share&creator=45016489&active-environment=45016489-290624d7-dbd7-494d-a61b-060eac0bc7e0)
- **Category APIs** - [view](https://www.postman.com/necherose/workspace/todo-api/collection/45016489-32a7eb01-62db-43b0-bf2c-f6cc1f93e536?action=share&creator=45016489&active-environment=45016489-290624d7-dbd7-494d-a61b-060eac0bc7e0)
- **Task APIs** - [view](https://www.postman.com/necherose/workspace/todo-api/collection/45016489-4c9a411e-eab8-48fc-b163-f7287cc68828?action=share&creator=45016489&active-environment=45016489-290624d7-dbd7-494d-a61b-060eac0bc7e0)
- **User APIs** - [view](https://www.postman.com/necherose/workspace/todo-api/collection/45016489-69c32b03-efe5-4665-b80f-3e0ba6deb1b2?action=share&creator=45016489&active-environment=45016489-290624d7-dbd7-494d-a61b-060eac0bc7e0)


Each endpoint includes:
- Request method & URL  
- Required headers & parameters  
- Example request/response  
- Authentication details (if required)  

## License

No License yet

