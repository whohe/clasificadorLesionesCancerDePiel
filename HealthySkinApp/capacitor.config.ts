import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'HealthySkinApp',
  webDir: 'www'
  "server": {
    "cleartext": true
  }
  "http": {
    "useLegacyHttp": true
	}
};

export default config;
