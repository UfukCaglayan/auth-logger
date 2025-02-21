const jwt = require('jsonwebtoken');

const createToken = (user) => {
  return jwt.sign(
    { 
      userId: user._id,
      isAdmin: user.isAdmin,
      version: user.tokenVersion // Kullanıcının token versiyonu
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: '1h',
      algorithm: 'HS256'
    }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  createToken,
  verifyToken
}; 