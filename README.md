# 📦 Smart Inventory Management System

## 🚀 Overview

A secure, role-based Smart Inventory Management System designed as a
SaaS-ready solution to help businesses track, manage, and analyze
inventory in real-time.

------------------------------------------------------------------------

## 🔥 Features

-   JWT Authentication (Login/Register)
-   Role-Based Access (Super Admin, Admin, Staff)
-   Product Management (Add, Edit, Delete)
-   Analytics Dashboard (Chart.js)
-   Activity Logs (Track user actions)
-   Low Stock Alerts
-   Auto Logout (Security)

------------------------------------------------------------------------

## 🛠️ Tech Stack

-   Frontend: HTML, TailwindCSS, JavaScript
-   Backend: Node.js, Express.js
-   Database: MongoDB (Local)
-   Authentication: JWT + bcrypt

------------------------------------------------------------------------

## 📁 Project Structure

inventory-system/ │── backend/ │ ├── models/ │ ├── routes/ │ ├──
middleware/ │ ├── server.js │ │── frontend/ │ ├── login.html │ ├──
dashboard.html │ │── README.md

------------------------------------------------------------------------

## ⚙️ Installation & Setup

### 1. Clone Repository

git clone https://github.com/your-username/inventory-system.git cd
inventory-system

### 2. Install Backend Dependencies

cd backend npm install

### 3. Start MongoDB (Local)

mongod

### 4. Run Backend Server

node server.js

Server runs at: http://localhost:5000

------------------------------------------------------------------------

## 🔐 API Endpoints

### Auth

-   POST /api/auth/register
-   POST /api/auth/login
-   POST /api/auth/create-user (Admin only)

### Products

-   GET /api/products
-   POST /api/products/add
-   PUT /api/products/update/:id
-   DELETE /api/products/delete/:id

### Logs

-   GET /api/logs

------------------------------------------------------------------------

## 👤 Roles Explained

Super Admin: Full access, logs, user control Admin: Manage products &
staff Staff: Limited access

------------------------------------------------------------------------

## 📊 System Highlights

-   Real-time inventory updates
-   Secure API with middleware protection
-   Clean and responsive UI
-   Scalable SaaS-ready architecture

------------------------------------------------------------------------

## 🚧 Future Improvements

-   AI-based stock prediction
-   Mobile application
-   Barcode scanning
-   Cloud deployment

------------------------------------------------------------------------

## 🏆 Author

Edwin Majau

------------------------------------------------------------------------

## 📜 License

This project is for academic and demonstration purposes.
