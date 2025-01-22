export const validateEnvConfig = (config: Record<string, unknown>) => {
  const requiredEnvVars = ['NODE_ENV', 'MONGODB_URI', 'PORT'];
  
  for (const envVar of requiredEnvVars) {
    if (!config[envVar]) {
      throw new Error(`${envVar} is required`);
    }
  }

  // Validate NODE_ENV value
  const validEnvironments = ['development', 'production', 'test'];
  if (!validEnvironments.includes(config.NODE_ENV as string)) {
    throw new Error('NODE_ENV must be development, production or test');
  }

  return config;
};
