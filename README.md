
# 🚀 SparkRaise - Crowdfunding Platform

<p align="center">
  <img src="./public/screenshot.png" alt="SparkRaise Screenshot" width="100%">
</p>

> **SparkRaise** is a modern MERN Stack crowdfunding platform where creators can launch fundraising campaigns, supporters can contribute using platform credits, and administrators manage the entire platform through a secure role-based dashboard.

---

## 🌐 Live Links

- **Live Website:** https://spark-client-ochre.vercel.app/
- **Client Repository:** https://github.com/JubairAhammedJubu/B13-A11-SparkRaise-Client-by-Jubair
- **Server Repository:** https://github.com/JubairAhammedJubu/B13-A11-SparkRaise-Server-by-Jubair
---

# 🔐 Admin Credentials

| Email | Password |
|--------|----------|
| Jubair34@gmail.com | Jubair34 |

---

# 📖 Project Overview

SparkRaise is a full-stack crowdfunding platform inspired by Kickstarter and GoFundMe. It allows **Creators** to launch fundraising campaigns, **Supporters** to purchase credits and support campaigns, and **Admins** to monitor users, approve campaigns, process withdrawals, and manage reports.

The platform features secure authentication, role-based authorization, Stripe payment integration, campaign approval workflow, notifications, responsive dashboard, and a complete credit-based crowdfunding ecosystem.

---

# 📸 Project Screenshot

> Replace this image with your own screenshot after deployment.

```
public/
└── screenshot.png
```

or

```md
![SparkRaise Screenshot](https://your-image-link.com/screenshot.png)
```

---

# 🛠️ Main Technologies Used

### Frontend

- React.js
- React Router DOM
- Tailwind CSS
- DaisyUI
- Firebase Authentication
- Axios
- React Hook Form
- TanStack React Query
- Swiper Slider
- Framer Motion
- React Icons
- SweetAlert2
- React Hot Toast

### Backend

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Stripe Payment Gateway
- CORS
- Dotenv
- Cookie Parser

### Database

- MongoDB Atlas

### Deployment

- Vercel
- Render (or Railway)

---

# ✨ Core Features

### ✅ 1. Role-Based Authentication
Supports three user roles:
- Supporter
- Creator
- Admin

---

### ✅ 2. Secure Login System

- Email & Password Login
- Google Sign-In
- JWT Authentication
- Protected Routes
- Persistent Login

---

### ✅ 3. Credit-Based Crowdfunding

Supporters purchase credits and contribute them to campaigns instead of direct cash payments.

---

### ✅ 4. Campaign Approval Workflow

Creators submit campaigns which remain pending until approved by an administrator.

---

### ✅ 5. Contribution Management

Creators can:

- Approve contributions
- Reject contributions
- Automatically refund credits on rejection

---

### ✅ 6. Stripe Credit Purchase

Supporters can purchase credit packages using Stripe payment integration with automatic credit updates.

---

### ✅ 7. Withdrawal System

Creators can request withdrawals after reaching the minimum credit threshold, and admins process withdrawal requests.

---

### ✅ 8. Real-Time Notification System

Users receive notifications for:

- Campaign approval/rejection
- Contribution approval/rejection
- Withdrawal approval
- New contributions

---

### ✅ 9. Responsive Dashboard

Separate dashboards for:

- Supporters
- Creators
- Administrators

Fully responsive across mobile, tablet, and desktop devices.

---

### ✅ 10. Admin Control Panel

Administrators can:

- Manage users
- Update user roles
- Approve campaigns
- Process withdrawals
- Remove campaigns
- Handle reports
- Monitor platform statistics

---

# 📦 NPM Dependencies

## Client

```json
react
react-router-dom
firebase
axios
@tanstack/react-query
react-hook-form
swiper
framer-motion
react-icons
sweetalert2
react-hot-toast
react-datepicker
lottie-react
tailwindcss
daisyui
```

## Server

```json
express
mongodb
cors
dotenv
jsonwebtoken
cookie-parser
stripe
bcryptjs
```

---

# 💻 Run the Project Locally

## 1. Clone the repositories

```bash
git clone https://github.com/JubairAhammedJubu/B13-A11-SparkRaise-Client-by-Jubair

git clone https://github.com/JubairAhammedJubu/B13-A11-SparkRaise-Server-by-Jubair
```

---

## 2. Install dependencies

### Client

```bash
cd B13-A11-SparkRaise-Client-by-Jubair

npm install
```

### Server

```bash
cd B13-A11-SparkRaise-Server-by-Jubair

npm install
```

---

## 3. Configure Environment Variables

Create `.env` files in both the client and server directories and add the required credentials.

---

## 4. Run the backend

```bash
nodemon index.js
```

Backend runs on:

```
http://localhost:8000
```

---

## 5. Run the frontend

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:3000
```

---

# 🔒 Security Features

- JWT Authentication
- Role-Based Authorization
- Protected Dashboard Routes
- Environment Variables
- Secure Password Authentication
- Firebase Authentication
- MongoDB Data Validation
- CORS Protection

---

# 🚀 Future Improvements

- Email Notifications (SendGrid)
- Campaign Search & Filtering
- Advanced Analytics Dashboard
- Campaign Comments
- Bookmark Campaigns
- Dark Mode
- Multi-language Support
- Campaign Categories
- Admin Activity Logs

---

# 👨‍💻 Developer

**Project Name:** SparkRaise

Jubair Ahammed Developed as a **MERN Stack Crowdfunding Platform** showcasing secure authentication, role-based authorization, Stripe payment integration, campaign management, notifications, and responsive dashboard design.

---

## ⭐ Thank You

If you found this project helpful, consider giving the repositories a ⭐ on GitHub.
