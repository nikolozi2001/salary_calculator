# Salary Calculator

A full-stack application for managing employee salaries with a Vite React frontend using TailwindCSS and a Node.js Express backend with MySQL.

## 📋 Project Overview

This application helps organizations manage employee data, calculate salaries, and generate reports. It features a modern, responsive interface built with React and Tailwind CSS, with a robust Node.js backend and MySQL database.

## 🚀 Features

- Employee information management
- Salary calculation based on various parameters
- Region-based data organization
- User-friendly, responsive interface
- RESTful API for data operations

## 🏗️ Project Structure

```
salary_calculator/
├── frontend/             # React frontend with Vite and TailwindCSS
│   ├── public/           # Static assets served directly
│   └── src/
│       ├── components/   # Reusable React components
│       ├── services/     # API service functions
│       └── assets/       # Static assets imported in components
└── backend/              # Node.js Express backend
    ├── routes/           # API route handlers
    └── database.sql      # MySQL database schema
```

## 🔧 Prerequisites

- Node.js (v14+)
- MySQL database server
- MySQL Workbench (for database administration)
- Git

## 💻 Setup Instructions

### Database Setup

1. Open MySQL Workbench and connect to your local MySQL server
2. Run the SQL commands in `backend/database.sql` to create the database and tables

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the `.env.example`:
   ```
   cp .env.example .env
   ```

4. Configure the database connection in the `.env` file:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_DATABASE=salary_calculator
   ```

5. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to the URL displayed in your terminal (usually http://localhost:5173)

## 🚥 API Endpoints

### Regions

- `GET /api/regions` - Get all regions
- `GET /api/regions/:id` - Get region by ID
- `GET /api/regions/byregion/:regionId` - Get regions by region ID

## 🔌 Database Connection

The application connects to a MySQL database with the following default configuration:
- Host: localhost
- Port: 3306
- Database: salary_calculator
- User: root

You can override these settings by updating the `.env` file in the backend directory.

## 🧪 Running Tests

*Coming soon*

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.