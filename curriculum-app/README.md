# UMKM Product List MVP

A fullstack web application for managing UMKM (Small Medium Enterprises) products with image upload capabilities.

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
- Product listing with images
- Add new products with image upload
- Delete products
- Responsive design with Tailwind CSS
- Image storage using Supabase

## Tech Stack
### Backend
- Express.js 5.1.0
- Supabase (Database & Storage)
- Multer 2.0.2 (File upload handling)
- CORS
- Environment variables support

### Frontend
- Next.js 15.4.6
- React 19.1.0
- Tailwind CSS
- Geist Font
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
   SUPABASE_URL=your_supabase_url
   SUPABASE_SECRET_KEY=your_supabase_key
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
3. Create a `.env.local` file:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/upload` - Upload product image

## Environment Variables
- `PORT` - API port (default: 4000)
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SECRET_KEY` - Supabase service role key

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
