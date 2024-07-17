import dotenv from '@dotenvx/dotenvx';
import { readFileSync } from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import { configSchema } from './config-schema';

dotenv.config();

// replace ${names} with environment variable values
const substituteEnvVars = (str: string) => {
  return str.replace(/\${([^}]+)}/g, (_, name) => {
    const value = process.env[name];
    if (!value) {
      throw new Error(`"${name}" does not exists in the environment variable`);
    }
    return value;
  });
};

// use `__dirname` instead of `import.meta.dirname` if using commonjs
const yamlPath = path.resolve(import.meta.dirname, '..', 'config.yaml');

const loadYamlConfig = (path: string) => {
  const rawYaml = readFileSync(path, 'utf8');
  const substitutedYaml = substituteEnvVars(rawYaml);

  const rawConfig = yaml.load(substitutedYaml);
  const parsedConfig = configSchema.safeParse(rawConfig);

  if (!parsedConfig.success) throw parsedConfig.error;

  return parsedConfig.data;
};

export const appConfig = loadYamlConfig(yamlPath);
