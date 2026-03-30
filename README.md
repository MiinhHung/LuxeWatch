# ⌚ LuxeWatch - Luxury Watch E-commerce Platform

![LuxeWatch Banner](https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=2000&h=600)

LuxeWatch is a modern, full-stack e-commerce web application designed for selling luxury watches. It provides a seamless shopping experience with a robust backend, responsive frontend, and secure payment integration.

---

## ✨ Key Features

- **User Authentication & Authorization**: Secure login and registration using JWT (JSON Web Tokens) with role-based access control (Admin/User).
- **Product Management**: Browse, search, and filter a wide catalog of luxury watches.
- **Shopping Cart & Wishlist**: Easily add items to the cart or save them for later in the wishlist.
- **Secure Payments**: Integrated with **VNPay** for safe and reliable online transactions.
- **Order Management**: Users can track their order history, while admins can manage all orders across the platform.
- **Admin Dashboard**: Comprehensive dashboard for administrators to manage products, view user accounts, and update order statuses.
- **User Reviews**: Customers can leave ratings and reviews for products they have purchased.
- **Responsive Design**: Optimized for a flawless experience across all devices (desktop, tablet, and mobile).

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (via Vite)
- **Routing**: React Router DOM
- **State Management & Data Fetching**: React Hooks, Axios
- **UI Components**: Lucide React (Icons), React Toastify (Notifications)
- **Language**: TypeScript

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database ORM**: Prisma
- **Authentication**: JWT, bcryptjs
- **File Uploads**: Multer
- **Language**: TypeScript

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- Node.js (v18 or higher)
- A relational database (e.g., PostgreSQL or MySQL) supported by Prisma

### 1. Clone the repository
```bash
git clone https://github.com/MiinhHung/LuxeWatch.git
cd LuxeWatch
```

### 2. Backend Setup
Navigate to the backend directory:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
DATABASE_URL="your_database_connection_string"
JWT_SECRET="your_jwt_secret_key"

# VNPAY Configuration
VNP_TMN_CODE="your_vnpay_tmn_code"
VNP_HASH_SECRET="your_vnpay_hash_secret"
VNP_URL="https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
VNP_API="https://sandbox.vnpayment.vn/merchant_webapi/api/transaction"
VNP_RETURN_URL="http://localhost:5173/payment/result"
```

Run database migrations and start the server:
```bash
npx prisma generate
npx prisma db push
npm run dev
```

### 3. Frontend Setup
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
```

Start the development server:
```bash
npm run dev
```

The application will be running at `http://localhost:5173`.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/MiinhHung/LuxeWatch/issues).

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License.