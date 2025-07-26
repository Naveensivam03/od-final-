# OD Processing System

A comprehensive web application for managing On-Duty (OD) requests in educational institutions. This system streamlines the process of submitting, reviewing, and approving OD requests for students, with role-based access for students, teachers (mentors and class advisors), and administrators.

## 🌟 Features

### For Students
- **Submit OD Requests**: Create detailed OD applications with date/time ranges, descriptions, and supporting documents
- **Track Status**: Monitor the approval status of submitted requests in real-time
- **View History**: Access complete history of all OD requests
- **Profile Management**: View personal profile with mentor and class advisor information

### For Teachers
- **Review Requests**: Approve or reject OD requests from mentees and class students
- **Dashboard Analytics**: View statistics and insights about OD requests
- **Email Notifications**: Automatic notifications for new requests and status updates
- **Multi-role Support**: Handle both mentor and class advisor responsibilities

### For Administrators
- **System Management**: Oversee all OD requests across the institution
- **User Management**: Manage student-teacher relationships and assignments
- **Reports & Analytics**: Generate comprehensive reports on OD patterns

### System Features
- **Email Integration**: Automated email notifications for all stakeholders
- **File Upload**: Support for uploading supporting documents
- **Real-time Updates**: Live status updates and notifications
- **Responsive Design**: Mobile-friendly interface using Material-UI
- **Secure Authentication**: JWT-based authentication with role-based access control

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern UI framework
- **Material-UI (MUI)** - Component library and design system
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **Vite** - Fast build tool and development server

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **Nodemailer** - Email service integration
- **Multer** - File upload handling
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
od-final-/
├── OD-Processing-System-main/          # Main application
│   ├── src/
│   │   ├── components/                 # Reusable UI components
│   │   │   ├── TeacherCard/           # Teacher dashboard components
│   │   │   ├── admin/                 # Admin panel components
│   │   │   ├── common/                # Shared components (Navbar)
│   │   │   └── form/                  # Form components
│   │   ├── views/                     # Page components
│   │   │   ├── StudentHome/           # Student dashboard
│   │   │   ├── TeacherHome/           # Teacher dashboard
│   │   │   └── LoginPage/             # Authentication
│   │   ├── routers/                   # Route configuration
│   │   ├── styles/                    # CSS stylesheets
│   │   └── config.js                  # API configuration
│   ├── backend/                       # Backend server
│   │   ├── server.js                  # Main server file
│   │   ├── uploads/                   # File storage
│   │   └── .env                       # Environment variables
│   └── public/                        # Static assets
├── backend/                           # Separate backend instance
└── package.json                       # Root package configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB installation
- Gmail account for email notifications

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Naveensivam03/od-final-.git
   cd od-final-
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd OD-Processing-System-main
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   ```

3. **Environment Configuration**

   Create environment files with the required configurations:

   **Frontend (.env in OD-Processing-System-main/)**
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```

   **Backend (.env in OD-Processing-System-main/backend/)**
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   EMAIL=your_gmail_address
   EMAIL_PASSWORD=your_gmail_app_password
   PORT=5000
   ```

4. **Database Setup**
   - Create a MongoDB Atlas cluster or use local MongoDB
   - Update the `MONGODB_URI` in your backend `.env` file
   - The application will automatically create necessary collections

5. **Email Configuration**
   - Enable 2-factor authentication on your Gmail account
   - Generate an App Password for your Gmail account
   - Use the App Password in the `EMAIL_PASSWORD` field

### Running the Application

#### Development Mode

**Option 1: Run components separately**
```bash
# Terminal 1: Start the backend server
cd OD-Processing-System-main/backend
npm start

# Terminal 2: Start the frontend development server
cd OD-Processing-System-main
npm run dev
```

**Option 2: Use root scripts**
```bash
# Start frontend from root
npm run dev

# Or use the frontend alias
npm run frontend
```

#### Production Mode
```bash
cd OD-Processing-System-main
npm run build
npm run preview
```

### Default Access URLs
- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend API**: http://localhost:5000
- **Production Frontend**: https://od-final.onrender.com

## 🔐 Authentication & User Roles

The system supports three user roles with different access levels:

### Student
- Submit new OD requests
- View request history and status
- Upload supporting documents
- Receive email notifications

### Teacher (Mentor/Class Advisor)
- Review and approve/reject OD requests
- View mentee/student profiles
- Access analytics dashboard
- Receive email notifications for new requests

### Admin
- System-wide oversight
- User management
- Generate reports
- Full access to all features

## 📧 Email Notifications

The system sends automated emails for:
- New OD request submissions (to mentors)
- Mentor approvals (to class advisors)
- Final approvals (to students and handling teachers)
- Request rejections (to students)

## 🔧 Configuration

### API Endpoints
All API endpoints are centralized in `src/config.js`:
- Student operations
- Teacher operations
- Authentication
- File uploads

### Environment Variables
- `VITE_BACKEND_URL`: Backend server URL
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT signing secret
- `EMAIL`: Gmail address for notifications
- `EMAIL_PASSWORD`: Gmail app password

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes and orientations

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- Secure file upload handling
- CORS configuration

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variable: `VITE_BACKEND_URL=https://your-backend-url.com`
3. Deploy automatically on git push

### Backend (Render/Heroku)
1. Create a new service on Render or Heroku
2. Connect your repository
3. Set all required environment variables
4. Deploy and note the production URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## 👥 Support

For support and questions:
- Create an issue on [GitHub Issues](https://github.com/Naveensivam03/od-final-/issues)
- Contact the development team

## 🎯 Future Enhancements

- [ ] Mobile app development
- [ ] Advanced analytics and reporting
- [ ] Integration with academic calendar
- [ ] Bulk operations for administrators
- [ ] SMS notifications
- [ ] Document verification system
- [ ] Multi-language support

---

**Built with ❤️ for educational institutions to streamline their OD management process.**
