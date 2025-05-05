/// <reference types="vite/client" />

interface ImportMetaEnv {
    // Core Application Variables
    readonly VITE_APP_NAME: string;
    readonly VITE_APP_VERSION: string;
    readonly VITE_API_BASE_URL: string;
    readonly VITE_PUBLIC_URL: string;
  
    // API Authentication
    readonly VITE_API_KEY: string;
    readonly VITE_API_SECRET?: string;
  
    // Feature Flags
    readonly VITE_ENABLE_ML_PREDICTIONS: string;
    readonly VITE_ENABLE_REAL_TIME_DATA: string;
    readonly VITE_ENABLE_ADVANCED_INDICATORS: string;
  
    // Analytics
    readonly VITE_GOOGLE_ANALYTICS_ID?: string;
    readonly VITE_MIXPANEL_TOKEN?: string;
  
    // Firebase Configuration (optional)
    readonly VITE_FIREBASE_API_KEY?: string;
    readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
    readonly VITE_FIREBASE_PROJECT_ID?: string;
    readonly VITE_FIREBASE_STORAGE_BUCKET?: string;
    readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
    readonly VITE_FIREBASE_APP_ID?: string;
  
    // TensorFlow.js Configuration (for ML features)
    readonly VITE_TFJS_MODEL_URL?: string;
    readonly VITE_TFJS_USE_GPU?: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }