const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Lütfen geçerli bir email adresi girin']
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  tokenVersion: {
    type: Number,
    default: 0
  }
});

// Email için tek bir index tanımlıyoruz
userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema); 