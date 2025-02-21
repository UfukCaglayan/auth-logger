const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 5, // IP başına maksimum istek
  message: {
    message: 'Çok fazla giriş denemesi. Lütfen 15 dakika sonra tekrar deneyin.'
  }
});

const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 saat
  max: 3, // IP başına maksimum hesap oluşturma
  message: {
    message: 'Çok fazla hesap oluşturma denemesi. Lütfen 1 saat sonra tekrar deneyin.'
  }
});

module.exports = {
  loginLimiter,
  createAccountLimiter
}; 