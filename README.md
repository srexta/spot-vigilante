# Spot Vigilante - Vigilante Activity Reporting System

A secure web application for reporting and tracking vigilante group activities with photo/video evidence and location tracking.

## Features

- 🔐 **Secure Authentication** - JWT-based authentication with rate limiting
- 📸 **Media Upload** - Photo and video evidence support via Cloudinary
- 📍 **Location Tracking** - GPS coordinates and address-based location reporting
- 🛡️ **Rate Limiting** - Prevents spam with configurable limits (5 submissions/day per user)
- 📊 **Dashboard** - View and manage all reports with filtering and search
- 🎨 **Modern UI** - Responsive design with Tailwind CSS and Radix UI components
- 🗄️ **Database** - PostgreSQL with Prisma ORM for scalability

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT tokens with bcrypt password hashing
- **File Storage**: Cloudinary for images and videos
- **Rate Limiting**: Custom implementation with database tracking
- **UI Components**: Radix UI primitives with custom styling

## Security Features

- **Rate Limiting**: 
  - 5 submissions per day per user
  - 5 login attempts per 15 minutes per IP
  - 3 registrations per hour per IP
- **Password Security**: bcrypt hashing with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: Zod schema validation for all inputs
- **File Upload Security**: Cloudinary integration with size limits

## Database Schema

### Users
- User authentication and profile information
- Rate limiting tracking per user

### Submissions
- Report details (title, description, location)
- GPS coordinates (latitude, longitude)
- Timestamp of when activity was spotted
- Media attachments (images, video URLs)
- Status tracking (pending, approved, rejected, investigating)

### Rate Limits
- IP-based and user-based rate limiting
- Configurable time windows and limits

## Setup Instructions

### 1. Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Cloudinary account (for media storage)

### 2. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd spot-vigilante

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### 3. Environment Configuration

Edit `.env.local` with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/spot_vigilante"

# JWT Secret (generate a strong secret)
JWT_SECRET="your-super-secret-jwt-key-here"

# Cloudinary (for image/video storage)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Open Prisma Studio to view data
npm run db:studio
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

### Database Setup for Production

For production, use a managed PostgreSQL service:
- **Vercel Postgres** (if deploying to Vercel)
- **Supabase** (free tier available)
- **Railway** (PostgreSQL hosting)
- **AWS RDS** (for enterprise)

## Usage

### For Users
1. **Register/Login**: Create an account or login
2. **Submit Report**: Fill out the form with:
   - Report title and description
   - Location details (address + optional GPS)
   - When the activity was spotted
   - Upload photos or provide video links
3. **View Dashboard**: See all your submissions and their status

### For Administrators
1. **Access Dashboard**: Login and navigate to `/dashboard`
2. **Review Reports**: Filter by status, search reports
3. **Update Status**: Change report status (pending → investigating → approved/rejected)

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Submissions
- `POST /api/submissions` - Create new submission
- `GET /api/submissions` - Get submissions (paginated)

## Rate Limiting

The system implements comprehensive rate limiting:

- **Submissions**: 5 per day per user
- **Login Attempts**: 5 per 15 minutes per IP
- **Registration**: 3 per hour per IP

Rate limits are stored in the database and automatically cleaned up.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the GitHub repository.

---

**Important Security Note**: This application is designed for legitimate reporting of suspicious activities. Ensure compliance with local laws and regulations regarding surveillance and reporting systems.