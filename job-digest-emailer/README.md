# EU Jobs Digest Emailer

A clean, modular Express.js server that sends personalized job digest emails using Brevo (Sendinblue) API and MongoDB.

## Features

- ✅ Send welcome emails with job preference buttons (junior/middle/senior)
- ✅ Store user preferences in MongoDB
- ✅ Send daily job digests with featured + latest jobs based on preferences
- ✅ Clean, modular architecture with separate services
- ✅ Admin panel for managing jobs
- ✅ Rate limiting and security middleware
- ✅ Comprehensive error handling

## Architecture

```
job-digest-emailer/
├── services/           # Business logic
│   ├── emailService.js    # Brevo API integration
│   ├── userService.js     # User management
│   └── jobService.js      # Job management
├── routes/             # API routes
│   ├── emailRoutes.js     # Email endpoints
│   └── adminRoutes.js     # Admin endpoints
├── utils/              # Utilities
│   └── db.js              # MongoDB connection
├── index.js            # Main server file
├── jobsMailer.js       # Daily digest script
└── package.json
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/job-digest-emailer

# Brevo (Sendinblue) Email Configuration
BREVO_API_KEY=your_brevo_api_key_here
SENDER_NAME=EU Jobs
SENDER_EMAIL=you@eujobs.co

# Application Configuration
DOMAIN_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Admin Configuration
ADMIN_KEY=your_secure_admin_key_here
```

### 3. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Email Routes (`/api/email`)

#### Send Welcome Email
```
GET /api/email/send-welcome?email=user@example.com
```

#### Update Preferences
```
GET /api/email/preferences?email=user@example.com&level=junior
```

#### Unsubscribe
```
GET /api/email/unsubscribe?email=user@example.com
```

### Admin Routes (`/api/admin`)

All admin routes require the `x-admin-key` header.

#### Add Job
```bash
curl -X POST http://localhost:3000/api/admin/jobs \
  -H "Content-Type: application/json" \
  -H "x-admin-key: your_admin_key" \
  -d '{
    "title": "Software Engineer",
    "company": "Tech Corp",
    "description": "Exciting role...",
    "url": "https://example.com/job",
    "level": "senior",
    "location": "Remote",
    "salary": "$100k-150k",
    "featured": true
  }'
```

#### Add Multiple Jobs
```bash
curl -X POST http://localhost:3000/api/admin/jobs/bulk \
  -H "Content-Type: application/json" \
  -H "x-admin-key: your_admin_key" \
  -d '{
    "jobs": [
      {
        "title": "Frontend Developer",
        "company": "Startup Inc",
        "url": "https://example.com/job1",
        "level": "junior"
      },
      {
        "title": "Backend Engineer",
        "company": "Big Corp",
        "url": "https://example.com/job2",
        "level": "senior"
      }
    ]
  }'
```

#### Get Statistics
```bash
curl -X GET http://localhost:3000/api/admin/stats \
  -H "x-admin-key: your_admin_key"
```

#### Search Jobs
```bash
curl -X GET "http://localhost:3000/api/admin/jobs/search?q=engineer&level=senior" \
  -H "x-admin-key: your_admin_key"
```

## Daily Digest

### Send Daily Digests
```bash
npm run send-digest:send
```

### Test Digest for Specific Email
```bash
npm run send-digest:test user@example.com
```

### Manual Digest Script
```bash
node jobsMailer.js send
node jobsMailer.js test user@example.com
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String,
  preferences: {
    level: String // "junior", "middle", "senior"
  },
  subscribed: Boolean,
  createdAt: Date,
  updatedAt: Date,
  lastSent: Date,
  emailSent: Number,
  unsubscribedAt: Date
}
```

### Jobs Collection
```javascript
{
  _id: ObjectId,
  title: String,
  company: String,
  description: String,
  url: String,
  level: String, // "junior", "middle", "senior"
  location: String,
  salary: String,
  featured: Boolean,
  createdAt: Date,
  datePosted: Date,
  updatedAt: Date
}
```

## Email Templates

The system includes beautiful, responsive email templates:

- **Welcome Email**: Clean design with preference buttons
- **Preferences Confirmation**: Confirms user selections
- **Daily Digest**: Featured and latest jobs with rich formatting
- **Unsubscribe Confirmation**: Graceful exit with resubscribe option

## Security Features

- ✅ Helmet.js for security headers
- ✅ CORS configuration
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ Input validation
- ✅ Admin key authentication
- ✅ Error handling without exposing internals

## Development

### Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run send-digest:send    # Send daily digests
npm run send-digest:test    # Test digest for specific email
```

### Health Check

```bash
curl http://localhost:3000/health
```

## Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3000
MONGO_URI=mongodb://your-production-mongo-uri
BREVO_API_KEY=your-production-brevo-key
DOMAIN_URL=https://yourdomain.com
ADMIN_KEY=your-secure-production-admin-key
```

### Cron Job for Daily Digests

Add to your crontab:
```bash
0 9 * * * cd /path/to/job-digest-emailer && npm run send-digest:send
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC 