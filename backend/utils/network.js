exports.getClientIP = (req) => {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (forwardedFor) {
    return forwardedFor.split(',')[0];
  }
  
  const remoteAddress = req.connection.remoteAddress;
  
  if (remoteAddress === '::1' || remoteAddress === '::ffff:127.0.0.1') {
    return '127.0.0.1';
  }
  
  if (remoteAddress.startsWith('::ffff:')) {
    return remoteAddress.slice(7);
  }
  
  return remoteAddress || 'bilinmeyen';
}; 