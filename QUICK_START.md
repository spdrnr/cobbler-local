# Quick Start Reference

## Essential Commands

### Database Setup
```bash
# Start MySQL
brew services start mysql

# Create database and user
mysql -u root -p
CREATE DATABASE cobbler_crm;
CREATE USER 'cobbler_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON cobbler_crm.* TO 'cobbler_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
mkdir -p logs
npm run dev
```

### Frontend Setup
```bash
# In project root
cp src/.env.example src/.env.local
# Edit src/.env.local with API URL and token
npm run dev
```

### Test Backend
```bash
# Health check
curl http://localhost:3001/health

# Test API
curl -X GET 'http://localhost:3001/api/enquiries' \
  -H 'X-Token: cobbler_super_secret_token_2024'
```

## Environment Files

### Backend (.env)
```env
PORT=3001
DB_HOST=localhost
DB_USER=cobbler_user
DB_PASSWORD=your_password
DB_NAME=cobbler_crm
X_TOKEN_SECRET=cobbler_super_secret_token_2024
CORS_ORIGIN=http://localhost:8080,http://localhost:8081,http://localhost:8082,http://localhost:8083,http://localhost:8084
```

### Frontend (src/.env.local)
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_X_TOKEN=cobbler_super_secret_token_2024
```

## Troubleshooting

### Common Issues
1. **MySQL not running**: `brew services start mysql`
2. **Port 3001 in use**: `lsof -i :3001` then `kill -9 <PID>`
3. **CORS errors**: Check CORS_ORIGIN in backend .env
4. **Auth errors**: Ensure X_TOKEN_SECRET matches VITE_X_TOKEN

### Logs Location
- Backend logs: `backend/logs/`
- Check `application.log`, `error.log`, `database.log`, `api.log`

## URLs
- **Backend API**: http://localhost:3001
- **Frontend**: http://localhost:8080 (or next available port)
- **Health Check**: http://localhost:3001/health
- **API Docs**: Check the main setup.md for full documentation
