const validateConfig = (config) => {
  if (config === undefined) {
    throw new Error('config is undefined');
  }

  const requiredKeys = [
    'wallKeys',
    'dataURL',
    'maintenanceMode',
    'maintenanceMessage',
    'wallNameOverrides',
  ];

  for (const key of requiredKeys) {
    if (!(key in config)) {
      throw new Error(`Missing key in config: ${key}`);
    }
  }
};

export default validateConfig;

