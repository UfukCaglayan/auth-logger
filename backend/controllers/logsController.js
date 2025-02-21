const Log = require('../models/Log');

exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}; 