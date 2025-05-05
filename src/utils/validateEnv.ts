/**
 * Validates required environment variables
 * This function is called during application initialization to ensure
 * all required environment variables are available
 * 
 * @returns boolean True if all required variables are present
 * @throws Error if any required variables are missing
 */
export const validateEnv = (): boolean => {
    const requiredVars = [
      'VITE_API_BASE_URL',
      'VITE_API_KEY'
    ];
    
    const missingVars = requiredVars.filter(varName => {
      const value = import.meta.env[varName];
      return value === undefined || value === null || value === '';
    });
    
    if (missingVars.length > 0) {
      console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
    
    // Validation for specific variables
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    if (apiBaseUrl && !apiBaseUrl.startsWith('http')) {
      console.error('VITE_API_BASE_URL must start with http:// or https://');
      throw new Error('VITE_API_BASE_URL must start with http:// or https://');
    }
    
    // Check if any Firebase variables are partially defined
    const firebaseVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_STORAGE_BUCKET',
      'VITE_FIREBASE_MESSAGING_SENDER_ID',
      'VITE_FIREBASE_APP_ID'
    ];
    
    const definedFirebaseVars = firebaseVars.filter(varName => 
      import.meta.env[varName] !== undefined && 
      import.meta.env[varName] !== null && 
      import.meta.env[varName] !== ''
    );
    
    // If some but not all Firebase variables are defined, warn about it
    if (definedFirebaseVars.length > 0 && definedFirebaseVars.length < firebaseVars.length) {
      const undefinedVars = firebaseVars.filter(varName => !definedFirebaseVars.includes(varName));
      console.warn(`Some Firebase configuration variables are missing: ${undefinedVars.join(', ')}`);
    }
  
    // Validate TensorFlow.js model URL if ML predictions are enabled
    const enableMLPredictions = import.meta.env.VITE_ENABLE_ML_PREDICTIONS;
    const tfModelUrl = import.meta.env.VITE_TFJS_MODEL_URL;
    
    if (enableMLPredictions === 'true' && (!tfModelUrl || tfModelUrl === '')) {
      console.warn('ML predictions are enabled but VITE_TFJS_MODEL_URL is not defined');
    }
    
    return true;
  };
  
  /**
   * Formats environment variables for logging
   * This function masks sensitive variables like API keys and secrets
   * 
   * @returns Object of formatted environment variables
   */
  export const getFormattedEnvVars = (): Record<string, string> => {
    const envVars: Record<string, string> = {};
    
    // List of variables that should be masked
    const sensitiveVars = [
      'VITE_API_KEY', 
      'VITE_API_SECRET', 
      'VITE_FIREBASE_API_KEY'
    ];
    
    // Get all environment variables that start with VITE_
    Object.keys(import.meta.env).forEach(key => {
      if (key.startsWith('VITE_')) {
        // Mask sensitive variables
        if (sensitiveVars.includes(key)) {
          const value = import.meta.env[key] as string;
          if (value) {
            // Show first 4 characters and mask the rest
            const maskedValue = value.substring(0, 4) + '•'.repeat(Math.max(0, value.length - 4));
            envVars[key] = maskedValue;
          } else {
            envVars[key] = 'undefined';
          }
        } else {
          envVars[key] = import.meta.env[key] as string;
        }
      }
    });
    
    return envVars;
  };
  
  /**
   * Checks if the application is running in production environment
   * 
   * @returns boolean True if running in production
   */
  export const isProduction = (): boolean => {
    return import.meta.env.MODE === 'production';
  };
  
  /**
   * Checks if the application is running in development environment
   * 
   * @returns boolean True if running in development
   */
  export const isDevelopment = (): boolean => {
    return import.meta.env.MODE === 'development';
  };
  
  export default validateEnv;