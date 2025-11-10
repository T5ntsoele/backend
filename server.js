const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Initialize Firebase Admin
const { db } = require('./config/firebase');

// CORS Configuration - REPLACE THIS PART
const allowedOrigins = [
  'https://your-firebase-app.web.app',        // Your Firebase domain
  'https://your-firebase-app.firebaseapp.com', // Your Firebase alternate domain
  'http://localhost:3000'                     // Local development
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/institute', require('./routes/institute'));
app.use('/api/student', require('./routes/student'));
app.use('/api/company', require('./routes/company'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/notifications', require('./routes/notifications'));

// Add a health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS enabled for: ${allowedOrigins.join(', ')}`);
});
