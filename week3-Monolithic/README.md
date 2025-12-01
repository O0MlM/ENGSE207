# 🎯 Task Board - Monolithic Architecture

**ENGSE207 Software Architecture - Week 3 Lab**

**Sarisah Tawanwarasak 67543210005-4**

---

## 📋 Overview

This is a **Task Board application** built using **Monolithic Architecture**.  
It allows you to:

- Add new tasks with **title, description, and priority**
- Track progress in **To Do, In Progress, Done** columns
- Update task status or delete tasks
- Filter tasks by status

This project demonstrates a simple **full-stack app** using:

- **Node.js + Express** (backend)
- **SQLite** (database)
- **Vanilla JavaScript + HTML + CSS** (frontend)

---

## 📷 Screenshot / Preview

![Task Board Screenshot](screenshot.png)  

---

## 🧩 How the Program Works

### 1️⃣ Backend (server.js)

The **backend** handles all data storage and API requests.

**Steps:**

1. **Setup & Dependencies**
   - Express for server
   - SQLite3 for database
   - Path module to serve static files
2. **Database**
   - `tasks.db` stores all tasks
   - `tasks` table: `id`, `title`, `description`, `status`, `priority`, `created_at`, `updated_at`
3. **API Endpoints**
   - `GET /api/tasks` → Get all tasks
   - `GET /api/tasks/:id` → Get single task
   - `POST /api/tasks` → Create new task
   - `PUT /api/tasks/:id` → Update task
   - `DELETE /api/tasks/:id` → Delete task
   - `PATCH /api/tasks/:id/status` → Update only the status
4. **Server Start**
   - Server runs on `http://localhost:3000`
   - Serves frontend HTML + static assets

**Flow Example:**

1. Frontend requests tasks → Backend queries SQLite → Returns JSON data  
2. Frontend renders tasks in columns

---

### 2️⃣ Frontend (public/app.js)

The **frontend** handles user interactions and displays the task board.

**Components:**

- **State:** Holds all tasks in memory (`allTasks`) and current filter
- **DOM Elements:** Form inputs, task columns, filter dropdown
- **Functions:**
  - `fetchTasks()` → Get all tasks from backend
  - `createTask(task)` → Add task via POST request
  - `updateTaskStatus(id, status)` → Change status via PATCH
  - `deleteTask(id)` → Delete task via DELETE
  - `renderTasks()` → Display tasks in proper columns
  - Utility functions: format dates, escape HTML, etc.
- **Event Listeners:**
  - Form submission → create new task
  - Status filter → update displayed tasks
  - Inline buttons → update status or delete

**Flow Example:**

1. User opens page → `fetchTasks()` loads tasks  
2. Tasks are rendered into **To Do, In Progress, Done** columns  
3. User can:
   - Add a new task → Form data sent to backend → Update board  
   - Change status → Button triggers PATCH → Board updates  
   - Delete task → Button triggers DELETE → Board updates  

---

### 3️⃣ Database (database/schema.sql)

- `tasks` table stores all task data
- Fields:
  - `id` → Auto-increment task ID
  - `title` → Task title (required)
  - `description` → Task details (optional)
  - `status` → `TODO`, `IN_PROGRESS`, `DONE` (default `TODO`)
  - `priority` → `LOW`, `MEDIUM`, `HIGH` (default `MEDIUM`)
  - `created_at` / `updated_at` → Track creation & update time
- Sample data included for testing

---

## 🚀 Quick Start

### 1️⃣ Install Dependencies

```bash
npm install
```

### 2️⃣ Create Database
```bash
cd database
sqlite3 tasks.db < schema.sql
cd ..
```

### 3️⃣ Run Application
```bash
npm run dev   # with auto-restart
# or
npm start     # normal start
```
---

## 📝 Step-by-Step Explanation

1. User Interface (HTML)
   - Form to add task
   - Filter dropdown
   - Columns for tasks
2. Adding a Task
   - User fills form → JS captures data → Sends POST to /api/tasks
   - Backend inserts task → Returns new task → JS renders it
3. Updating Status
   - User clicks status button → JS sends PATCH /api/tasks/:id/status
   - Backend updates task → Returns updated task → JS re-renders
4. Deleting a Task
   - User clicks delete → JS sends DELETE /api/tasks/:id
   - Backend removes task → JS removes from board
5. Filtering Tasks
   - User selects status filter → JS updates displayed tasks
6. Task Counters
   - JS counts tasks in each column → Updates counters



