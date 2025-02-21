const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['başarılı', 'başarısız', 'şüpheli', 'beklemede'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ipAddress: String
});

module.exports = mongoose.model('Log', logSchema); 