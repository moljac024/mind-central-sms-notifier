import {z} from 'zod';
import Config from 'react-native-config';

const ConfigSchema = z.object({
  API_URL: z.string().min(1),
});

export type ApplicationConfig = z.infer<typeof ConfigSchema>;

export function getApplicationConfig(): ApplicationConfig {
  const config = ConfigSchema.parse(Config);
  return config;
}
