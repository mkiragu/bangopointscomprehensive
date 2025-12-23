# BangoPoints Frontend

Modern, dark-themed React frontend for the BangoPoints loyalty platform with silver accents.

## Features

- **Dark Mode UI** - Elegant dark theme with silver accents throughout
- **Role-Based Dashboards** - Custom interfaces for each user role:
  - Shopper Dashboard
  - Admin Dashboard  
  - PPG Dashboard
  - BEO Dashboard
  - Brand Manager Dashboard
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Real-time Updates** - Live data from backend API
- **Secure Authentication** - JWT-based auth with refresh tokens

## Tech Stack

- **React 18** - Modern React with hooks
- **React Router 6** - Client-side routing
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS with custom dark theme
- **Axios** - HTTP client for API calls
- **Zustand** - Lightweight state management
- **Lucide React** - Beautiful icon library
- **React Hook Form** - Form handling
- **Recharts** - Charts and visualizations

## Installation

```bash
cd frontend
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:3001` and proxy API requests to `http://localhost:3000`.

## Build for Production

```bash
npm run build
```

Built files will be in the `dist` directory.

## Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── layouts/       # Layout components
│   ├── pages/
│   │   ├── auth/          # Login, Register
│   │   ├── shopper/       # Shopper pages
│   │   ├── admin/         # Admin pages
│   │   ├── ppg/           # PPG pages
│   │   ├── beo/           # BEO pages
│   │   └── brandManager/  # Brand Manager pages
│   ├── services/          # API services
│   ├── store/             # State management
│   ├── utils/             # Utility functions
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── public/                # Static assets
├── index.html             # HTML template
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
└── postcss.config.js      # PostCSS configuration
```

## Dark Mode Theme

The entire UI is in dark mode with custom color palette:

- **Background**: Dark grays (#121212 to #2a2a2a)
- **Text**: Light silvers (#e9ecef to #f8f9fa)
- **Accents**: Silver (#c0c0c0) with hover effects
- **Borders**: Subtle silver-gray (#495057)
- **Shadows**: Silver glows for important elements

## Available Routes

### Public Routes
- `/login` - Login page
- `/register` - Registration page

### Shopper Routes
- `/shopper/dashboard` - Shopper dashboard
- `/shopper/receipts` - Receipt management
- `/shopper/rewards` - Rewards catalog
- `/shopper/profile` - Profile management

### Admin Routes
- `/admin/dashboard` - Admin dashboard
- `/admin/users` - User management
- `/admin/brands` - Brand management
- `/admin/stores` - Store management
- `/admin/rewards` - Reward management

### PPG Routes
- `/ppg/dashboard` - PPG dashboard
- `/ppg/clock` - Clock in/out

### BEO Routes
- `/beo/dashboard` - BEO dashboard
- `/beo/receipts` - Receipt processing

### Brand Manager Routes
- `/brand-manager/dashboard` - Brand Manager dashboard
- `/brand-manager/brands` - Brand management

## API Integration

The frontend connects to the backend API running on `http://localhost:3000`. All API calls are made through the `api` service which handles:

- Authentication tokens
- Token refresh
- Error handling
- Request/response interceptors

## Customization

### Colors

Edit `tailwind.config.js` to customize the dark theme colors:

```javascript
colors: {
  dark: { /* dark background shades */ },
  silver: { /* silver text shades */ },
  accent: { /* silver accent colors */ },
}
```

### Components

Reusable component classes are defined in `index.css`:

- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.card` - Card container
- `.input-field` - Form input
- `.nav-link` - Navigation link
- `.stat-card` - Statistics card
- `.badge` - Badge styles (bronze, silver, gold, etc.)

## Environment Variables

Create a `.env` file in the frontend directory if you need to override defaults:

```bash
VITE_API_URL=http://localhost:3000
```

## Development Notes

- All components use functional components with hooks
- State management with Zustand for auth
- Forms use controlled components
- Icons from Lucide React library
- Responsive design with Tailwind breakpoints
- Dark mode is always enabled (class-based)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## License

MIT
