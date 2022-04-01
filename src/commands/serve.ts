import { Arguments, Argv } from 'yargs';
// @ts-ignore
import { init } from "@perspect3vism/ad4m-executor";
import path from 'path';
import fs from 'fs';
// @ts-ignore
import { getAppDataPath } from "appdata-path";
import getPort from 'get-port';
import wget from "wget-improved";
import fetch from "node-fetch";

type Options = {
  port?: number;
  hcAdminPort?: number;
  hcAppPort?: number;
  connectHolochain?: boolean;
  dataPath?: string;
  networkBootstrapSeed?: string;
  languageLanguageOnly?: boolean;
  bootstrapLanguage?: string;
  bootstrapPerspective?: string;
  appLangAliases?: string;
};

export const command: string = 'serve';
export const desc: string = 'Serve ad4m service at given port';

export const builder = (yargs: Argv) =>
  yargs
    .options({
      port: { 
        type: 'number', 
        describe: 'Use this port to run ad4m GraphQL service', 
        default: 4000, 
        alias: 'p'
      },
      hcAdminPort: { 
        type: 'number', 
        describe: 'Admin port of holochain conductor'
      },
      hcAppPort: { 
        type: 'number', 
        describe: 'Port used by hApp' 
      },
      connectHolochain: { 
        type: "boolean", 
        describe: 'Flag to connect existing running holochain process'
      },
      dataPath: { 
        type: 'string', 
        describe: 'The relative path for storing ad4m data', 
        alias: 'rp'
      },
      networkBootstrapSeed: {
        type: 'string',
        describe: 'Path to the seed file',
        alias: 'nbf'
      },
      languageLanguageOnly: {
        type: 'boolean',
        describe: 'Should the ad4m-executor be started with only the languageLanguage, so it can be used for publish other system languages',
        default: false,
        alias: 'll'
      },
      bootstrapLanguage: {
        type: 'string',
        describe: 'Path to Bootstrap languages json file (list of languages)',
      },
      bootstrapPerspective: {
        type: 'string',
        describe: 'Path to Bootstrap perspectives json file (list of perspectives)'
      },
      appLangAliases: {
        type: 'string',
        describe: 'Language aliases to be loaded into ad4m-executor',
        default: '{}'
      }
    });

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  const { port, hcAdminPort, hcAppPort, connectHolochain, dataPath, networkBootstrapSeed, languageLanguageOnly, bootstrapLanguage, bootstrapPerspective, appLangAliases } = argv;

  const binaryPath = path.join(getAppDataPath(dataPath || 'ad4m'), 'binary');

  const gqlPort = await getPort({ port })

  const appDataPath = getAppDataPath(dataPath || '');

  if (!fs.existsSync(appDataPath)) {
    fs.mkdirSync(appDataPath);
  }

  let seedPath;
  if (!networkBootstrapSeed) {
    console.log("No bootstrap seed supplied... downloading the latest AD4M bootstrap seed");
    await fetchLatestBootstrapSeed(appDataPath);
    seedPath = path.join(appDataPath, "mainnetSeed.json");
  } else {
    seedPath = path.isAbsolute(networkBootstrapSeed) ? networkBootstrapSeed: path.join(__dirname, networkBootstrapSeed); 
  }

  const bLanguage = bootstrapLanguage ? await import(path.isAbsolute(bootstrapLanguage) ? bootstrapLanguage: path.join(__dirname, bootstrapLanguage)) : [];

  const bPerspective = bootstrapPerspective ? await import(path.isAbsolute(bootstrapPerspective) ? bootstrapPerspective: path.join(__dirname, bootstrapPerspective)) : [];

  const config = {
    appDataPath: appDataPath,
    resourcePath: binaryPath,
    networkBootstrapSeed: seedPath,
    languageLanguageOnly: languageLanguageOnly,
    bootstrapFixtures: {
      languages: [...bLanguage],
      perspectives: [...bPerspective],
    },
    appLangAliases: JSON.parse(appLangAliases),
    mocks: false,
    gqlPort,
    hcPortAdmin: hcAdminPort,
    hcPortApp: hcAppPort,
    ipfsRepoPath: appDataPath,
    connectHolochain,
  };

  const ad4mCore = await init(config);
  
  await ad4mCore.waitForAgent();
  console.log("Agent has been init'd. Controllers now starting init...");

  ad4mCore.initControllers();
  console.log("Controllers init complete. Initializing languages...");

  await ad4mCore.initLanguages();
  console.log("All languages initialized.");
};

async function fetchLatestBootstrapSeed(appDataPath: string) {
  return new Promise(async (resolve, reject) => {
    const response = await fetch("https://api.github.com/repos/perspect3vism/ad4m-seeds/releases/latest")
    const data: any = await response.json();
  
    const dest = path.join(appDataPath, 'mainnetSeed.json');
    let download: any;

    const link = data.assets.find((e: any) =>
      e.name.includes("mainnetSeed.json")
    ).browser_download_url;
    download = wget.download(link, dest)
    download.on('end', async () => {
      await fs.chmodSync(dest, '777');
      console.log('Mainnet seed download succesfully')
      resolve(null);
    })

    download.on('error', async (err: any) => {
      console.log("Something went wrong downloading mainnet seed");
      reject(err);
    })
  });
}