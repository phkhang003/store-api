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

import { IsString, IsNumber } from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_REFRESH_SECRET: string;

  @IsString()
  API_KEY: string;

  @IsNumber()
  PORT: number;
}
