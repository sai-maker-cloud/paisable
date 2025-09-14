# Paisable                                                                      

A **full-stack finance tracking application** built with **MERN stack (MongoDB, Express, React, Node.js)**. The app allows users to manage income, expenses, and receipts while providing authentication and reporting features.

---

## 🚀 Features

* **User Authentication** (Signup/Login with JWT)
* **Transactions Management**

  * Add income and expenses
  * Categorize transactions
  * View transaction history
* **Receipts Uploads**

  * Upload and manage receipt images (stored in backend `/uploads`)
* **Reports & Dashboard**

  * View summary of income vs. expenses
  * Filter by categories and time periods
* **Secure Backend APIs** with JWT-based authentication
* **Frontend with React Context** for Auth state management

---

## 🛠️ Tech Stack

### Frontend

* React + Vite
* React Router
* Axios
* Context API for Authentication

### Backend

* Node.js + Express
* MongoDB Atlas (Mongoose ODM)
* JWT Authentication
* Multer for file uploads

### Deployment

* **Frontend:** Netlify
* **Backend:** Render
* **Database:** MongoDB Atlas

---

## 📂 Project Structure

```bash
.
│── backend/
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── routes/
│   │   ├── authRoutes.js   # Auth endpoints
│   │   ├── transactionRoutes.js
│   │   └── receiptRoutes.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Transaction.js
│   │   └── Receipt.js
│   ├── uploads/            # Receipt image uploads
│   └── server.js           # Express server entry point
│
│── frontend/
│   ├── src/
│   │   ├── api/axios.js    # Axios instance
│   │   ├── contexts/       # AuthContext
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Dashboard, Transactions, Reports
│   │   ├── components/     # UI Components
│   │   └── main.jsx        # React entry point
│   └── vite.config.js
│
│── README.md               # Documentation (this file)
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/archa8/finance-tracker-typeface.git
cd finance-tracker-typeface
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create `.env` file inside `backend/`:

```env
PORT=5001
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
```

Start backend locally:

```bash
npm start
```

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Create `.env` file inside `frontend/`:

```env
VITE_API_URL=https://your-backend-service.onrender.com/api
```

Start frontend locally:

```bash
npm run dev
```

---

## 🌍 Deployment

### Deploy Backend on Render

1. Push code to GitHub
2. Create new **Web Service** in [Render](https://render.com)
3. Connect to repo → set root as `backend/`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `node server.js`
6. Add environment variables (`MONGO_URI`, `JWT_SECRET`)

### Deploy Frontend on Netlify

1. Go to [Netlify](https://netlify.com)
2. Connect GitHub repo → set root as `frontend/`
3. Set **Build Command**: `npm run build`
4. Set **Publish Directory**: `dist`
5. Add environment variable:

   ```env
   VITE_API_URL=https://your-backend.onrender.com/api
   ```

---

## 📖 API Documentation (OpenAPI Spec)

### Authentication

* **POST** `/api/auth/signup` → Create new user
* **POST** `/api/auth/login` → Login user, returns JWT
* **GET** `/api/auth/me` → Get logged-in user info

### Transactions

* **POST** `/api/transactions` → Add new transaction
* **GET** `/api/transactions` → Get all transactions
* **PUT** `/api/transactions/:id` → Update transaction
* **DELETE** `/api/transactions/:id` → Delete transaction

### Receipts

* **POST** `/api/receipts` → Upload a new receipt
* **GET** `/api/receipts` → Get all receipts
* **DELETE** `/api/receipts/:id` → Delete receipt

### Example Login Request

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "123456"
}
```

### Example Transaction Response

```json
{
  "_id": "64ab3c...",
  "name": "Groceries",
  "category": "Food",
  "cost": 120,
  "isIncome": false,
  "addedOn": "2025-09-10T12:00:00.000Z"
}
```

---

## 🔐 Environment Variables

Backend (`/backend/.env`):

```env
PORT=5001
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```

Frontend (`/frontend/.env`):

```env
VITE_API_URL=https://your-backend-service.onrender.com/api
```

---

## 🧪 Testing

Run backend tests:

```bash
cd backend
npm test
```

Run frontend tests:

```bash
cd frontend
npm test
```

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

* [Archa8](https://github.com/archa8)
