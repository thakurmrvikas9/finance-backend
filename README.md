# Finance Dashboard Backend API

A robust, production-ready RESTful API built with Node.js, Express, and MongoDB. This system is designed to manage personal or business financial records with advanced features like role-based security, real-time analytics, and data persistence.

## 🚀 Key Features

### Secure Authentication
JWT-based stateless authentication with password hashing using Bcrypt.

### Role-Based Access Control (RBAC)
- **Admin**: Full management of records (Create, Read, Update, Delete)
- **Analyst**: Can view records and access high-level Dashboard Summaries
- **Viewer**: Restricted to read-only access for financial entries

### Advanced Financial Analytics
- **Dashboard Aggregation**: Uses MongoDB Aggregation Pipelines to calculate Total Income, Total Expenses, and Net Balance in a single query
- **Category-wise Totals**: Grouped data for visual charts

### Data Management
- **Search**: Search through transactions by description or category
- **Pagination**: Optimized for performance with large datasets
- **Soft Deletes**: Records are marked as deleted rather than removed, allowing for data recovery

### API Security
- **Rate Limiting**: Protection against brute-force attacks
- **CORS**: Configured for secure frontend-to-backend communication
- **Interactive Documentation**: Integrated Swagger UI for testing endpoints directly in the browser

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| Node.js (ES Modules) | Runtime Environment |
| Express.js | Web Framework |
| MongoDB | Database |
| Mongoose | ODM (Object Document Mapper) |
| JSON Web Tokens (JWT) | Authentication |
| Bcryptjs | Password Hashing |
| Express-Rate-Limit | Rate Limiting |
| Swagger JSDoc & UI | API Documentation |

## 📂 Project Structure

```
finance-backend/
├── src/
│   ├── config/         # Database connection setup
│   ├── controllers/    # Business logic & Aggregation queries
│   ├── middleware/     # Auth & RBAC security guards
│   ├── models/         # MongoDB Schemas (User, Record)
│   ├── routes/         # API Endpoint definitions
│   └── app.js          # Express configuration & Auth routes
├── .env                # Environment secrets (Port, DB URI, JWT Secret)
├── server.js           # Application Entry Point
└── package.json        # Dependencies & NPM scripts
```

## ⚙️ Installation & Setup

### Clone the repository:
```bash
git clone <your-repo-link>
cd finance-backend
```

### Install dependencies:
```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory and add:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_random_secure_string
NODE_ENV=development
```

### Run the application:
```bash
# Start production server
node server.js

# Start development server with hot reload
npm run dev
```

## 📖 API Documentation

The project includes an interactive documentation page. Once the server is running, visit:

👉 **http://localhost:5000/api-docs**

## 🚦 API Endpoints Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create a new user account |
| POST | `/api/auth/login` | Login and receive a JWT Bearer Token |

### Financial Records

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/records/summary` | Admin, Analyst | Get Dashboard stats (Balance, Totals) |
| GET | `/api/records` | All Roles | List records with Search & Pagination |
| POST | `/api/records` | Admin | Create a new financial entry |
| DELETE | `/api/records/:id` | Admin | Soft delete a record (move to trash) |

## 🧪 Testing the API Lifecycle

1. **Register**: Create an admin user via `/api/auth/register`
   ```json
   {
     "name": "Admin User",
     "email": "admin@example.com",
     "password": "SecurePassword123",
     "role": "admin"
   }
   ```

2. **Login**: Use the `/api/auth/login` endpoint to receive your token
   ```json
   {
     "email": "admin@example.com",
     "password": "SecurePassword123"
   }
   ```

3. **Add Authorized Header**: For all `/api/records` routes, add the header:
   ```
   Authorization: Bearer <YOUR_TOKEN_HERE>
   ```

4. **Create Data**: Add multiple income and expense entries
   ```json
   {
     "description": "Monthly Salary",
     "amount": 5000,
     "category": "Income",
     "type": "income",
     "date": "2026-04-03"
   }
   ```

5. **Analytics**: Check the `/api/records/summary` route to see the calculated balance and category groupings

6. **Pagination**: Test `GET /api/records?page=1&limit=5`

7. **Search**: Test `GET /api/records?search=Salary`

## 🛡️ Security Implementation

### RBAC Middleware
Every protected route checks the user's role before allowing execution:
- Admin users have unrestricted access
- Analyst users can view and generate reports
- Viewer users have read-only access

### JWT Expiration
Tokens are set to expire in 24 hours for security

### DDoS Protection
Rate limiting prevents any single IP from spamming the server:
- Max 100 requests per 15 minutes per IP
- Prevents brute-force attacks on login endpoints

### Data Validation
Mongoose schemas enforce:
- Data types validation
- Required field validation
- Email format validation
- Amount range validation

### Additional Security Measures
- Passwords hashed with Bcrypt (10 salt rounds)
- No sensitive data in JWT payload
- CORS configured to accept requests only from authorized domains
- Helmet.js headers for XSS protection
- MongoDB injection prevention through Mongoose

## 🧑‍💻 Getting Started Guide

### For Developers
1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file with required variables
4. Start the server: `npm run dev`
5. Access Swagger UI at `http://localhost:5000/api-docs`

### For DevOps
1. Ensure MongoDB Atlas cluster is accessible
2. Set environment variables in production environment
3. Deploy using Docker or your preferred platform
4. Monitor API health via status endpoint
5. Set up logging and error tracking

## 📝 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| PORT | Yes | Server port (default: 5000) |
| MONGO_URI | Yes | MongoDB connection string |
| JWT_SECRET | Yes | Secret key for JWT token generation |
| NODE_ENV | No | Environment (development/production) |
| RATE_LIMIT_WINDOW | No | Rate limit window in minutes (default: 15) |
| RATE_LIMIT_MAX | No | Max requests per window (default: 100) |

## 🐛 Troubleshooting

### MongoDB Connection Error
- Verify `MONGO_URI` is correct
- Check MongoDB Atlas cluster is active
- Ensure IP whitelist allows your current IP

### JWT Token Invalid
- Check `JWT_SECRET` matches between sessions
- Verify token hasn't expired
- Ensure token is passed in Authorization header

### Rate Limit Exceeded
- Wait 15 minutes for the limit to reset
- Use different IP address (for testing)
- Adjust `RATE_LIMIT_MAX` in `.env` (for development)

## 📞 Support & Contributions

### Report Issues
Open an issue on GitHub with:
- Detailed description
- Steps to reproduce
- Expected vs actual behavior
- Your environment (Node version, OS, etc.)

### Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💼 Author

**Vikash Thakur**
- Backend Developer
- GitHub: [@thakurmrvikas9](https://github.com/thakurmrvikas9)
- Email: thakurmrvikas@gmail.com

---

**Last Updated**: 2026-04-03

**Version**: 1.0.0

For more information and updates, visit the [GitHub Repository](https://github.com/thakurmrvikas9/finance-backend)