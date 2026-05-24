const Setting = require('../models/settingModel');

exports.getSettings = async (req, res) => {
  try {
    const settingsList = await Setting.find();
    const settings = {};
    settingsList.forEach(setting => {
      settings[setting.key] = setting.value;
    });

    // Provide default fallback value if not present in DB
    if (settings.isOutletOpen === undefined) {
      settings.isOutletOpen = true;
    }

    if (settings.closeReason === undefined) {
      settings.closeReason = 'baking and maintenance';
    }

    res.status(200).json({
      status: 'success',
      data: { settings }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.updateSetting = async (req, res) => {
  try {
    const { key, value } = req.body;
    if (!key) {
      return res.status(400).json({ message: 'Key is required' });
    }

    let setting = await Setting.findOne({ key });
    if (setting) {
      setting.value = value;
      await setting.save();
    } else {
      setting = await Setting.create({ key, value });
    }

    res.status(200).json({
      status: 'success',
      data: { setting }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
