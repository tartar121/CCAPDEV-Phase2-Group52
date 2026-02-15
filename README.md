# CCAPDEV-Phase1-Group52
Task is to **develop the front-end portion** of selected web application.

### Deliverables
**zip file** containing **all files** for the machine project

## 📋 Members
This table details the group members:
| Team Member | Role |
| :--- | :--- |
| **Dale Vernard Balila** | Search & Filter & Technician Administrative Tools |
| **Ram Miguel Liwanag** | User Account & User Profile |
| **John Albert Teoxon** | Slot Availability Dashboard & Reservation System |
| **Tara Ysabel Uy** | Account Management, Reservation Priority & Optimization |

## 🚀 Key Features (Phase 1)
- All system views are visible and navigable from the main index webpage.
- Reservation Priority Displacement: Faculty members are able to override conflicting student reservations. Displaced students receive a persistent dashboard notification upon their next login.
- Technician Administrative Tools: Admin accounts can manage real-time lab status, including recording walk-ins, validating check-ins, and handling no-shows.
- Privacy & Anonymity: Students can choose to reserve slots anonymously to hide their identity from peers.
- Life-like Sample Data: The system initializes with at least 5 sample users and 5 sample reservations formatted in 1-hour blocks.
- Search & Filter: Users can search for specific lab availability by laboratory name and date.

## 🔑 Demo Credentials
The following accounts are hardcoded to demonstrate different role-based features:
| Role | Email | Password |
| :--- | :--- | :--- |
| Technician (Admin) | admin@dlsu.edu.ph | admin |
| Faculty | oliver.berris@dlsu.edu.ph | 123 |
| Student | tara_uy@dlsu.edu.ph | 456 |

## 🛠️ Tech Stack & Design
- Base Technologies: HTML, CSS, and JavaScript.
- Libraries: Bootstrap 5.3 and jQuery 3.7.1.
- Visual Assets: Appropriate graphics, including a custom pixel-art (made in Canva) and Bootstrap Icons, are used to represent lab status.

## 📁 Submission Guidelines
- File Format: CCAPDEV-Phase1-Group52.zip
- Collaboration: Students collaborated through the group's GitHub repository.

## 🛠️ Phase 0 to Phase 1: Evolution of Lab O' Mine
| Feature	| Phase 0 Proposal (The Plan)	| Phase 1 Implementation (The Reality) |
| :--- | :--- | :--- |
| Reservation Priority | Teacher has priority over student schedules	| Added a real-time notification system that alerts students on their dashboard if displaced by faculty |
| Technician Tools | Manual reserve, edit, and cancel no-shows | Added a "Checked-in" state (Green) to visually validate attendance, fulfilling the CRUD "Update" requirement |
| User Anonymity | An "option" to book anonymously | Integrated a custom Bootstrap Modal that requires a clear "Yes/No" privacy choice, improving UX and Visual Design |
| Search & Filter | Graphical interface to find free slots | Search parameters from reserve.html now dynamically filter the room grid to a specific date, preventing data overload |
| Client-Side Session Management | Login/Sign-up logic | Implemented sessionStorage to temporarily store user session data and maintain state consistency during active browser sessions |
