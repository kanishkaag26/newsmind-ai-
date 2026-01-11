const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for development (change for production)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files (for audio files)
app.use('/uploads', express.static('uploads'));

// MongoDB Connection with Index Cleanup
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/summarizer');
    console.log('✅ MongoDB Connected Successfully');
    console.log('📊 Database:', mongoose.connection.name);
    
    // Clean up old indexes that cause duplicate key errors
    try {
      const db = mongoose.connection.db;
      const collections = await db.listCollections().toArray();
      
      // Check if summaries collection exists
      const summariesExists = collections.some(col => col.name === 'summaries');
      
      if (summariesExists) {
        const indexes = await db.collection('summaries').indexes();
        console.log('📋 Existing indexes:', indexes.map(i => i.name).join(', '));
        
        // Drop old 'id_1' index if it exists
        const hasOldIndex = indexes.some(i => i.name === 'id_1');
        if (hasOldIndex) {
          await db.collection('summaries').dropIndex('id_1');
          console.log('✅ Removed old "id_1" index');
        }
      }
    } catch (indexErr) {
      // Index might not exist, that's okay
      console.log('ℹ️ No problematic indexes found (this is good)');
    }
    
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('Retrying in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

connectDB();

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err.message);
});

// Routes
app.use('/api/summary', require('./routes/summary'));
app.use('/api/debate', require('./routes/debate'));
app.use('/api/history', require('./routes/history'));
// Add this line with your other routes
app.use('/api/auth', require('./routes/auth'));

// Health Check
app.get('/', (req, res) => {
  res.json({ 
    status: 'success',
    message: 'News AI Summarizer API is running!',
    version: '1.0.0',
    endpoints: {
      summary: '/api/summary',
      debate: '/api/debate',
      history: '/api/history'
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    status: 'error',
    message: 'Endpoint not found' 
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    status: 'error',
    message: err.message || 'Internal server error' 
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 Access from other devices: http://YOUR_IP:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/`);
});