# HireLyn Backend

HireLyn is a RESTful backend API for a job recruitment platform. It supports job seekers, recruiters, job management, job applications, authentication, authorization, search, filtering, and application status management.

## 🚀 Features

### 🔐 Authentication

- User registration
- User login
- JWT authentication
- Get current logged-in user
- Password hashing with bcrypt
- Email validation
- Role-based access control

### 👥 User Roles

- Job Seeker
- Recruiter

### 💼 Job Management

#### Recruiters can:

- Create jobs
- View their own jobs
- Update jobs
- Delete jobs
- Open/close jobs
- View applications for their jobs

#### Public users can:

- View all open jobs
- View individual jobs
- Search jobs
- Filter by location
- Filter by job type
- Filter by salary
- Paginate job results
- Sort job results

### 📄 Applications

#### Job seekers can:

- Apply for jobs
- Submit a resume URL
- Submit a cover letter
- View their applications

#### Recruiters can:

- View applications for their jobs
- Update application status

Supported application statuses:

- `pending`
- `shortlisted`
- `rejected`
- `accepted`

### 🛡️ Validation & Security

- JWT authentication
- Role-based authorization
- MongoDB ObjectId validation
- Request validation
- Duplicate application protection
- Closed-job application protection
- Centralized error handling
- 404 route handling
- JSON request size limit
- Environment variable protection

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- CORS
- dotenv
- Postman

## 📁 Project Structure

```text
hirelyn-backend/
├── config/
│   └── db.js
├── controllers/
│   ├── applicationController.js
│   ├── authController.js
│   └── jobController.js
├── middleware/
│   ├── authMiddleware.js
│   ├── authValidation.js
│   ├── errorMiddleware.js
│   ├── jobValidation.js
│   ├── roleMiddleware.js
│   └── validateObjectId.js
├── models/
│   ├── Application.js
│   ├── Job.js
│   └── User.js
├── routes/
│   ├── applicationRoutes.js
│   ├── authRoutes.js
│   └── jobRoutes.js
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
