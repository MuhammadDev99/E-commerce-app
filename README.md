# SparkyShop - Full Stack E-Commerce Platform

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

**[View Live Demo](https://muhammad.developer.li/E-commerce-app/)** | **[Report Bug](https://github.com/MuhammadDev99/E-commerce-app/issues)**

## 📖 Overview

SparkyShop is a full-stack e-commerce application built to demonstrate modern web architecture, type safety, and secure state management. Unlike typical tutorial clones, this project focuses on enterprise-level patterns, including HTTP-Only cookie authentication, fine-grained reactivity using Preact Signals, and a robust TypeScript backend.

The goal was to build a scalable frontend that interacts seamlessly with a RESTful Node.js API and a relational PostgreSQL database.

---

## 📸 Screenshots

### Home & Product Discovery
![Home Page Screenshot](https://github.com/MuhammadDev99/E-commerce-app/blob/main/readme_files/products_video.gif)
*Features a responsive grid layout and featured product showcase.*

### Secure Dashboard
![Dashboard Screenshot](https://github.com/MuhammadDev99/E-commerce-app/blob/main/readme_files/dashboard.png?raw=true)
*User profile management protected by JWT authentication.*

---

## 🧪 Try the Demo

You can explore the application without registering by using these guest credentials:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Guest User** | `recruiter@demo.com` | `demo123` |

> **Note:** The application is hosted on a private server. Please allow a moment for the initial handshake.

---

## 🛠 Tech Stack

### Frontend
*   **Framework:** React (Vite)
*   **Language:** TypeScript (Strict Mode)
*   **State Management:** @preact/signals-react (Chosen for high-performance, fine-grained updates without excessive re-renders)
*   **Styling:** CSS Modules (Scoped styling to prevent leakage)
*   **Routing:** React Router v6

### Backend
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** PostgreSQL (via `pg` pool)
*   **Authentication:** JWT (JSON Web Tokens) stored in **HTTP-Only Cookies**
*   **Security:** bcrypt (password hashing), CORS configuration, CSRF protection

---

## 💡 Key Architectural Decisions

### 1. Preact Signals vs. Context API
Instead of using React Context or Redux, I implemented **Preact Signals**. This allows the Shopping Cart state to update globally without triggering re-renders in unrelated components (like the Footer or Sidebar). This results in significant performance gains as the application scales.

### 2. Security First (HTTP-Only Cookies)
Many React apps store JWTs in `localStorage`, which is vulnerable to XSS attacks. SparkyShop stores authentication tokens in `HTTP-Only` cookies. This means client-side JavaScript cannot read the token, significantly reducing the attack surface.

### 3. Generic API Client
I built a strictly typed `apiClient` wrapper. Instead of repeating `fetch` logic, the wrapper handles:
*   Automatic injection of credentials.
*   Standardized error parsing.
*   Generic Type return values (e.g., `apiClient<User>`), ensuring the frontend always knows the shape of the data it consumes.

---

## 🚀 Running Locally

Follow these steps to get a copy of the project up and running on your local machine.

### Prerequisites
*   Node.js (v16+)
*   PostgreSQL

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/MuhammadDev99/E-commerce-app.git
    cd E-commerce-app
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Database Setup**
    *   Ensure PostgreSQL is running.
    *   Create a database named `sparkyshop`.
    *   Run the initialization script (check `/database` or root folder for SQL files).

4.  **Environment Variables**
    Create a `.env` file in the root directory:
    ```env
    PORT=3333
    DATABASE_URL=postgresql://user:password@localhost:5432/sparkyshop
    JWT_SECRET=your_super_secret_key
    NODE_ENV=development
    ```

5.  **Start the Development Server**
    ```bash
    npm run dev
    ```

---

## 🔮 Future Improvements

*   **Server-Side Pagination:** Currently, product filtering happens client-side. Moving this to the backend will improve performance for large datasets.
*   **Payment Integration:** Integrate Stripe API for actual payment processing.
*   **Unit Testing:** Add Jest/React Testing Library coverage for critical components.

---

## 📬 Contact

**Muhammad**  
Full Stack Developer  

Project Link: [https://github.com/MuhammadDev99/E-commerce-app](https://github.com/MuhammadDev99/E-commerce-app)