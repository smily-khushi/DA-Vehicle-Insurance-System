# SafeDrive - Project Documentation

Welcome to the **SafeDrive Vehicle Insurance System** documentation. This document provides a high-level overview of the application's pages and technical architecture.

---

## 🖥️ Frontend Overview (User-Facing)

### 1. Home (`Home.jsx`)
*   **Purpose**: The landing page of the application.
*   **Features**: Displays a hero section, insurance plans (Basic, Standard, Premium), and highlights benefits. It serves as the primary entry point for new users.

### 2. Dashboard (`Dashboard.jsx`)
*   **Purpose**: A personalized portal for logged-in users.
*   **Features**: 
    *   **Profile Management**: View and edit user details (Full Name, Password).
    *   **Active Protection**: Shows the user's primary policy and vehicle details.
    *   **Claim History**: Lists all previous claims with their current status (Pending, Approved, Rejected).

### 3. Vehicle Insurance (`VehicleInsurance.jsx`)
*   **Purpose**: The core engine for getting quotes and filing claims.
*   **Features**:
    *   **Pricing Engine**: Allows users to enter registration numbers for Cars/Bikes to view insurance prices.
    *   **Multi-Step Claim Process**: A guided 3-step form to file a claim, including policy info, incident details, and document/image uploads.

### 4. Authentication (`Login.jsx`)
*   **Purpose**: Centralized login for both Users and Administrators.
*   **Features**: Secure entry point that directs users to their respective dashboards based on their roles.

---

## 🛠️ Admin Panel (Management)

### 1. Admin Dashboard (`AdminDashboard.jsx`)
*   **Purpose**: Control center for system administrators.
*   **Features**: Overall system stats and a **Maintenance Mode** toggle to temporarily restrict user access during updates.

### 2. Claims Management (`AdminClaimsList.jsx` & `AdminClaimDetails.jsx`)
*   **Purpose**: Review and process insurance claims.
*   **Features**: Admins can view all submitted claims, inspect uploaded documents (PDFs/Images), and update the status of any claim.

### 3. User & Policy Management
*   **AdminUsers**: Manage registered users.
*   **AdminPolicy**: Handle insurance policy configurations.

---

## 📦 Technical Dependencies & Why We Use Them

### Frontend (User Interface)
| Package | Reason for Installation |
| :--- | :--- |
| **React / React-DOM** | The foundation of our UI. It allows us to build a dynamic, fast, and component-based interface. |
| **React Router Dom** | Enables "Single Page Application" (SPA) behavior. It manages navigation between pages (Home -> Dashboard) without reloading the entire browser. |
| **Bootstrap / React-Bootstrap** | A CSS framework that ensures the site is responsive (looks good on mobile and desktop) and provides pre-designed components like buttons and modals. |
| **React Icons** | Provides high-quality, scalable icons (like cars, shields, and users) to make the UI intuitive and visually appealing. |

### Backend (Server & Database)
| Package | Reason for Installation |
| :--- | :--- |
| **Express** | The web server framework for Node.js. It handles incoming requests from the frontend and sends back data. |
| **Mongoose** | Connects the server to **MongoDB**. it defines the "schema" (structure) of our data, ensuring everything is organized correctly. |
| **CORS** | **Crucial.** Stands for *Cross-Origin Resource Sharing*. It allows our Frontend (port 5173) to securely talk to our Backend (port 5000). Without this, the browser would block all API calls. |
| **Multer** | Handles **File Uploads**. This is what allows users to upload their PDFs and images when filing a claim. |
| **Bcryptjs** | **Security.** It hashes user passwords so they are never stored in plain text. This protects user data even if the database is compromised. |
| **Dotenv** | Keeps sensitive information (like database passwords and API keys) safe in a `.env` file rather than hardcoding them in the source code. |

---

## 🔄 How It All Works Together
1. **Frontend** captures user input (e.g., login details or claim forms).
2. **Axios/Fetch** sends this data to the **Express Backend**.
3. **CORS** validates the request.
4. **Mongoose** saves or retrieves data from **MongoDB**.
5. **Multer** saves any uploaded files to a secure storage folder (`Pdfs_Data`).
6. The Backend sends a response back to the Frontend, which updates the UI instantly using **React**.
