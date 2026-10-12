# Hospital Management System (HMS) - Comprehensive MEARN Development Guide

An enterprise-grade, web-based **Hospital Management System (HMS)** designed to streamline and automate clinical, administrative, and financial operations within a modern healthcare facility, built using the **MEARN stack** with a **MySQL** database.

## 👥 System Roles & Access Control

The platform provides role-based access control (RBAC) to ensure secure and efficient operations across different departments:

1. **Admin:** System-wide configuration, user role management, policy enforcement, and audit logs.
2. **Doctor:** Patient consultations, electronic medical records (EMR) review, prescription generation, and appointment scheduling.
3. **Nurse:** Patient check-in/check-out, bed allocation, vitals tracking, and daily nursing care notes.
4. **Patient:** Online appointment booking, viewing personal medical records, lab reports, and settling billing invoices.
5. **Pharmacist:** Pharmacy inventory control, prescription dispensing, stock tracking, and low-stock alerts.
6. **Laboratories:** Laboratory and pathology test automation, sample tracking, and result reporting.
7. **Accountant:** Financial operations, billing, invoicing, expense tracking, revenue management, budgeting, and claims processing.

## 🚀 Tech Stack & Architecture (MEARN + MySQL)

* **Architecture:** Client-Server Single Page Application (SPA) / RESTful Web Architecture.
* **Frontend:** React.js / Angular (User Interface & Dashboards)
* **Backend:** Node.js & Express.js (REST APIs & Business Logic)
* **Database:** **MySQL** (Relational database managed via WampServer / phpMyAdmin)
* **Local Development Environment:** **WampServer** (for hosting MySQL database and local server testing)

## ✨ Comprehensive Features & Modules

### Clinical & Patient Management
* **Patient Check In / Check Out:** Manage admissions, transfers, and discharges efficiently.
* **Appointment Management:** Real-time scheduling for Out-Patient Department (OPD) and consultations.
* **In-Patient & Out-Patient Management:** Comprehensive tracking of IPD and OPD patient lifecycles.
* **Bed Management:** Ward and bed status monitoring (Occupied vs. Available).
* **Patient Records Management:** Secure, long-term maintenance of patient medical history.
* **Physician Management:** Managing doctor profiles, specialties, and consultation hours.
* **Doctor Consultant Module:** Facilitating expert consultations and inter-departmental referrals.
* **Database of Blood Donors / Blood Group:** Blood bank registry categorizing donors by blood groups.

### Laboratory & Pharmacy Automation
* **Laboratory / Pathology Automation:** Direct test requests, digital sample processing, and automated result generation.
* **Medicine & Inventory Management:** Tracking stock levels, unit pricing, and medication expiration dates.

### Financial & Administrative Management
* **Billing & Invoicing System:** Automated calculations for consultations, room charges, pharmacy, and lab tests.
* **Accounting Management:** Comprehensive general ledger and financial accounting ledger.
* **Revenue Management & Expense Tracking:** Real-time dashboards monitoring hospital cash flows and expenditures.
* **Budgeting & Forecasting:** Tools for annual/monthly financial planning and predictive analytics.
* **Claims Management:** Processing insurance claims and third-party payer integrations.
* **Human Resource Management (HRM):** Staff attendance, shift scheduling, and employee records maintenance.
* **Policy Management:** Central repository for hospital clinical and administrative bylaws and protocols.
* **Reports (Death and Birth Reports):** Official statutory documentation and statistical report generation.

## ⚙️ Installation & Development Guide (MEARN + WampServer)

Follow these steps to set up and run the MEARN stack application locally:

### 1. Database Setup (MySQL via WampServer)
* Download and install [WampServer](https://www.wampserver.com/) and start all services (Apache & MySQL).
* Open your browser and navigate to `http://localhost/phpmyadmin`.
* Create a new database named `hospital_db` and import/execute the SQL schemas for `users`, `patients`, `doctors`, `appointments`, `medicines`, and `bills`.

### 2. Backend Setup (Node.js, Express & MySQL)
* Start MySQL in WampServer, then open a terminal in `server/`.
* Install dependencies and create local environment settings:
  ```bash
  npm install
  Copy-Item .env.example .env
  ```
* Edit `.env` with your MySQL credentials, a unique `JWT_SECRET`, and (for local development only) `ALLOW_DEMO_ACCESS=true`.
* Create the `hospital_db` schema and sample records:
  ```bash
  npm run db:setup
  ```
* Set `ADMIN_NAME`, `ADMIN_EMAIL`, and a password of at least 12 characters in `.env`, then create the first administrator:
  ```bash
  npm run admin:create
  ```
* Start the REST API:
  ```bash
  npm start
  ```
* The API listens at `http://localhost:5000`. `GET /api/health` reports API/MySQL readiness; versioned endpoints are under `/api/v1` (login at `POST /api/v1/auth/login`, current account at `GET /api/v1/auth/me`, and hospital resources such as `/patients`, `/appointments`, `/doctors`, `/beds`, `/laboratory`, `/pharmacy`, `/billing`, `/staff`, `/reports`, `/admissions`, `/donors`, `/prescriptions`, `/ledger`, `/claims`, and `/policies`). Resource endpoints support paginated listing/search, create, and update; access is role-restricted. The local demo-access option is disabled automatically in production.

### 3. Frontend Setup (React / Angular)
* Navigate to the `client/` directory in your terminal.
* Install dependencies and start the development server:
  ```bash
  npm install
  npm start
  ```
* The React frontend runs at `http://localhost:3000` and proxies `/api` requests to the backend. Core patient, appointment, doctor, ward, laboratory, pharmacy, billing, staff, and report lists load from MySQL when the API is healthy. If the API or MySQL is unavailable, the interface falls back to sample data; demo-mode changes are held in browser memory and reset on refresh.
* To create a production build, run `npm run build` from the `client/` directory.

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.