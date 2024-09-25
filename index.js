import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import courseRoutes from './routes/course.js';
import usersRoutes from './routes/user.js';
import announcementRoutes from './routes/announcement.js';
import cors from 'cors';
import assignmentRoutes from './routes/assignment.js';

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

// Initialize the app
const app = express();

// Middleware
app.use(express.json()); // For parsing JSON request bodies
app.use(cookieParser()); // For parsing cookies
app.use(cors(
  {
    origin: 'https://imonyaa.github.io',
    credentials: true,
  }
));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Educational Platform API');
});
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/assignments', assignmentRoutes);

// Define port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
