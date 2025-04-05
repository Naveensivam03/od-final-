# OD Processing System

## Environment Setup

This project uses environment variables for configuration. Create the following files in the root directory:

### For Development
Create a `.env` file with:
```
VITE_BACKEND_URL=https://od-final.onrender.com
```

### For Production
Create a `.env.production` file with:
```
VITE_BACKEND_URL=https://od-final.onrender.com
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Deployment

When deploying to Vercel, make sure to set the following environment variable:
- `VITE_BACKEND_URL`: Set to `https://od-final.onrender.com`

## API Configuration

The application uses a centralized API configuration in `src/config.js` that manages all API endpoints and authentication headers.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
