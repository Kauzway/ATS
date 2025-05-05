# ATS - Environment Variables Guide

This document outlines the environment variables required for the Advanced Trading System (ATS) application. Proper configuration of these variables is essential for the application to function correctly in different environments.

## Overview

ATS uses environment variables to manage configuration settings across different environments (development, testing, production). These variables include API endpoints, authentication credentials, feature flags, and other configuration values.

## Environment Files

The application uses the following environment files:

- `.env.development` - Used during local development
- `.env.test` - Used for testing environments
- `.env.production` - Used for production deployment

## Required Environment Variables

### Core Application Variables

| Variable | Description | Example Value | Required |
|----------|-------------|---------------|----------|
| `VITE_API_BASE_URL` | Base URL for API endpoints | `https://api.example.com` | Yes |
| `VITE_APP_NAME` | Application name | `Advanced Trading System` | No |
| `VITE_APP_VERSION` | Application version | `1.0.0` | No |
| `VITE_PUBLIC_URL` | Public URL for the application | `https://ats-trading.com` | Yes (Production) |

### API Authentication

| Variable | Description | Example Value | Required |
|----------|-------------|---------------|----------|
| `VITE_API_KEY` | API key for authentication | `Yj2Gh7Kl3M9p0Qr4St5Uv6Wx7Yz8` | Yes |
| `VITE_API_SECRET` | API secret for authentication | `ZA8yX7wV6uT5sR4qP9oN8mL7kJ6hG5f` | Yes (if required by API) |

### Feature Flags

| Variable | Description | Example Value | Required |
|----------|-------------|---------------|----------|
| `VITE_ENABLE_ML_PREDICTIONS` | Enable/disable ML predictions | `true` | No |
| `VITE_ENABLE_REAL_TIME_DATA` | Enable/disable real-time data | `false` | No |
| `VITE_ENABLE_ADVANCED_INDICATORS` | Enable/disable advanced indicators | `true` | No |

### Analytics

| Variable | Description | Example Value | Required |
|----------|-------------|---------------|----------|
| `VITE_GOOGLE_ANALYTICS_ID` | Google Analytics ID | `UA-123456789-1` | No |
| `VITE_MIXPANEL_TOKEN` | Mixpanel token | `1234567890abcdef` | No |

### Firebase Configuration (if using Firebase)

| Variable | Description | Example Value | Required |
|----------|-------------|---------------|----------|
| `VITE_FIREBASE_API_KEY` | Firebase API key | `AIzaSyAb1CdEfGhIjKlMnOpQrStUvWxYz` | Yes (if using Firebase) |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase authentication domain | `ats-trading.firebaseapp.com` | Yes (if using Firebase) |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | `ats-trading` | Yes (if using Firebase) |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | `ats-trading.appspot.com` | Yes (if using Firebase) |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | `123456789012` | Yes (if using Firebase) |
| `VITE_FIREBASE_APP_ID` | Firebase application ID | `1:123456789012:web:1a2b3c4d5e6f7g8h9i` | Yes (if using Firebase) |

### TensorFlow.js Configuration (for ML features)

| Variable | Description | Example Value | Required |
|----------|-------------|---------------|----------|
| `VITE_TFJS_MODEL_URL` | URL to TensorFlow.js model | `https://storage.googleapis.com/ats-models/model.json` | Yes (if using ML) |
| `VITE_TFJS_USE_GPU` | Enable GPU acceleration for TensorFlow.js | `true` | No |

## Environment-Specific Configurations

### Development Environment

For local development, create a `.env.development` file with the following variables:

```
VITE_API_BASE_URL=http://localhost:3001
VITE_API_KEY=development_key
VITE_API_SECRET=development_secret
VITE_ENABLE_ML_PREDICTIONS=true
VITE_ENABLE_REAL_TIME_DATA=false
VITE_ENABLE_ADVANCED_INDICATORS=true
```

### Testing Environment

