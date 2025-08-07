# Geo IP Lookup App

Simple app to search IP address locations with map and history.

## Setup with Docker

1. Build and run the frontend and backend:

   docker-compose up --build

2. Open in browser:

   - Frontend: http://localhost:3001  
   - Backend: http://localhost:3000

## Setup without Docker (Development Mode)

1. Install all dependencies (root, backend, and frontend):

   npm run install-all

2. Generate Prisma client and apply database migrations:

   npm run prisma:setup

3. Seed the database with a sample user:

   npm run seed
   
4. Start both frontend and backend servers:

   npm run dev

5. Open in browser:

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
- Prisma automatically creates the database and seeds user data in the Docker image  
- When running without Docker, make sure .env is present in backend and run `npm run prisma:setup`
