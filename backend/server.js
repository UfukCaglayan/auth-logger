const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const path = require('path');
const securityMiddleware = require('./middleware/security');
const authRoutes = require('./routes/auth');
const logsRoutes = require('./routes/logs');
const Log = require('./models/Log');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(securityMiddleware);
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api/logs', logsRoutes);

// MongoDB bağlantısı
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/auth_db';
mongoose.connect(mongoURI).then(() => {
  console.log('MongoDB bağlantısı başarılı');
  Log.create({
    email: 'sistem@test.com',
    action: 'veritabanı bağlantı testi',
    status: 'başarılı',
    ipAddress: 'localhost'
  }).then(() => {
    console.log('Test log kaydı oluşturuldu');
  });
}).catch((err) => {
  console.error('MongoDB bağlantı hatası:', err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 