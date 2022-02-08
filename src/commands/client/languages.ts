import { Ad4mClient, LanguageMetaInput } from '@perspect3vism/ad4m';
import type { Arguments, Argv } from 'yargs';
import { buildAd4mClient, CommonOptions, prettify } from './util';
import ReadlineSync from 'readline-sync';

export const command: string = 'languages [action]';
export const desc: string = 'Languages related action';

type Options = CommonOptions & {
  address?: string;
  filter?: string;
  all?: boolean;
  settings?: string;
  sourceLanguageHash?: string;
  templateData?: string;
  languagePath?: string;
  languageMeta?: string;
};

export const builder = (yargs: Argv) =>
  yargs
    .positional('action', {
      type: 'string',
      describe: 'Action that should be executed on the languages'
    })
    .options({
      address: { type: "string" },
      filter: { type: "string" },
      all: { type: "boolean" },
      settings: { type: "string" },
      sourceLanguageHash: { type: "string" },
      templateData: { type: "string" },
      languagePath: { type: "string" },
      languageMeta: { type: "string" }
    });

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  const {
    server, address, filter, all, settings, sourceLanguageHash,
    templateData, languagePath, languageMeta, action
  } = argv;

  const ad4mClient = buildAd4mClient(server);
  switch (action) {
    case 'get': await get(ad4mClient, address, filter, all); break;
    case 'writeSettings': await writeSettings(ad4mClient, address, settings);  break;
    case 'applyTemplateAndPublish': await applyTemplateAndPublish(ad4mClient, sourceLanguageHash, templateData); break;
    case 'publish': await publish(ad4mClient, languagePath, languageMeta); break
    case 'meta': await meta(ad4mClient, address); break;
    case 'source': await source(ad4mClient, address); break;

    default:
      console.info(`Action "${argv.action}" is not defined on languages.`)
      break;
  }

  process.exit();
};

async function get(ad4mClient: Ad4mClient, address: string, filter: string, all: boolean) {
  if (address) {
    const language = await ad4mClient.languages.byAddress(address);
    prettify(language)
    return;
  }
  if (filter) {
    const languages = await ad4mClient.languages.byFilter(filter);
    prettify(languages)
    return;
  }
  if (all) {
    const languages = (await ad4mClient.languages.all()).map(l => {
      return { name: l.name, address: l.address };
    })
    prettify(languages)
    return;
  }
  console.info('Language get action is missiong param <address>/<filter>/<all>');
}

async function writeSettings(ad4mClient: Ad4mClient, address?: string, settings?: string) {
  if (address == undefined || settings == undefined) {
    console.info('Language writeSettings action is missiong params <address> and <settings>');
    return;
  }
  const result = await ad4mClient.languages.writeSettings(address!, settings!);
  prettify(result);
}

async function applyTemplateAndPublish(ad4mClient: Ad4mClient, sourceLanguageHash?: string, templateData?: string) {
  if (sourceLanguageHash == undefined || templateData == undefined) {
    console.info('Language applyTemplateAndPublish action is missing params <sourceLanguageHash> and <templateData>');
    return;
  }
  const result = await ad4mClient.languages.applyTemplateAndPublish(sourceLanguageHash, templateData);
  prettify(result);
}

async function publish(ad4mClient: Ad4mClient, languagePath?: string, languageMeta?: string) {
  let languageMetaInput: LanguageMetaInput;
  if (languagePath == undefined) {
    languagePath = ReadlineSync.question("Path of the bundled file: ");
  }
  if (languageMeta == undefined) {
    const name = ReadlineSync.question("Name (must match name in source code): ");
    const description = ReadlineSync.question("Description: ");
    const templateParams = ReadlineSync.question("In case of a templateable Language, list of template parameters (comma separated): ");
    const sourceLink = ReadlineSync.question("Link to source code / Github repo: ");

    languageMetaInput = new LanguageMetaInput(name, description);

    if(sourceLink.trim().length > 0) {
      languageMetaInput.sourceCodeLink = sourceLink.trim()
    }

    const params = templateParams.split(',').map(e => e.trim())
    if(params.length > 0) {
      languageMetaInput.possibleTemplateParams = params
    }
  } else {
    let languageMetaObj = JSON.parse(languageMeta);
    languageMetaInput = new LanguageMetaInput(languageMetaObj.name, languageMetaObj.description);
    languageMetaInput.sourceCodeLink = languageMetaObj.sourceCodeLink.trim();
    languageMetaInput.possibleTemplateParams = languageMetaObj.possibleTemplateParams;
  }

  const result = await ad4mClient.languages.publish(languagePath, languageMetaInput);
  prettify(result);
}

async function meta(ad4mClient: Ad4mClient, address?: string) {
  if (address) {
    const result = await ad4mClient.languages.meta(address);
    prettify(result);
    return;
  }
  console.info('Language meta action is missiong param <address>');
}

async function source(ad4mClient: Ad4mClient, address?: string) {
  if (address) {
    const result = await ad4mClient.languages.source(address);
    console.log(result);
    return;
  }
  console.info('Language source action is missiong param <address>');
}
