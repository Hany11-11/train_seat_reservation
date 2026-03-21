# Train Seat Booking System - Frontend Prototype

A modern train ticket booking application built with React, TypeScript, and Vite.

**⚠️ Important: This is a frontend-only prototype that uses mock data stored in localStorage. No backend server is required.**

## Features

- **User Features:**
  - Search trains by route and date
  - View train schedules and availability
  - Select seats with interactive seat map
  - Secure checkout and payment processing
  - User authentication and booking history

- **Admin Features:**
  - Manage trains and schedules
  - Configure seat layouts and pricing
  - View and manage bookings
  - Admin dashboard with analytics

## Technologies

- **Frontend:** React 18, TypeScript, Vite
- **UI Components:** shadcn-ui, Radix UI
- **Styling:** Tailwind CSS
- **State Management:** React Query
- **Routing:** React Router v6
- **Form Handling:** React Hook Form, Zod
- **Testing:** Vitest, Testing Library
- **Data Storage:** localStorage (mock data for prototype)

## Getting Started

### Prerequisites

- Node.js 18+ and npm installed

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd train_booking

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Demo Credentials

### Regular User Accounts

- **Email:** john@example.com  
  **Password:** password123
- **Email:** sarah@example.com  
  **Password:** password123

### Admin Account

- **Email:** admin@railway.lk  
  **Password:** admin123

## Mock Data

This prototype uses mock data stored in localStorage. The data includes:

- **Trains:** 6 pre-configured trains (Udarata Menike, Ruhunu Kumari, etc.)
- **Stations:** 8 major stations in Sri Lanka
- **Schedules:** Multiple daily routes between stations
- **Prices:** Configured prices for 1st, 2nd, and 3rd class seats
- **Bookings:** Sample bookings for demonstration
- **Seat Layouts:** Dynamic seat generation for each coach

All data persists in your browser's localStorage and can be modified through the admin panel. To reset the data, clear your browser's localStorage.

## Project Structure

```
src/
├── components/     # UI components (atoms, molecules, organisms, templates)
├── data/          # Mock data and data services
├── hooks/         # Custom React hooks
├── lib/           # Utility libraries
├── pages/         # Page components and routes
├── types/         # TypeScript type definitions
└── utils/         # Helper functions
```
