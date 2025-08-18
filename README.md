# Curriculum Manager App

A fullstack web application for managing curriculum.

## Project Structure
```
curriculum-app/
├── api/                  # Backend API
│   ├── src/             # Source files
│   ├── package.json      # API dependencies
│   └── ...
└── curriculum-app/      # Frontend Application
    ├── src/             # Source files
    ├── package.json      # Frontend dependencies
    └── ...
```

## Features
- role base application
- in role admin can create project and tasks
- in role admin can delete project and update status project and tasks
- project can assign to user
- in role user can see project what assign to him
- user can update status project and task to inform status to admin


## Tech Stack
### Backend
- Express.js 5.1.0
- Supabase (Database & Storage)
- Multer 2.0.2 (File upload handling)
- CORS
- Cookie
- Jsonwebtoken
- Environment variables support

### Frontend
- Next.js 15.4.6
- React 19.1.0
- Tailwind CSS
- Shadcn Ui
- Environment variables support

## Getting Started

### Prerequisites
- Node.js
- NPM or Yarn

### API Setup
1. Navigate to the API directory:
   ```bash
   cd api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with:
   ```
   PORT=4000
   DATABASE_URL=your_database_supabase_url
   CORS_ORIGIN=your_frontend_url
   SUPABASE_URL=your_supabase_url
   JWT_SECRET=your_secret_key_jsonwebtoken
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY =your_supabase_anoymous_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_role_key
   ```
4. Start the API:
   ```bash
   npm run dev
   ```

### Web Setup
1. Navigate to the web directory:
   ```bash
   cd curriculum-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints
- `POST /api/register` - Create new User
- `POST /api/login` - Login User to get token auth
- `POST /api/logout` - Logout User to remove token auth
- `GET /api/users` - Get Users
- `DELETE /api/products/:id` - Delete product
- `POST /api/upload` - Upload product image
- `GET /get-all-project`- get all project
- `POST /add-project` - add new project
- `PUT /project/:id` -  update_project
- `DELETE /project/:id` - delete - project
- `GET /project/:id` -  detailproject
- `PATCH /project/status/:id` - update project status
- `post /tasks/add` - add_task
- `PATCH /task/status` - update task status

## Environment Variables
- `PORT` - API port (default: 4000)
- `DATABASE_URL` - Database Supabase URL
- `CORS_ORIGIN` - Frontend URL
- `JWT_SECRET` - Secret Key Jsonwebtoken
- `SUPABASE_URL` - Supabase URL
- `SUPABASE_ANON_KEY` - Supabase Anonymous Key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase Role Key
