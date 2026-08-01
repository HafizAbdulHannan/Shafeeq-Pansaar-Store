# 🛒 Shafeeq Pansaar Store

<p align="center">
  <img src="https://img.shields.io/badge/MERN_Stack-5aa32a?style=for-the-badge&logo=Node.js&logoColor=white" alt="MERN Stack">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
</p>

> **A premium, high-performance, and fully responsive e-commerce web application built on the MERN stack.** 
> Shafeeq Pansaar Store brings the traditional trust of a local 'Pansaar' directly to the digital era, delivering an ultra-smooth online shopping experience for organic goods, household essentials, and spices.

---

## ✨ Key Features

### 🛍️ Customer Experience (Storefront)
- **Responsive UI/UX:** A stunning, modern, and mobile-first design leveraging glassmorphism, dynamic animations, and dark mode toggles.
- **Dynamic Cart System:** Real-time cart updates with interactive sidebars and persistent state.
- **Advanced Checkout Flow:** A meticulously designed checkout system inspired by Foodpanda, allowing users to select delivery locations, add custom addresses, and seamlessly process payments (including screenshot uploads for Bank/JazzCash transfers).
- **Order Tracking:** A "My Orders" modal allowing users to track their pending and completed orders with a single click.
- **MPIN Simulation:** A highly secure and interactive MPIN payment authorization interface.

### 🛡️ Admin Dashboard (Command Center)
- **Real-Time Analytics:** Track Total Earnings, Total Orders, Delivered Orders, and User count instantly.
- **Order Management:** View rich transaction details (Name, TID, Amount, Uploaded Receipts) and verify payments. 
- **Product Management:** Add, edit, delete, and toggle "Sold Out" status of products in real-time.
- **Feedback & Q&A:** Monitor user feedback ratings and direct questions straight from the dashboard.
- **Store Controls:** Toggle Store Open/Close status globally to pause new orders when needed.
- **Data Reset:** Dedicated tools to selectively reset earnings or completely wipe order history with a single click.

---

## 🛠️ Tech Stack

### Frontend
- **Languages:** HTML5, Vanilla JavaScript, CSS3
- **Styling:** Custom CSS with CSS Variables, Flexbox, CSS Grid, and responsive Media Queries.
- **Icons & Fonts:** FontAwesome 6, Google Fonts (Outfit).

### Backend
- **Framework:** Node.js with Express.js
- **Database:** MongoDB & Mongoose ORM
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs for secure password hashing.
- **File Uploads:** Multer (for handling payment receipt screenshots).
- **CORS:** Secure cross-origin resource sharing.

---

## 🚀 Installation & Setup

Follow these instructions to get the project up and running on your local machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas URL)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/HafizAbdulHannan/Shafeeq-Pansaar-Store.git
cd Shafeeq-Pansaar-Store
```

### 2. Backend Setup
Navigate to the `Backend` directory and install dependencies:
```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` folder and add the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/shafeeq_store
JWT_SECRET=your_super_secret_jwt_key
```

### 3. Run the Backend Server
```bash
# In the Backend directory
npm start
```
*The server will start running on `http://localhost:5000`.*

### 4. Frontend Setup
The frontend is built with pure Vanilla HTML/CSS/JS, so no build tools are required! 
Simply open `Frontend/Intro.html` or `Frontend/Home.html` in your favorite web browser or use an extension like **Live Server** in VS Code.

---

## 📱 Mobile Responsiveness

The entire application—from the storefront navigation and product grids to the complex admin panel data tables—is heavily optimized for mobile devices (iOS & Android). Media queries strictly manage layout shifts, ensuring 100% viewport utilization and zero horizontal overflow on screens as small as 320px.

---

## 👨‍💻 Author

Developed with ❤️ by **Hafiz Abdul Hannan**.

- **GitHub:** [HafizAbdulHannan](https://github.com/HafizAbdulHannan)
- **Instagram:** [@itx._.me._.hannan](https://www.instagram.com/itx._.me._.hannan)

---

<p align="center">
  <i>If you find this project useful or interesting, don't forget to star ⭐ the repository!</i>
</p>
