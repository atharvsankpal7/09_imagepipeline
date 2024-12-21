# Image Inpainting Project

A web application for image inpainting that allows users to draw masks on images and save them. The project consists of a React frontend and a FastAPI backend.

## Features

- Upload and edit images
- Draw masks with customizable brush size and color
- Preview masked images before saving
- Gallery view of saved images
- Delete saved images
- Cloudinary integration for image storage

## Tech Stack

### Frontend

- React 18
- TypeScript
- Vite
- TailwindCSS
- Framer Motion (animations)
- Lucide React (icons)
- React Sketch Canvas (drawing functionality)
- Axios (HTTP client)
- React Router DOM

### Backend

- FastAPI
- Python 3.11+
- SQLite (via aiosqlite)
- Cloudinary (image storage)
- python-dotenv
- uvicorn

## Getting Started

### Prerequisites

- Node.js 16+
- Python 3.11+
- pnpm (recommended) or npm

### Running the Backend

1. Navigate to the server directory:

   ```bash
   cd server
   ```
2. Create a virtual environment and activate it:

   ```bash
   python -m venv venv
   source venv\Scripts\activate
   ```
3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file with your Cloudinary credentials:

   ```
   FRONTEND_URL="http://localhost:5173"
   CLOUDINARY_CLOUD_NAME="your_cloud_name"
   CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_api_secret"
   ```
5. Start the server:

   ```bash
   uvicorn main:app --reload
   ```

The backend will be available at `http://localhost:8000`.

### Running the Frontend

1. Navigate to the client directory:

   ```bash
   cd client
   ```
2. Install dependencies:

   ```bash
   pnpm install  # or npm install
   ```
3. Start the development server:

   ```bash
   pnpm dev  # or npm run dev
   ```

The frontend will be available at `http://localhost:5173`.

## Project Structure

```
.
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.tsx       # Main application component
│   │   └── main.tsx      # Application entry point
│   └── package.json
└── server/                # Backend FastAPI application
    ├── main.py           # Main application file
    ├── requirements.txt  # Python dependencies
    └── .env             # Environment variables
```
