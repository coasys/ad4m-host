import { Ad4mClient } from '@perspect3vism/ad4m';
import type { Arguments, Argv } from 'yargs';
import { buildAd4mClient, CommonOptions, prettify } from './util';

export const command: string = 'expression [action]';
export const desc: string = 'Expression related action';

type Options = CommonOptions & {
  url?: string;
  raw?: boolean;
  content?: string;
  languageAddress?: string;
};

export const builder = (yargs: Argv) =>
  yargs
    .positional('action', {
      type: 'string',
      describe: 'Action that should be executed on the expression',
      choices: ['get', 'create'],
    })
    .options({
      url: { type: "string" },
      raw: { type: "boolean" },
      content: { type: "string" },
      languageAddress: { type: "string" },
    });

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  const { server, url, raw, content, languageAddress, action } = argv;

  const ad4mClient = buildAd4mClient(server);
  switch (action) {
    case 'get': await get(ad4mClient, url, raw); break;
    case 'create': await create(ad4mClient, content, languageAddress); break;

    default:
      console.info(`Action "${argv.action}" is not defined on expression.`)
      break;
  }

  process.exit();
};

async function get(ad4mClient: Ad4mClient, url: string, raw: boolean) {
  if (raw && url) {
    const expression = await ad4mClient.expression.getRaw(url);
    prettify(expression)
    return;
  }

  if (url) {
    const expression = await ad4mClient.expression.get(url);
    prettify(expression)
    return;
  }

  console.info('Expression get action is missiong param <url> <raw>');
}

async function create(ad4mClient: Ad4mClient, content: string, languageAddress: string) {
  if (content && languageAddress) {
    const expression = await ad4mClient.expression.create(content, languageAddress);
    prettify(expression)
    return;
  }

  console.info('Expression create action is missiong param <content> <languageAddress>');
}

