# CCAPDEV-Phase2-Group52
Task is to **develop the back-end portion** of selected web application.

### Deliverables
**zip file** containing **all files** for the machine project

## 🚀 Project Overview
Lab O' Mine is a computer laboratory reservation system for DLSU students and faculty. Built with an MVC architecture using Node.js, Express, Handlebars, and MongoDB, it replaces the previous localStorage prototype with a centralized database to ensure real-time data consistency across all users.

## 🛠️ Tech Stack & Design
- **Runtime:** Node.js
- **Framework:** Express.js
- **Template Engine:** express-handlebars
- **Database:** MongoDB (via Mongoose)
- **Session Management:** express-session
- **File Uploads:** multer
- **Frontend:** Bootstrap 5.3, jQuery 3.7.1, Bootstrap Icons

## 📋 Prerequisites
Ensure you have the following installed:
- Node.js (v18 or higher recommended)
- MongoDB (ensure the service is running locally on port 27017)

## 🚀 How to Run
### 1. Clone the repository to your local machine.
### 2. Install dependencies:
```bash
npm install
```
### 3. Start MongoDB: Make sure your local MongoDB instance is running.
### 4. Seed the Database: Run the data loader script to initialize users, labs, and sample reservations:
```bash
npm run seed
```
### 5. Start the Server:
```bash
npm start
```
### 6. Access the app: Open your browser and go to http://localhost:3000

## 🏗️ Architecture
MVC pattern with the following structure:
- `models/` — Mongoose schemas for User, Lab, and Reservation
- `controllers/` — Request handling logic (auth, profile, reservations, rooms, lab)
- `views/` — Handlebars templates for the UI
- `public/js/` — Client-side interactivity (rooms.js, profile.js, main.js)

## ✅ Implemented Features
- **User Account** — Register (student/faculty only), login with optional 3-week "Remember Me" session, logout
- **User Profile** — View own and others' public profiles, edit bio, upload profile photo, view reservation history
- **Slot Availability Dashboard** — Real-time seat grid across 5 computer labs, updates every 30 seconds, 7-day advance booking window
- **Reservation System** — Book specific seats in 1-hour minimum blocks (up to 2 hours), choose anonymous booking, edit or cancel reservations
- **Search & Filter** — Find available slots by lab, date, and optional time filter with scroll-to-time highlight
- **Technician Tools** — Walk-in booking for students, no-show cancellation within the first 10 minutes of a reservation, view all reservations including anonymous ones
- **Account Management** — Delete account with automatic cancellation of all pending reservations
- **Reservation Priority System** — Faculty reservations take priority over students; conflicting student bookings are automatically cancelled when a faculty member reserves the same seat and time

## 🔑 Demo Credentials
| Role | Email | Password |
| :--- | :--- | :--- |
| Technician (Admin) | admin@dlsu.edu.ph | admin |
| Faculty | oliver.berris@dlsu.edu.ph | 123 |
| Student | tara_uy@dlsu.edu.ph | 456 |
| Student | ram_liwanag@dlsu.edu.ph | 789 |
| Student | dale_balila@dlsu.edu.ph | abc |
| Student | john_teoxon@dlsu.edu.ph | def |

## 📁 Submission Guidelines
- **File Format:** CCAPDEV-Phase2-Group52.zip
- **Collaboration:** Students collaborated through the group's GitHub repository.

## 📋 Members
| Team Member |
| :--- |
| **Dale Vernard Balila** |
| **Ram Miguel Liwanag** |
| **John Albert Teoxon** |
| **Tara Ysabel Uy** |
