import getAppDataPath from "appdata-path";
import path from "path";
import fs from 'fs';

export function getConfig(dataPath = '') {
  try {
    const ad4mHostConfig = path.join(getAppDataPath(), 'ad4m-host-config.json');

    const config = fs.readFileSync(ad4mHostConfig, { encoding: 'utf-8' })

    const parsed = JSON.parse(config);

    return parsed;  
  } catch (e) { 
    const dest = path.join(getAppDataPath(''), 'ad4m-host-config.json');

    fs.writeFileSync(dest, JSON.stringify({}))

    return {}
  }
}