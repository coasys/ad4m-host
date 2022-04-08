/**
 * Copy binaries from pkg to os file system, https://github.com/vercel/pkg/issues/342
 */

import type { Arguments, Argv } from 'yargs';
import path from 'path';
import fs from 'fs';
// @ts-ignore
import { getAppDataPath } from "appdata-path";
import utils from 'util';
import { fetchLatestBootstrapSeed, MAINNET_SEED } from '../utils/fetchLatestBootstrapSeed';
import { CONFIG, getConfig } from '../utils/config';
import ReadlineSync from 'readline-sync';

const copyFile = utils.promisify(fs.copyFile);
const chmod = utils.promisify(fs.chmod);

async function copy(source, target) {
  //@ts-ignore
  if (process.pkg) {
    // use stream pipe to reduce memory usage
    // when loading a large file into memory.
    return new Promise<void>((resolve, reject) => {
      let readStream = fs.createReadStream(source);
      let writeStream = fs.createWriteStream(target);
      readStream.pipe(writeStream);
      readStream.on('error', reject);
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });
  } else {
    await copyFile(source, target);
  }
}

type Options = {
  hcOnly?: boolean;
  dataPath?: string;
  networkBootstrapSeed?: string;
  overrideConfig?: boolean;
};

export const command: string = 'init';
export const desc: string = 'Init ad4m service with prebuild binary.';

export const builder = (yargs: Argv) =>
  yargs
    .options({
      hcOnly: { type: "boolean" },
      dataPath: { 
        type: 'string', 
        describe: 'Name of directory to store ad4m data in the systems app data path', 
        alias: 'rp'
      },
      networkBootstrapSeed: {
        type: 'string',
        describe: 'Path to the seed file',
        alias: 'nbf'
      },
      overrideConfig: {
        type: 'boolean',
        describe: 'Override the existing config file',
      },
    });

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  const { hcOnly, dataPath = '', networkBootstrapSeed, overrideConfig } = argv;
  const binaryPath = path.join(getAppDataPath(dataPath || 'ad4m'), 'binary')
  
  if(!fs.existsSync(binaryPath)) {
    fs.mkdirSync(binaryPath, { recursive: true })
  }

  if(!hcOnly) {
    const holochainSource = path.join(__dirname, '../../temp/binary/holochain');
    const holochaintarget = path.join(binaryPath, 'holochain');
    await copy(holochainSource, holochaintarget);
    await chmod(holochaintarget, '755');
  
    const lairSource = path.join(__dirname, '../../temp/binary/lair-keystore');
    const lairTarget = path.join(binaryPath, 'lair-keystore');
    await copy(lairSource, lairTarget);
    await chmod(lairTarget, '755');
  }

  const hcSource = path.join(__dirname, '../../temp/binary/hc');
  const hcTarget = path.join(binaryPath, 'hc');
  await copy(hcSource, hcTarget);
  await chmod(hcTarget, '755');

  await getSeedConfig(dataPath, networkBootstrapSeed, overrideConfig);

  process.exit();
};

async function getSeedFilePath(dataPath?: string, networkBootstrapSeed?: string) {
  const appDataPath = getAppDataPath(dataPath || '');

  if (!networkBootstrapSeed) {
    console.log("No bootstrap seed supplied... downloading the latest AD4M bootstrap seed");
    await fetchLatestBootstrapSeed(appDataPath);
    return path.join(appDataPath, MAINNET_SEED);
  } else {
    return path.isAbsolute(networkBootstrapSeed) ? networkBootstrapSeed: path.join(__dirname, networkBootstrapSeed); 
  } 
}

async function getSeedConfig(dataPath?: string, networkBootstrapSeed?: string, override?: boolean) {
  let seedPath;
  let configDataPath;
  let globalConfig;

  try {
    globalConfig = getConfig();

    if (dataPath || networkBootstrapSeed) {
      let decision;
      
      if (override === undefined) {
        decision = ReadlineSync.question("There is a already a config present, do you want to override it? (Y|N): ");  
      }

      if (decision === 'Y' || decision === 'y' || override) {
        configDataPath = dataPath;
        seedPath = await getSeedFilePath(dataPath, networkBootstrapSeed);
      }
    } else {
      if (!globalConfig[dataPath]) {
        configDataPath = dataPath;
        seedPath = await getSeedFilePath(dataPath, networkBootstrapSeed)
      } else {
        seedPath = globalConfig[dataPath].seedPath;
        configDataPath = globalConfig[dataPath].dataPath;
      }
    }

  } catch (e) {
    console.log(e)
    configDataPath = dataPath;
    seedPath = getSeedFilePath(dataPath, networkBootstrapSeed)
  }
  
  const config = {
    dataPath: configDataPath,
    seedPath
  }

  const dest = path.join(getAppDataPath(''), CONFIG);

  globalConfig[configDataPath] = config;

  fs.writeFileSync(dest, JSON.stringify(globalConfig))
}