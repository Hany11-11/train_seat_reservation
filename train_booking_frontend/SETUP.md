# Frontend-Only Prototype Setup Guide

This is a **frontend-only prototype** of the Train Seat Booking System. It uses mock data stored in `localStorage` and requires **no backend server**.

## 🎯 Quick Start

```bash
cd train_booking_frontend
npm install
npm run dev
```

The app will be available at `http://localhost:8080`

## 🔑 Demo Credentials

### Regular User Accounts

- **Email:** john@example.com  
  **Password:** password123
- **Email:** sarah@example.com  
  **Password:** password123

### Admin Account

- **Email:** admin@railway.lk  
  **Password:** admin123

## 📦 What's Included

### Mock Data (All stored in localStorage)

1. **Trains** (`src/data/trains.mock.ts`)
   - 6 pre-configured trains
   - Udarata Menike, Ruhunu Kumari, Yal Devi, etc.

2. **Stations** (`src/types/schedule.ts`)
   - 8 major stations in Sri Lanka
   - Colombo Fort, Kandy, Galle, Jaffna, etc.

3. **Schedules** (`src/data/schedules.mock.ts`)
   - Multiple routes and timings
   - 30-day travel dates generated automatically

4. **Seat Layouts** (`src/data/seats.mock.ts`)
   - Coaches for each train (1st, 2nd, 3rd class)
   - Dynamic seat generation with availability

5. **Prices** (`src/data/prices.mock.ts`)
   - Pricing for all schedules and classes
   - LKR currency

6. **Users** (`src/data/users.mock.ts`)
   - Pre-configured demo users
   - Password storage simulation

7. **Bookings** (`src/data/bookings.mock.ts`)
   - Sample bookings for demonstration

## 🛠️ Key Features

### User Features

✅ Train search by route and date  
✅ Interactive seat selection  
✅ Booking management  
✅ User registration and login  
✅ Booking history

### Admin Features (admin@railway.lk)

✅ Manage trains, schedules, and stations  
✅ Set pricing for different classes  
✅ View all bookings  
✅ Dashboard analytics  
✅ Seat layout configuration

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── atoms/        # Basic components (Button, Input, etc.)
│   ├── molecules/    # Composite components (Forms, Cards, etc.)
│   ├── organisms/    # Complex components (Layouts, Tables, etc.)
│   └── ui/           # shadcn-ui components
├── data/             # Mock data and localStorage helpers
├── hooks/            # Custom React hooks
├── pages/            # Page components
├── services/         # Service layer (now uses mock data)
├── types/            # TypeScript type definitions
└── utils/            # Helper functions
```

## 🔄 Data Persistence

All data is stored in browser's `localStorage` under these keys:

- `trains`
- `stations`
- `schedules`
- `coaches`
- `seats_[scheduleId]_[date]_[coachId]`
- `prices`
- `bookings`
- `users`
- `passwords`
- `auth_token`
- `current_user`

### Reset Data

To reset all data to defaults:

1. Open browser DevTools (F12)
2. Go to Application/Storage tab
3. Clear all localStorage items
4. Refresh the page

## 🚀 Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` folder.

## 🔌 Adding Backend Later

When you're ready to connect a backend:

1. **Update Services** (`src/services/`)
   - Replace localStorage calls with actual API calls
   - Use `fetch` or `axios` for HTTP requests
   - Add proper error handling

2. **Environment Variables**
   - Create `.env` file
   - Add `VITE_API_URL=http://your-backend-url`

3. **Authentication**
   - Update `authService.ts` to use JWT tokens from backend
   - Add token refresh logic
   - Handle 401 unauthorized responses

4. **Remove Mock Data**
   - Keep mock data files for development/testing
   - Switch between mock and real API using environment variable

## 📝 Available Scripts

- `npm run dev` - Start development server (http://localhost:8080)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## 🎨 Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn-ui** - UI components
- **React Router v6** - Routing
- **React Query** - State management (optional, not fully utilized)
- **Vitest** - Testing

## 📱 Browser Support

Works on all modern browsers:

- Chrome, Edge, Firefox, Safari (latest versions)
- Requires localStorage support

## 🐛 Known Limitations

- Data is stored locally (browser-specific)
- No data synchronization across devices
- No real payment processing
- Seat availability is simulated
- No email notifications

## 📄 License

This is a prototype/demo project.
