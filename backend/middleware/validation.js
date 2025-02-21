const { body, validationResult } = require('express-validator');

// Giriş için validasyon kuralları
const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Geçerli bir email adresi girin')
    .normalizeEmail()
    .optional(),

  body('password')
    .isLength({ min: 6, max: 50 })
    .matches(/^[a-zA-Z0-9@#$%^&*!_]+$/)
    .withMessage('Şifre geçersiz karakterler içeriyor')
    .optional(),
];

// Kayıt için validasyon kuralları
const registerValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Geçerli bir email adresi girin')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6, max: 50 })
    .matches(/^[a-zA-Z0-9@#$%^&*!_]+$/)
    .withMessage('Şifre geçersiz karakterler içeriyor'),
];

// Validasyon sonuçlarını kontrol eden middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Şifre en az 8 karakter uzunluğunda olmalı ve büyük harf, küçük harf, rakam ve özel karakter (!@#$%^&*_) içermelidir.'
    });
  }
  next();
};

module.exports = {
  loginValidation,
  registerValidation,
  validate
}; 