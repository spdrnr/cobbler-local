# Render.com Deployment Guide

This guide will help you deploy your Cobbler CRM application to Render.com.

## Prerequisites

- **Render.com account** (free tier available)
- **GitHub repository** with your code
- **MySQL database** (you can use Render's MySQL service or external provider)

## Step 1: Prepare Your Repository

### 1.1 Ensure Required Files Exist
Make sure these files are in your repository root:
- ✅ `Dockerfile` (multi-stage build)
- ✅ `.dockerignore` (optimizes build)
- ✅ `package.json` (frontend)
- ✅ `backend/package.json` (backend)
- ✅ `backend/src/app.ts` (updated to serve static files)

### 1.2 Environment Variables
Create a `.env.example` file in your repository root for reference:

```bash
# Database Configuration
DB_HOST=your-mysql-host
DB_PORT=3306
DB_USER=your-mysql-user
DB_PASSWORD=your-mysql-password
DB_NAME=cobbler_crm
DB_CONNECTION_LIMIT=10

# Server Configuration
PORT=3001
NODE_ENV=production

# Authentication
X_TOKEN_SECRET=your-super-secret-token-here
X_TOKEN_EXPIRY=24h

# CORS (for production)
CORS_ORIGIN=https://your-app-name.onrender.com

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=./logs
LOG_MAX_SIZE=20m
LOG_MAX_FILES=14d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Step 2: Set Up MySQL Database

### Option A: Render MySQL Service (Recommended)

1. **Create MySQL Database:**
   - Go to Render Dashboard
   - Click "New" → "MySQL"
   - Choose "Free" plan
   - Set database name: `cobbler_crm`
   - Set username and password
   - Note the connection details

2. **Database Connection Details:**
   - **Host**: `your-db-name.render.com`
   - **Port**: `5432` (Render uses PostgreSQL port)
   - **Database**: `cobbler_crm`
   - **Username**: Your chosen username
   - **Password**: Your chosen password

### Option B: External MySQL Provider
- **PlanetScale** (free tier available)
- **Railway** (free tier available)
- **AWS RDS** (paid)
- **DigitalOcean Managed MySQL** (paid)

## Step 3: Deploy to Render

### 3.1 Create Web Service

1. **Connect Repository:**
   - Go to Render Dashboard
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

2. **Configure Service:**
   ```
   Name: cobbler-crm
   Environment: Docker
   Region: Choose closest to you
   Branch: main (or your default branch)
   Root Directory: . (leave empty for root)
   ```

3. **Build & Deploy Settings:**
   ```
   Build Command: (leave empty - Docker handles this)
   Start Command: (leave empty - Docker handles this)
   ```

### 3.2 Environment Variables

Add these environment variables in Render:

```bash
# Database Configuration
DB_HOST=your-mysql-host.render.com
DB_PORT=3306
DB_USER=your-mysql-username
DB_PASSWORD=your-mysql-password
DB_NAME=cobbler_crm
DB_CONNECTION_LIMIT=10

# Server Configuration
PORT=3001
NODE_ENV=production

# Authentication
X_TOKEN_SECRET=cobbler_super_secret_token_2024
X_TOKEN_EXPIRY=24h

# CORS (update with your actual Render URL)
CORS_ORIGIN=https://your-app-name.onrender.com

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=./logs
LOG_MAX_SIZE=20m
LOG_MAX_FILES=14d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3.3 Advanced Settings

1. **Health Check Path:** `/health`
2. **Auto-Deploy:** Enabled (recommended)
3. **Plan:** Free (or paid for better performance)

## Step 4: Update Frontend Configuration

### 4.1 Update API Base URL

Once deployed, update your frontend environment variables:

```bash
# src/.env.local (for local development)
VITE_API_BASE_URL=http://localhost:3001

# For production (update with your Render URL)
VITE_API_BASE_URL=https://your-app-name.onrender.com
```

### 4.2 Update CORS in Backend

Make sure your backend CORS configuration includes your Render URL:

```typescript
// In backend/src/app.ts
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:8080',
    'http://localhost:8081',
    'http://localhost:3000',
    'https://your-app-name.onrender.com' // Add your Render URL
  ],
  // ... rest of config
}));
```

## Step 5: Deploy and Test

### 5.1 Deploy
1. Click "Create Web Service"
2. Render will build and deploy your application
3. Monitor the build logs for any issues

### 5.2 Test Your Application
1. **Health Check:** `https://your-app-name.onrender.com/health`
2. **API Test:** `https://your-app-name.onrender.com/api/enquiries`
3. **Frontend:** `https://your-app-name.onrender.com`

### 5.3 Common Issues and Solutions

#### Issue: Build Fails
- **Solution:** Check build logs for missing dependencies
- **Fix:** Ensure all `package.json` files are correct

#### Issue: Database Connection Fails
- **Solution:** Verify database credentials and network access
- **Fix:** Check if database allows external connections

#### Issue: CORS Errors
- **Solution:** Update CORS configuration with correct origins
- **Fix:** Add your Render URL to allowed origins

#### Issue: Static Files Not Served
- **Solution:** Check if frontend build is in correct location
- **Fix:** Verify Dockerfile copies files to `/app/public`

## Step 6: Custom Domain (Optional)

1. **Add Custom Domain:**
   - Go to your Render service
   - Click "Settings" → "Custom Domains"
   - Add your domain
   - Update DNS records as instructed

2. **SSL Certificate:**
   - Render provides free SSL certificates
   - Automatically configured for custom domains

## Step 7: Monitoring and Logs

### 7.1 View Logs
- Go to your Render service
- Click "Logs" tab
- Monitor application logs in real-time

### 7.2 Health Monitoring
- Render automatically monitors your `/health` endpoint
- Service will restart if health checks fail

### 7.3 Performance Monitoring
- Free tier: Basic metrics
- Paid tiers: Advanced monitoring and alerts

## Step 8: Database Management

### 8.1 Access Database
- **Render MySQL:** Use provided connection details
- **External MySQL:** Use your provider's tools

### 8.2 Backup Strategy
- **Render MySQL:** Automatic backups (paid plans)
- **External MySQL:** Configure with your provider

## Troubleshooting

### Build Issues
```bash
# Check Docker build locally
docker build -t cobbler-crm .

# Test locally
docker run -p 3001:3001 cobbler-crm
```

### Database Issues
```bash
# Test database connection
mysql -h your-host -u your-user -p your-database

# Check if tables exist
SHOW TABLES;
```

### Performance Issues
- **Free Tier Limitations:** 750 hours/month, 512MB RAM
- **Upgrade Options:** Paid plans for better performance
- **Optimization:** Enable caching, optimize queries

## Security Considerations

1. **Environment Variables:** Never commit secrets to Git
2. **Database Security:** Use strong passwords, limit access
3. **API Security:** Rate limiting, input validation
4. **HTTPS:** Always use HTTPS in production

## Cost Optimization

### Free Tier Limits
- **Web Services:** 750 hours/month
- **MySQL:** 90 days free trial
- **Bandwidth:** 100GB/month

### Paid Plans
- **Web Services:** $7/month for always-on
- **MySQL:** $7/month for persistent database
- **Custom Domains:** Free with paid plans

## Support

- **Render Documentation:** https://render.com/docs
- **Community Forum:** https://community.render.com
- **Email Support:** Available for paid plans

---

**Next Steps:**
1. Deploy your application following this guide
2. Test all functionality in production
3. Set up monitoring and alerts
4. Configure backups for your database
5. Consider upgrading to paid plans for production use
