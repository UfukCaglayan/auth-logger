const User = require('../models/User');
const Log = require('../models/Log');
const PasswordService = require('../utils/password');
const jwt = require('jsonwebtoken');
const { getClientIP } = require('../utils/network');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    
    const clientIP = getClientIP(req);
    
    // Aynı IP'den yapılan tüm giriş denemelerini kontrol et
    const recentIPAttempts = await Log.countDocuments({
      ipAddress: clientIP,
      action: 'giriş denemesi',
      timestamp: { $gte: new Date(Date.now() - 15 * 60 * 1000) }
    });

    if (recentIPAttempts >= 15) { // IP başına 15 deneme hakkı
      return res.status(429).json({
        message: 'Çok fazla giriş denemesi yapıldı. Lütfen daha sonra tekrar deneyin.'
      });
    }

    // Her giriş denemesi için log oluştur
    const log = {
      email,
      action: 'giriş denemesi',
      ipAddress: clientIP,
      status: 'beklemede'
    };

    if (!user) {
      log.status = 'başarısız';
      log.action = 'giriş başarısız - kullanıcı bulunamadı';
      await Log.create(log);
      return res.status(401).json({ message: 'Kullanıcı bulunamadı' });
    }

    const isMatch = await PasswordService.verifyPassword(password, user.password);
    
    if (!isMatch) {
      log.status = 'başarısız';
      log.action = 'giriş başarısız - yanlış şifre';
      await Log.create(log);

      // Her email için son başarısız denemeleri kontrol et
      const recentFailedAttempts = await Log.countDocuments({
        email,
        status: 'başarısız',
        timestamp: { $gte: new Date(Date.now() - 5 * 60 * 1000) }
      });

      if (recentFailedAttempts >= 3) { // Email başına 3 yanlış deneme
        await Log.create({
          email,
          action: 'şüpheli giriş aktivitesi',
          status: 'şüpheli',
          ipAddress: clientIP
        });
        return res.status(401).json({ 
          message: 'Bu hesap için çok fazla başarısız giriş denemesi. Lütfen bir süre bekleyin.' 
        });
      }

      return res.status(401).json({ message: 'Hatalı şifre' });
    }

    // Başarılı giriş
    log.status = 'başarılı';
    log.action = 'giriş başarılı';
    await Log.create(log);

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, isAdmin: user.isAdmin });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!PasswordService.isStrongPassword(password)) {
      return res.status(400).json({ 
        message: 'Şifre en az 8 karakter uzunluğunda olmalı ve büyük harf, küçük harf, rakam ve özel karakter içermelidir.' 
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      await Log.create({
        email,
        action: 'kullanıcı oluşturma başarısız - email mevcut',
        status: 'başarısız',
        ipAddress: getClientIP(req)
      });
      return res.status(400).json({ message: 'Bu email adresi zaten kullanılıyor' });
    }

    const hashedPassword = await PasswordService.hashPassword(password);
    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      isAdmin: false
    });

    await user.save();

    await Log.create({
      email,
      action: 'kullanıcı oluşturuldu',
      status: 'başarılı',
      ipAddress: getClientIP(req)
    });

    res.json({ message: 'Kullanıcı başarıyla oluşturuldu' });
  } catch (error) {
    console.error('Kullanıcı oluşturma hatası:', error);
    res.status(500).json({ message: 'Kullanıcı oluşturulurken hata oluştu' });
  }
}; 