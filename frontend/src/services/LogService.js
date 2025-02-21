class LogService {
  static saveLog(email, action, status, type = 'server') {
    const log = {
      _id: new Date().getTime(), // Benzersiz ID için timestamp kullan
      email,  // username yerine email
      action,
      status,
      timestamp: new Date(),
      ipAddress: type === 'local' ? 'local' : 'client'
    };

    if (type === 'local') {
      // Yerel depolamadan mevcut logları al
      const existingLogs = this.getLocalLogs();
      
      // Yeni logu ekle
      existingLogs.unshift(log);
      
      // Son 100 logu tut
      const trimmedLogs = existingLogs.slice(0, 100);
      
      // Güncellenmiş logları kaydet
      localStorage.setItem('localLogs', JSON.stringify(trimmedLogs));
    }

    return log;
  }

  static getLocalLogs() {
    try {
      const logs = localStorage.getItem('localLogs');
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.error('Yerel log okuma hatası:', error);
      return [];
    }
  }

  static clearLocalLogs() {
    localStorage.removeItem('localLogs');
  }
}

export default LogService; 