#!/bin/sh
set -e

# Log environment for debugging (excluding sensitive values)
echo "Starting ATS Application..."
echo "NODE_ENV: $NODE_ENV"
echo "Container environment: $(date)"

# Replace environment variables in the built app
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i -e "s|VITE_APP_NAME_PLACEHOLDER|${VITE_APP_NAME}|g" {} \;
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i -e "s|VITE_APP_VERSION_PLACEHOLDER|${VITE_APP_VERSION}|g" {} \;
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i -e "s|VITE_API_BASE_URL_PLACEHOLDER|${VITE_API_BASE_URL}|g" {} \;
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i -e "s|VITE_PUBLIC_URL_PLACEHOLDER|${VITE_PUBLIC_URL}|g" {} \;
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i -e "s|VITE_ENABLE_ML_PREDICTIONS_PLACEHOLDER|${VITE_ENABLE_ML_PREDICTIONS}|g" {} \;
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i -e "s|VITE_ENABLE_REAL_TIME_DATA_PLACEHOLDER|${VITE_ENABLE_REAL_TIME_DATA}|g" {} \;
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i -e "s|VITE_ENABLE_ADVANCED_INDICATORS_PLACEHOLDER|${VITE_ENABLE_ADVANCED_INDICATORS}|g" {} \;
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i -e "s|VITE_TFJS_MODEL_URL_PLACEHOLDER|${VITE_TFJS_MODEL_URL}|g" {} \;
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i -e "s|VITE_TFJS_USE_GPU_PLACEHOLDER|${VITE_TFJS_USE_GPU}|g" {} \;
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i -e "s|VITE_GOOGLE_ANALYTICS_ID_PLACEHOLDER|${VITE_GOOGLE_ANALYTICS_ID}|g" {} \;

# Set proper permissions
chmod -R 755 /usr/share/nginx/html

# Update Nginx configuration if needed
if [ ! -z "$PORT" ]; then
  echo "Updating Nginx configuration to use PORT=$PORT..."
  sed -i -e "s|listen 8080|listen $PORT|g" /etc/nginx/conf.d/default.conf
fi

# Check if we should validate environment variables
if [ "$VALIDATE_ENV" = "true" ]; then
  echo "Validating environment variables..."
  # Simple check for critical env vars
  if [ -z "$VITE_API_BASE_URL" ]; then
    echo "Error: VITE_API_BASE_URL is not set" >&2
    exit 1
  fi
fi

# Run health check
echo "Performing health check..."
if ! curl --silent --fail --max-time 5 "http://localhost:${PORT:-8080}/health" > /dev/null 2>&1; then
  echo "Warning: Health check endpoint not responding. Proceeding anyway..." >&2
fi

echo "Configuration complete, starting Nginx..."
exec "$@"