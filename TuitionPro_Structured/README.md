# TuitionPro

A tuition class management system built with React, Vite, Node.js, Express and MySQL.

## Features

- Admin, Teacher and Student login
- Teacher registration and class assignment
- Student registration
- Attendance tracking
- Monthly payment tracking
- PDF and video material uploads
- AI payment reminders using Google Gemini
- English and Tamil reminders with Polite, Firm or Friendly tones
- In-app notifications

## Requirements

- Node.js 20.17.0
- MySQL 8.x
- Internet connection for Gemini AI reminders

## Backend Setup

Open a terminal in the project folder:

```bash
cd server
npm ci
```

Copy `.env.example` to `.env` and update your settings:

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=tuitionpro

JWT_SECRET=YOUR_RANDOM_SECRET_AT_LEAST_32_CHARACTERS

GEMINI_API_KEY=YOUR_GEMINI_API_KEY
GEMINI_MODEL=gemini-3.5-flash-lite
```

Create the database and sample accounts:

```bash
npm run setup
```

Start the backend:

```bash
npm run dev
```

Backend URL: http://localhost:5000

## Frontend Setup

Keep the backend running. Open another terminal in the project folder:

```bash
cd client
npm ci
npm run dev
```

Open http://localhost:5173

For future runs, start MySQL and run `npm run dev` in both
the `server` and `client` folders.

## Sample Login Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@tuitionpro.local | Demo1234! |
| Teacher | teacher@tuitionpro.local | Demo1234! |
| Student | student@tuitionpro.local | Demo1234! |

These accounts are created by database setup.
Change their passwords after login.

## How to Use

1. Admin creates a teacher account.
2. Admin creates a class and assigns the teacher.
3. Teacher registers students in the assigned class.
4. Teacher saves attendance, records payments and uploads materials.
5. Teacher generates payment reminders.
6. Students log in to view their details, materials and notifications.

WhatsApp reminders must be copied and sent manually.

## Project Structure

- `client/` — React frontend
- `server/` — Express backend and MySQL queries
- `server/database/` — Database tables and sample account setup

## Notes

- Keep `.env` files and API keys private.
- Gemini reminders require a valid API key and available quota.
- Each student currently belongs to one class.
- Online payments and automatic WhatsApp delivery are not included.