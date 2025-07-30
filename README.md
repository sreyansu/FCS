# FeedbackFlow - Modern Feedback Collection System

A comprehensive full-stack feedback collection platform built with Next.js 14+, MongoDB, and modern web technologies.

## 🚀 Features

- **Authentication & Authorization**: Secure login/signup with NextAuth.js and bcrypt
- **Role-Based Access**: Separate dashboards for Users and Admins
- **Form Management**: Create, edit, and manage feedback forms with expiration dates
- **Real-time Analytics**: Interactive charts and data visualization
- **Responsive Design**: Mobile-first design with dark/light theme support
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js with Credentials Provider
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Form Handling**: React Hook Form + Zod
- **Notifications**: react-hot-toast

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB Atlas account (or local MongoDB instance)
- npm or yarn package manager

## 🔧 Installation & Setup

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd feedbackflow
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Environment Setup**
   
   Copy the example environment file:
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`
   
   Update the environment variables:
   \`\`\`env
   MONGODB_URI=mongodb+srv://sreyansu:sreyansu@fms.yu6wcuo.mongodb.net/
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Demo Credentials

The application includes demo accounts for testing:

- **Admin Account**: 
  - Email: admin@demo.com
  - Password: admin123

- **User Account**:
  - Email: user@demo.com  
  - Password: user123

### User Features

- View available feedback forms
- Submit feedback responses
- Track feedback history
- Manage account settings

### Admin Features

- Create and manage feedback forms
- View user analytics and responses
- Export feedback data
- Manage user accounts
- Real-time dashboard with charts

## 📁 Project Structure

\`\`\`
feedbackflow/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── admin/             # Admin dashboard
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   └── dashboard-sidebar.tsx
├── lib/                   # Utility functions
│   └── mongodb.ts        # Database connection
├── models/               # Mongoose models
│   ├── User.ts
│   ├── Form.ts
│   └── Feedback.ts
└── middleware.ts         # Route protection
\`\`\`

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The application is compatible with:
- Railway
- Render
- Heroku
- DigitalOcean App Platform

Make sure to:
1. Set the correct environment variables
2. Ensure MongoDB connection string is accessible
3. Set NEXTAUTH_URL to your production domain

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control
- Protected API routes
- Input validation and sanitization

## 🎨 Customization

### Themes
The application supports light/dark themes. Theme preference is stored locally and persists across sessions.

### Styling
Customize the appearance by modifying:
- `app/globals.css` for global styles
- Tailwind configuration in `tailwind.config.js`
- Component-specific styles

## 📊 Database Schema

### User Model
- name, email, password (hashed)
- role (user/admin)
- timestamps

### Form Model  
- title, description, questions
- start/end dates, creator reference
- response count, active status

### Feedback Model
- form and user references
- answers array, submission timestamp
- unique constraint per user per form

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: support@feedbackflow.com

## 🔄 Updates

Stay updated with the latest features and improvements by watching the repository.
