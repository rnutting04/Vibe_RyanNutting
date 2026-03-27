# 🏦 Bank Web Application

A full-stack banking application built with React (frontend) and Flask (backend), using MongoDB Atlas for data storage. The app allows users to create accounts, deposit and withdraw funds, and view account details through a web interface.

---

## 🚀 Features

- Create new bank accounts  
- View all accounts  
- Deposit money  
- Withdraw money  
- MongoDB Atlas for persistent storage  
- React frontend with Flask API backend  

---

## 🏗️ Tech Stack

Frontend:
- React (Vite)
- TypeScript

Backend:
- Flask
- Flask-CORS
- Flask-JWT-Extended
- Gunicorn

Database:
- MongoDB Atlas

Deployment:
- AWS

---

## 📁 Project Structure

project/
├── frontend/
│   └── banking-service/
│       ├── src/
│       ├── package.json
│
├── backend/
│   ├── app.py
│   ├── requirements.txt

---

## ⚙️ Local Setup

### Backend

cd backend  
python3 -m venv venv  
source venv/bin/activate   (Mac/Linux)  
venv\Scripts\activate      (Windows)  

pip install -r requirements.txt  

Create a `.env` file in backend:

MONGO_URI=your_mongodb_connection_string  
JWT_SECRET_KEY=your_secret_key  
DB_NAME=your_db_name
Run backend:

python app.py  

---

### Frontend

cd frontend/banking-service  
npm install  
npm run dev  
---

## 🌐 Some API Endpoints

POST /api/accounts → Create account  
GET /api/accounts → Get all accounts  
POST /api/accounts/:id/deposit → Deposit money  
POST /api/accounts/:id/withdraw → Withdraw money  

---

## 👨‍💻 Author

Ryan Nutting  