For testing environments, create a `.env.test` file with the following variables:

```
VITE_API_BASE_URL=https://api-test.ats-trading.com
VITE_API_KEY=test_key
VITE_API_SECRET=test_secret
VITE_ENABLE_ML_PREDICTIONS=true
VITE_ENABLE_REAL_TIME_DATA=false
VITE_ENABLE_ADVANCED_INDICATORS=true
```

### Production Environment

For production deployment, create a `.env.production` file with the following variables:

```
VITE_API_BASE_URL=https://api.ats-trading.com
VITE_PUBLIC_URL=https://ats-trading.com
VITE_API_KEY=production_key
VITE_API_SECRET=production_secret
VITE_ENABLE_ML_PREDICTIONS=true
VITE_ENABLE_REAL_TIME_DATA=true
VITE_ENABLE_ADVANCED_INDICATORS=true
VITE_GOOGLE_ANALYTICS_ID=UA-123456789-1
```

## Environment Variables in Docker

When deploying with Docker, set environment variables in your Dockerfile or docker-compose.yml file:

```dockerfile
# Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile
ENV VITE_API_BASE_URL=https://api.ats-trading.com
RUN yarn build
```

Or in docker-compose.yml:

```yaml
version: '3'
services:
  ats-app:
    build: .
    environment:
      - VITE_API_BASE_URL=https://api.ats-trading.com
      - VITE_API_KEY=production_key
      - VITE_API_SECRET=production_secret
```

## Environment Variables in Google Cloud Run

When deploying to Google Cloud Run, set environment variables in the deployment command:

```bash
gcloud run deploy ats-trading \
    --image us-central1-docker.pkg.dev/ats-trading-project/ats-docker-repo/ats-trading:v1 \
    --platform managed \
    --region us-central1 \
    --set-env-vars="VITE_API_BASE_URL=https://api.ats-trading.com,VITE_API_KEY=production_key"
```

For sensitive variables, use Google Cloud Secret Manager:

```bash
gcloud run deploy ats-trading \
    --image us-central1-docker.pkg.dev/ats-trading-project/ats-docker-repo/ats-trading:v1 \
    --platform managed \
    --region us-central1 \
    --set-secrets="VITE_API_SECRET=api-secret:latest"
```

## Accessing Environment Variables in the Application

In the React application, access environment variables using `import.meta.env`:

```typescript
// Accessing environment variables in a React component
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const apiKey = import.meta.env.VITE_API_KEY;

// Example usage in an API service
const fetchData = async () => {
  const response = await fetch(`${apiBaseUrl}/market/overview`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  });
  return response.json();
};
```

## Environment Variable Validation

It's good practice to validate required environment variables at startup:

```typescript
// src/utils/validateEnv.ts
export const validateEnv = () => {
  const requiredVars = [
    'VITE_API_BASE_URL',
    'VITE_API_KEY'
  ];
  
  const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
  
  return true;
};

// Call this in your main.tsx or App.tsx
validateEnv();
```

## Security Considerations

1. Never commit `.env` files to version control. Add them to your `.gitignore` file.
2. Use environment-specific `.env` files.
3. Consider using a secrets management service like Google Cloud Secret Manager for production environments.
4. Limit access to environment variables to those who need them.
5. Rotate API keys and secrets regularly.
6. Only expose variables prefixed with `VITE_` to the client-side code.

## Troubleshooting

### Common Issues

1. **Issue**: Environment variables not accessible in the application.
   **Solution**: Ensure variable names start with `VITE_` prefix and restart the development server.

2. **Issue**: Environment variables not being loaded.
   **Solution**: Check that the `.env` file is in the correct location (project root).

3. **Issue**: Environment variables not available in production build.
   **Solution**: Ensure variables are set at build time or in the runtime environment.

### Getting Help

If you encounter issues not covered in this guide, refer to the Vite documentation on environment variables: [Vite Env Variables and Modes](https://vitejs.dev/guide/env-and-mode.html)