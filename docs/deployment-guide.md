# ATS - Deployment Guide for Google Cloud Run

This guide explains how to deploy the Advanced Trading System (ATS) application to Google Cloud Run.

## Prerequisites

Before you begin, ensure you have the following:

1. A Google Cloud Platform (GCP) account
2. Google Cloud SDK installed and configured on your local machine
3. Docker installed on your local machine
4. Git repository access to the ATS codebase
5. Required environment variables and API keys

## Step 1: Create a Dockerfile

Create a Dockerfile in the root of your project:

```dockerfile
# Use an official Node.js runtime as the base image
FROM node:18-alpine as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json/yarn.lock
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
RUN yarn build

# Use Nginx to serve the static files
FROM nginx:alpine

# Copy the build output from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080 (Cloud Run expects this port)
EXPOSE 8080

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
```

## Step 2: Create an Nginx Configuration File

Create an `nginx.conf` file in the root of your project:

```nginx
server {
    listen 8080;
    
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
    
    # Configure GZIP compression
    gzip on;
    gzip_disable "msie6";
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_buffers 16 8k;
    gzip_http_version 1.1;
    gzip_min_length 256;
    gzip_types
        application/javascript
        application/json
        application/vnd.ms-fontobject
        application/x-font-ttf
        font/opentype
        image/svg+xml
        image/x-icon
        text/css
        text/plain;
}
```

## Step 3: Create a .dockerignore File

Create a `.dockerignore` file to exclude unnecessary files from the Docker build context:

```
node_modules
npm-debug.log
yarn-debug.log
yarn-error.log
.git
.github
.vscode
dist
.env
.env.local
.env.development
.env.test
.env.production
*.md
!README.md
```

## Step 4: Set Up Environment Variables

1. Create a `.env.production` file with your production environment variables:

```
VITE_API_BASE_URL=https://your-production-api-url.com
```

2. In Google Cloud Run, you'll set these variables as runtime environment variables.

## Step 5: Build and Test the Docker Image Locally

1. Build the Docker image:

```bash
docker build -t ats-trading .
```

2. Run the container locally to test:

```bash
docker run -p 8080:8080 ats-trading
```

3. Navigate to `http://localhost:8080` in your browser to verify that the application works correctly.

## Step 6: Configure Google Cloud Project

1. Create a new Google Cloud project (if you don't have one already):

```bash
gcloud projects create ats-trading-project --name="ATS Trading System"
```

2. Set the project as your default:

```bash
gcloud config set project ats-trading-project
```

3. Enable required APIs:

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

## Step 7: Set Up Artifact Registry

1. Create a Docker repository in Artifact Registry:

```bash
gcloud artifacts repositories create ats-docker-repo \
    --repository-format=docker \
    --location=us-central1 \
    --description="Docker repository for ATS"
```

2. Configure Docker to use Google Cloud credentials:

```bash
gcloud auth configure-docker us-central1-docker.pkg.dev
```

## Step 8: Build and Push the Docker Image to Google Cloud

1. Tag the Docker image for Google Cloud Artifact Registry:

```bash
docker tag ats-trading us-central1-docker.pkg.dev/ats-trading-project/ats-docker-repo/ats-trading:v1
```

2. Push the Docker image to Google Cloud:

```bash
docker push us-central1-docker.pkg.dev/ats-trading-project/ats-docker-repo/ats-trading:v1
```

## Step 9: Deploy to Google Cloud Run

1. Deploy the Docker image to Cloud Run:

```bash
gcloud run deploy ats-trading \
    --image us-central1-docker.pkg.dev/ats-trading-project/ats-docker-repo/ats-trading:v1 \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --set-env-vars="VITE_API_BASE_URL=https://your-production-api-url.com" \
    --memory 512Mi \
    --cpu 1
```

2. Once deployment completes, you'll receive a URL where your application is hosted (e.g., `https://ats-trading-abc123-uc.a.run.app`).

## Step 10: Set Up a Custom Domain (Optional)

1. Verify domain ownership in Google Cloud Console.

2. Map your custom domain to the Cloud Run service:

```bash
gcloud beta run domain-mappings create \
    --service ats-trading \
    --domain app.yourdomain.com \
    --region us-central1
```

3. Update your DNS records as instructed by Google Cloud.

## Step 11: Set Up Continuous Deployment with Cloud Build (Optional)

1. Create a `cloudbuild.yaml` file in your project root:

```yaml
steps:
  # Build the container image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'us-central1-docker.pkg.dev/$PROJECT_ID/ats-docker-repo/ats-trading:$COMMIT_SHA', '.']
  
  # Push the container image to Artifact Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'us-central1-docker.pkg.dev/$PROJECT_ID/ats-docker-repo/ats-trading:$COMMIT_SHA']
  
  # Deploy to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'ats-trading'
      - '--image'
      - 'us-central1-docker.pkg.dev/$PROJECT_ID/ats-docker-repo/ats-trading:$COMMIT_SHA'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
      - '--set-env-vars'
      - 'VITE_API_BASE_URL=https://your-production-api-url.com'

images:
  - 'us-central1-docker.pkg.dev/$PROJECT_ID/ats-docker-repo/ats-trading:$COMMIT_SHA'
```

2. Connect your GitHub repository to Cloud Build:
   - Navigate to Cloud Build in the Google Cloud Console
   - Click "Triggers" > "Create Trigger"
   - Connect your GitHub repository
   - Configure the trigger to use the `cloudbuild.yaml` file

3. Push changes to your repository to trigger automatic deployments.

## Step 12: Monitor and Scale Your Application

1. View logs:

```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=ats-trading" --limit=10
```

2. Set up scaling:

```bash
gcloud run services update ats-trading \
    --concurrency=80 \
    --min-instances=1 \
    --max-instances=10
```

3. Set up monitoring alerts in Google Cloud Console.

## Troubleshooting

### Common Issues and Solutions

1. **Issue**: Application fails to start
   **Solution**: Check logs for errors and verify environment variables

2. **Issue**: Deployment fails
   **Solution**: Ensure Dockerfile is correctly set up and all dependencies are included

3. **Issue**: Application is slow or unresponsive
   **Solution**: Increase memory and CPU allocations in Cloud Run configuration

4. **Issue**: Environment variables not working
   **Solution**: Verify environment variables are set correctly in Cloud Run configuration

### Getting Help

If you encounter issues not covered in this guide:

1. Check Google Cloud documentation for Cloud Run
2. Review Cloud Run error messages in the logs
3. Contact your DevOps team for assistance

## Cost Optimization

Cloud Run charges based on actual usage. To optimize costs:

1. Set appropriate memory and CPU allocations
2. Configure minimum instances based on traffic patterns
3. Monitor usage and adjust allocations as needed
4. Use Cloud Run's auto-scaling capabilities to handle traffic spikes

## Security Considerations

1. Use Secret Manager for sensitive environment variables
2. Enable Cloud Run's built-in security features
3. Implement proper authentication if required
4. Regularly update dependencies to patch security vulnerabilities

## Next Steps

After deploying to Google Cloud Run, consider:

1. Setting up a CI/CD pipeline for automated testing and deployment
2. Implementing monitoring and alerting for your application
3. Configuring regular backups of your data
4. Establishing a disaster recovery plan

Congratulations! Your ATS application is now deployed on Google Cloud Run.