# AI Career Coach

A full-stack web application that provides AI-powered career guidance, resume building, interview preparation, and industry insights.

## 🚀 Features

### Landing Page
- **Hero Section**: Compelling call-to-action with "Accelerate Your Career with AI-Powered Guidance"
- **Features Section**: Four key features with interactive cards
- **How It Works**: Step-by-step process visualization
- **Testimonials**: User success stories
- **Call-to-Action**: Interactive AI chatbot for instant career guidance

### Core Features
- **AI-Powered Career Guidance**: Personalized recommendations based on skills and experience
- **Smart Resume Creation**: Professional resume builder with AI assistance
- **Interview Preparation**: Interactive quizzes and mock interviews
- **Industry Insights**: Trending skills, salary data, and market analysis
- **Progress Tracking**: Comprehensive dashboard with analytics
- **Profile Management**: Edit profile information and update skills
- **Password Management**: Secure password change functionality
- **Newsletter Notifications**: Real-time subscription alerts in dashboard

### Technical Features
- **Dark Mode**: Seamless theme switching
- **Responsive Design**: Mobile-first approach with professional UI
- **Real-time Chat**: AI-powered career assistance
- **User Authentication**: Secure registration and login with JWT
- **Dashboard Analytics**: Progress tracking and recommendations
- **Settings Page**: Comprehensive profile and password management
- **Notification System**: Bell icon with dropdown notifications

## 🛠️ Tech Stack

### Frontend
- **React.js 18** with TypeScript
- **Tailwind CSS** for styling
- **Heroicons** for icons
- **Framer Motion** for animations

### Backend
- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing

### Additional Libraries
- **Helmet** for security
- **CORS** for cross-origin requests
- **Express Rate Limit** for API protection
- **Multer** for file uploads

## 📁 Project Structure

```
ai-career-coach/
├── frontend/                 # React.js application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── HowItWorksSection.tsx
│   │   │   ├── TestimonialsSection.tsx
│   │   │   ├── CTASection.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── pages/           # Page components
│   │   │   └── Dashboard.tsx
│   │   ├── App.tsx          # Main app component
│   │   └── index.css        # Global styles
│   ├── package.json
│   └── tailwind.config.js
├── backend/                  # Node.js/Express API
│   ├── src/
│   │   ├── models/          # Database models
│   │   │   ├── User.ts
│   │   │   └── Resume.ts
│   │   ├── routes/          # API routes
│   │   │   ├── auth.ts
│   │   │   ├── user.ts
│   │   │   ├── resume.ts
│   │   │   ├── quiz.ts
│   │   │   └── ai.ts
│   │   ├── middleware/      # Custom middleware
│   │   │   └── auth.ts
│   │   └── server.ts        # Main server file
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-career-coach
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Environment Setup**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   ```

   **Important: OpenAI API Setup** (Required for AI features)
   1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   2. Sign up or log in to your OpenAI account
   3. Create a new API key
   4. Copy the API key and update your `.env` file:
      ```env
      OPENAI_API_KEY=sk-your-actual-openai-api-key-here
      ```
   5. **Note**: The AI chat will work with mock responses if no API key is provided, but real AI features require a valid OpenAI API key.

5. **Build the Backend**
   ```bash
   npm run build
   ```

6. **Build the Frontend**
   ```bash
   cd ../frontend
   npm run build
   ```

### Running the Application

#### Development Mode

1. **Start the Backend**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm start
   ```

#### Production Mode

1. **Start the Backend**
   ```bash
   cd backend
   npm start
   ```

2. **Serve the Frontend**
   ```bash
   cd frontend
   npm install -g serve
   serve -s build
   ```

## 🎨 UI/UX Design

### Color Scheme
- **Primary**: Deep Blue/Navy (#1A237E)
- **Secondary**: Teal/Aqua (#00ACC1)
- **Accent**: Gold/Yellow (#FFC107)
- **Background**: Light Gray (#F5F5F5) / Dark Mode (#121212)

### Typography
- **Headings**: Poppins (Bold, Sans-serif)
- **Body**: Open Sans (Readable, Sans-serif)
- **Buttons**: Bold and uppercase for emphasis

### Features
- Smooth scroll transitions
- Hover effects on cards and buttons
- Professional animations
- Fully responsive design
- Dark mode support

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/dashboard` - Get dashboard data

### Resume Management
- `POST /api/resume/create` - Create new resume
- `GET /api/resume/list` - Get user's resumes
- `GET /api/resume/:id` - Get specific resume
- `PUT /api/resume/:id` - Update resume
- `DELETE /api/resume/:id` - Delete resume

### Quiz System
- `GET /api/quiz/types` - Get available quiz types
- `GET /api/quiz/:type/questions` - Get quiz questions
- `POST /api/quiz/:type/submit` - Submit quiz answers

### AI Features
- `POST /api/ai/chat` - AI career chat
- `GET /api/ai/insights` - Industry insights
- `POST /api/ai/career-paths` - Career path recommendations

## 🌟 Key Components

### Landing Page Components
- **HeroSection**: Main header with call-to-action
- **FeaturesSection**: Four feature highlights
- **HowItWorksSection**: Process explanation
- **TestimonialsSection**: User testimonials (to be implemented)
- **CTASection**: Interactive AI chat modal

### Dashboard Components
- **User Stats**: Progress tracking cards
- **Job Recommendations**: AI-powered role suggestions
- **Recent Activities**: Activity timeline
- **Quick Actions**: Fast access to features

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Rate limiting on API endpoints
- CORS protection
- Helmet for security headers
- Input validation and sanitization

## 🚀 Deployment

The application is ready for deployment on platforms like:
- **Frontend**: Vercel, Netlify, or AWS S3
- **Backend**: Heroku, Railway, or AWS EC2
- **Database**: MongoDB Atlas

## 📝 Environment Variables

Required environment variables for the backend:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ai-career-coach
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000

# OpenAI API Key (Required for AI features)
# Get your key from https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your-actual-openai-api-key-here

# Optional: Email configuration for password reset
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
```

**Note**: The application will work without an OpenAI API key, but AI features will use mock responses instead of real AI-powered interactions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email support@aicareercoach.com or join our community discussions.