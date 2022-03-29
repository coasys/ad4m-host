import { Arguments, Argv, string } from 'yargs';
// @ts-ignore
import { init } from "@perspect3vism/ad4m-executor";
import path from 'path';
import fs from 'fs';
// @ts-ignore
import { getAppDataPath } from "appdata-path";
import getPort from 'get-port';

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
      defaultLangPath: {
        type: 'string',
        describe: 'Path of the default languages used to start ad4m service',
        default: '../../temp/languages',
        alias: 'dlp'
      },
      networkBootstrapSeed: {
        type: 'string',
        describe: 'Path to the seed file',
        default: '../../seed.json',
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
      }
    });

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  const { port, hcAdminPort, hcAppPort, connectHolochain, dataPath, defaultLangPath, networkBootstrapSeed, languageLanguageOnly } = argv;

  const binaryPath = path.join(getAppDataPath(dataPath || 'ad4m'), 'binary');

  const builtInlang = defaultLangPath as string;

  const appDefaultLangLocation: string =  path.isAbsolute(builtInlang) ? builtInlang : path.join(__dirname, builtInlang);

  const gqlPort = await getPort({ port })

  const seedPath = path.isAbsolute(networkBootstrapSeed) ? networkBootstrapSeed: path.join(__dirname, networkBootstrapSeed); 

  const appDataPath = getAppDataPath(dataPath || '');

  const config = {
    appDataPath: appDataPath,
    resourcePath: binaryPath,
    networkBootstrapSeed: seedPath,
    languageLanguageOnly: languageLanguageOnly,
    bootstrapFixtures: {
      languages: [],
      perspectives: [],
    },
    appBuiltInLangs: [],
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
