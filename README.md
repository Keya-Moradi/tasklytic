# Tasklytic

<p align="center">
  <img src="https://github.com/Keya-Moradi/tasklytic/blob/main/Public/images/TasklyticHome.png" alt="Tasklytic Home" width="200" height="200">
</p>

## Description

Tasklytic is a simple task management app where users can create, view, edit, delete, and manage their tasks. The app allows users to mark tasks as complete or incomplete, view pending and completed tasks separately, and offers an intuitive task management experience. This app was built to help users stay organized with their tasks, offering a seamless way to manage to-do items.

## Features

- User authentication (registration and login)
- Create, read, update, and delete tasks
- Mark tasks as complete or incomplete
- View all tasks, pending tasks, or completed tasks separately
- Responsive design for mobile and desktop
- Secure password hashing with bcrypt
- Form validation (client-side and server-side)
- Session management with MongoDB storage

## Live Demo

- [Deployed App on Heroku](https://tasklytic-05d2d8df9e4e.herokuapp.com/users/login)

- [Planning Materials](https://trello.com/b/u1LgmzUw/unit-2-project-tasklytic-to-do-list-app)

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 14 or higher)
- [MongoDB](https://www.mongodb.com/) (local installation or MongoDB Atlas account)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Keya-Moradi/tasklytic.git
   cd tasklytic
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory by copying the example file:
   ```bash
   cp .env.example .env
   ```

   Then edit the `.env` file with your own values:
   ```env
   MONGO_URI=mongodb://localhost:27017/tasklytic
   SESSION_SECRET=your_secret_key_here
   PORT=3000
   NODE_ENV=development
   ```

   **Important Notes:**
   - For `MONGO_URI`:
     - **Local MongoDB**: Use `mongodb://localhost:27017/tasklytic`
     - **MongoDB Atlas**: Get your connection string from your Atlas dashboard
   - For `SESSION_SECRET`: Generate a secure random string. You can use:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```

4. **Set up MongoDB**

   **Option A: Local MongoDB**
   - Install MongoDB from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Start MongoDB service:
     ```bash
     # macOS (using Homebrew)
     brew services start mongodb-community

     # Linux
     sudo systemctl start mongod

     # Windows
     net start MongoDB
     ```

   **Option B: MongoDB Atlas (Cloud)**
   - Create a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Click "Connect" and choose "Connect your application"
   - Copy the connection string and paste it into your `.env` file as `MONGO_URI`
   - Replace `<password>` with your database user password
   - Replace `myFirstDatabase` with `tasklytic`

5. **Run the application**
   ```bash
   npm start
   ```

6. **Access the app**

   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### First Time Setup

1. Navigate to `http://localhost:3000/users/register`
2. Create a new account with:
   - Name (2-50 characters)
   - Valid email address
   - Password (minimum 8 characters with at least one uppercase, one lowercase, and one number)
3. Log in with your credentials
4. Start creating tasks!

## Usage

### Creating a Task
1. Click "Add New Task" in the navigation
2. Fill in the task details:
   - Title (required, max 200 characters)
   - Description (optional, max 1000 characters)
   - Due Date (required)
3. Click "Create Task"

### Managing Tasks
- **View All Tasks**: Click "All Tasks" to see all your tasks
- **View Pending**: Click "Pending Tasks" to see incomplete tasks
- **View Completed**: Click "Completed Tasks" to see finished tasks
- **Mark Complete/Incomplete**: Check or uncheck the checkbox next to any task
- **Edit Task**: Click "Edit Task" to modify task details
- **Delete Task**: Click "Delete Task" (you'll be asked to confirm)

## Project Structure

```
tasklytic/
├── config/
│   └── passport.js          # Passport authentication configuration
├── controllers/
│   ├── tasksController.js   # Task CRUD operations
│   └── usersController.js   # User authentication logic
├── models/
│   ├── task.js              # Task schema
│   └── user.js              # User schema
├── public/
│   ├── css/
│   │   └── styles.css       # Application styles
│   └── images/              # Static images
├── routes/
│   ├── index.js             # Home routes
│   ├── tasks.js             # Task routes
│   └── users.js             # User routes
├── views/
│   ├── tasks/               # Task-related views
│   ├── users/               # User-related views
│   └── index.ejs            # Home page
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore file
├── package.json             # Project dependencies
├── server.js                # Application entry point
└── README.md                # This file
```

## Attributions

- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Passport.js](http://www.passportjs.org/)

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- Passport.js (for authentication)
- EJS (templating engine)
- CSS (for styling)

### Attribution

This project also uses third-party libraries and tools. Special thanks to the following:

- [Express.js](https://expressjs.com/): The web framework used to build the server.
- [Mongoose](https://mongoosejs.com/): For object modeling and managing MongoDB data.
- [Passport.js](http://www.passportjs.org/docs/): For authentication strategies, specifically [Passport-local](http://www.passportjs.org/packages/passport-local/).
- [bcrypt.js](https://www.npmjs.com/package/bcryptjs): For securely hashing passwords.
- [connect-flash](https://github.com/jaredhanson/connect-flash): For flash messages.
- [connect-mongo](https://www.npmjs.com/package/connect-mongo): For MongoDB session storage.
- [Body Parser](https://www.npmjs.com/package/body-parser): For parsing incoming request bodies in Express.

For more information on these tools, visit their respective documentation pages.

## Next Steps

- Implement user-friendly CSS for a more polished and responsive UI.
- Add task prioritization features (high, medium, low).
- Enable task reminders via email or notifications.
- Integrate OAuth for social media login options.
