const bcrypt = require('bcryptjs');

class PasswordService {
  static SALT_ROUNDS = 12; // 10'dan 12'ye çıkaralım

  static async hashPassword(password) {
    try {
      // Şifre gücü kontrolü
      if (!this.isStrongPassword(password)) {
        console.log('Geçersiz şifre:', password); // Hangi şifrenin hata verdiğini görelim
        throw new Error('Şifre yeterince güçlü değil');
      }
      
      return await bcrypt.hash(password, this.SALT_ROUNDS);
    } catch (error) {
      // Orijinal hatayı görelim
      console.error('Password validation error:', error.message);
      throw new Error(`Şifre hashleme hatası: ${error.message}`);
    }
  }

  static async verifyPassword(password, hashedPassword) {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new Error('Şifre doğrulama hatası');
    }
  }

  static isStrongPassword(password) {
    console.log('Şifre kontrolü:', {
      length: password.length >= 8,
      upperCase: /[A-Z]/.test(password),
      lowerCase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*_|"?.\\\-/$]/.test(password)
    });

    // En az 8 karakter
    if (password.length < 8) return false;

    // Büyük harf kontrolü
    if (!/[A-Z]/.test(password)) return false;

    // Küçük harf kontrolü
    if (!/[a-z]/.test(password)) return false;

    // Rakam kontrolü
    if (!/[0-9]/.test(password)) return false;

    // Özel karakter kontrolü - tüm özel karakterler
    if (!/[!@#$%^&*_|"?.\\\-/$]/.test(password)) return false;

    return true;
  }
}

module.exports = PasswordService; 