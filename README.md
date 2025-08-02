# ExpreeZmeal - Nigerian Fast-Casual Restaurant

A modern full-stack web application for ExpreeZmeal, a luxurious Nigerian fast-casual restaurant offering shawarma, zobo, meat pies, and authentic local snacks.

## 🏗️ Architecture

This project has been restructured from a monolithic Flask application into a modern microservices architecture:

- **Frontend**: Next.js 14 with React, TypeScript, and TailwindCSS
- **Backend**: Flask REST API with SQLAlchemy ORM
- **Database**: PostgreSQL with Redis for session management
- **Styling**: TailwindCSS with custom Nigerian luxury theme
- **Animations**: Framer Motion for smooth UI interactions

## 📁 Project Structure

```
expreezmeal/
│
├── frontend/                 # Next.js React Application
│   ├── src/
│   │   ├── app/             # Next.js App Router pages
│   │   │   ├── globals.css  # Global styles with custom theme
│   │   │   ├── layout.tsx   # Root layout component
│   │   │   ├── page.tsx     # Home page
│   │   │   ├── menu/        # Menu page
│   │   │   └── contact/     # Contact page
│   │   ├── components/      # Reusable React components
│   │   │   ├── Navbar.tsx   # Navigation component
│   │   │   ├── Footer.tsx   # Footer component
│   │   │   └── MenuCard.tsx # Menu item card component
│   │   ├── lib/             # Utility functions and API client
│   │   │   └── api.ts       # Axios-based API client
│   │   └── types/           # TypeScript type definitions
│   │       └── index.ts     # Shared types and interfaces
│   ├── public/              # Static assets
│   ├── package.json         # Frontend dependencies
│   ├── tailwind.config.js   # TailwindCSS configuration
│   └── next.config.js       # Next.js configuration
│
├── backend/                 # Flask API Server
│   ├── app.py              # Main Flask application with API routes
│   ├── database.py         # SQLAlchemy models and database setup
│   ├── requirements.txt    # Python dependencies
│   ├── migrations/         # Database migration files
│   ├── static/             # [Archived] Original static files
│   ├── templates/          # [Archived] Original Flask templates
│   ├── Dockerfile.dev      # Development Docker configuration
│   ├── Dockerfile.prod     # Production Docker configuration
│   └── k8s/               # Kubernetes deployment configurations
│
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- **Frontend**: Node.js 18+ and npm
- **Backend**: Python 3.8+ and pip
- **Database**: PostgreSQL and Redis

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   # Create a .env file in the backend directory
   DATABASE_URL=postgresql://username:password@localhost:5432/expreezmeal
   REDIS_URL=redis://localhost:6379/1
   ```

5. Run database migrations:
   ```bash
   flask db upgrade
   ```

6. Start the Flask development server:
   ```bash
   python app.py
   ```

The backend API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Create environment variables:
   ```bash
   # Create a .env.local file in the frontend directory
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. Start the Next.js development server:
   ```bash
   npm run dev
   ```

The frontend application will be available at `http://localhost:3000`

## 🎨 Design Theme

The application features a **Nigerian luxury theme** with:

- **Colors**: 
  - Primary: Deep red (#dc2626) for calls-to-action
  - Secondary: Warm gold (#eab308) for accents
  - Neutral: Professional gray palette
- **Typography**: 
  - Display: Playfair Display (elegant serif)
  - Body: Inter (clean sans-serif)
- **Visual Style**: Modern luxury with Nigerian cultural elements

## 🛠️ API Endpoints

The backend provides RESTful API endpoints:

- `GET /api/health` - Health check
- `GET /api/categories` - Retrieve food categories
- `GET /api/menu-items` - Retrieve menu items (with optional category filter)
- `GET /api/menu-items/featured` - Retrieve featured menu items
- `GET /api/menu-items/:id` - Retrieve single menu item
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Retrieve order details

## 🔧 Development

### Frontend Development

- **Framework**: Next.js 14 with App Router
- **Styling**: TailwindCSS with custom utility classes
- **State Management**: React hooks with Context API (for cart functionality)
- **Animations**: Framer Motion for smooth transitions
- **Type Safety**: Full TypeScript coverage

### Backend Development

- **Framework**: Flask with SQLAlchemy ORM
- **Database**: PostgreSQL with Alembic migrations
- **Session Management**: Redis-backed Flask sessions
- **API Design**: RESTful endpoints with JSON responses
- **CORS**: Configured for frontend-backend separation

### Key Features Implemented

✅ **Complete Project Restructure**: Separated frontend and backend
✅ **Modern React Frontend**: Next.js with TypeScript and TailwindCSS
✅ **Nigerian Luxury Theme**: Custom color palette and typography
✅ **Responsive Design**: Mobile-first approach with smooth animations
✅ **API Integration**: Axios-based client with error handling
✅ **Component Architecture**: Reusable components (Navbar, Footer, MenuCard)
✅ **Page Components**: Home, Menu, and Contact pages
✅ **Flask API Backend**: Comprehensive REST API endpoints
✅ **CORS Configuration**: Proper frontend-backend communication

### Remaining Tasks

🔄 **Shopping Cart & Checkout**: Cart functionality and checkout flow
🔄 **Image Optimization**: Optimize and organize static assets
🔄 **Development Tools**: ESLint, Prettier, and build optimization
🔄 **Authentication**: User login and registration system
🔄 **Order Management**: Real-time order tracking

## 📦 Deployment

### Development
- Frontend: `npm run dev` (http://localhost:3000)
- Backend: `python app.py` (http://localhost:5000)

### Production
- Frontend: `npm run build && npm start`
- Backend: Use `prod-server.py` with Gunicorn
- Containerization: Docker configurations provided
- Orchestration: Kubernetes manifests in `k8s/` directory

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both frontend and backend
5. Submit a pull request

## 📝 License

This project is proprietary to ExpreeZmeal restaurant.

---

**ExpreeZmeal** - Where Nigerian tradition meets modern luxury dining. 🇳🇬✨