# Geo IP Lookup App

Simple app to search IP address locations with map and history.

## Setup with Docker

1. Build and run the frontend and backend:

   npm run docker:up:dev

2. Open in browser:

   - Frontend: http://localhost:3001  
   - Backend: http://localhost:3000

3. To stop the containers:

   npm run docker:down

## Setup without Docker (Development Mode)

1. Install root dependencies (for scripts):

   npm install

2. Install all dependencies (root, backend, and frontend):

   npm run install-all

3. Generate Prisma client and apply database migrations:

   npm run prisma:setup

4. Seed the database with a sample user:

   npm run seed

5. Start both frontend and backend servers:

   npm run dev

6. Open in browser:

   - Frontend: http://localhost:5173  
   - Backend: http://localhost:3000

## Login

Username: sampleuser  
Password: samplepass

## Folder Structure

frontend/  → Vite + React app  
backend/   → Express API with Prisma

## Requirements

- Node.js v22.17.1 or higher  
- Docker  
- Docker Compose

## Notes

- Backend uses SQLite with Prisma ORM  
- Prisma automatically creates the database and seeds sample user data in the Docker image  
- When running without Docker, ensure `.env` is present inside `backend/` before running `prisma:setup`
