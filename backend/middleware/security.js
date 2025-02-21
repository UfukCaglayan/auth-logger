const escapeSpecialChars = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/[<>{}$]/g, '');
};

const securityMiddleware = (req, res, next) => {
  // Request body'deki tüm string değerleri temizle
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      req.body[key] = escapeSpecialChars(req.body[key]);
    });
  }
  
  // Query parametrelerini temizle
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      req.query[key] = escapeSpecialChars(req.query[key]);
    });
  }
  
  next();
};

module.exports = securityMiddleware; 