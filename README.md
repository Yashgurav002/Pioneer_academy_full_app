# Football Club Management System

A production-ready SaaS application for managing Football Clubs. Built with Django REST Framework (Backend) and Next.js 14 (Frontend).

## Features
- **Role-Based Access Control** (Admin, Coach, Staff, Player)
- **Comprehensive Dashboards** powered by Glassmorphism UI
- **Entity Management** for Coaches, Players, Students, and Training Sessions
- **Document Vault** for Medical Records, Contracts, and ID Proofs
- JWT Authentication

## Tech Stack
- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Zustand, Axios
- **Backend**: Django, Django REST Framework, SimpleJWT
- **Database**: PostgreSQL (Neon Serverless)

---

## Local Setup Instructions

### 1. Database (Neon)
1. Go to [Neon.tech](https://neon.tech/) and create a project.
2. Copy the PostgreSQL connection string.

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows: venv\\Scripts\\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt # (Or manually via pip install django djangorestframework djangorestframework-simplejwt psycopg2-binary django-cors-headers pillow whitenoise gunicorn python-dotenv dj-database-url)

# Environment Variables
# Copy .env.example to .env and paste your Neon DATABASE_URL
cp .env.example .env

# Run Migrations
python manage.py makemigrations
python manage.py migrate

# Create Superuser (Admin)
python manage.py createsuperuser

# Run server
python manage.py runserver
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Environment Variables
# Copy .env.example to .env.local
cp .env.example .env.local

# Run Development Server
npm run dev
```

Visit `http://localhost:3000`. Log in using the superuser credentials created above (The superuser acts as an ADMIN).

---

## Deployment Steps

### 1. Database (Neon)
Nothing extra needed, Neon is already a cloud database. Just ensure IP restrictions are loose enough for Render and Vercel to connect.

### 2. Backend (Render)
1. Push the repository to GitHub.
2. Go to [Render](https://render.com/), create a new **Web Service**.
3. Point it to your GitHub repository and set the Root Directory to `backend/`.
4. Build Command: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
5. Start Command: `gunicorn core.wsgi:application`
6. **Environment Variables**:
   - `DATABASE_URL`: Your Neon Postgres URI.
   - `DJANGO_SECRET_KEY`: Generate a random secure string.
   - `DEBUG`: `False`
   - `FRONTEND_URL`: Your Vercel frontend URL (for CORS).

### 3. Frontend (Vercel)
1. Go to [Vercel](https://vercel.com/), create a new project.
2. Point it to your GitHub repository and set the Root Directory to `frontend/`.
3. Framework Preset: Next.js.
4. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: Your Render backend URL (e.g., `https://your-backend.onrender.com/api/`).
5. Click **Deploy**.

---
*Built with modern architecture and standard SaaS practices.*
