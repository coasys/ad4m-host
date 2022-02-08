import { Ad4mClient, Link, LinkQuery } from '@perspect3vism/ad4m';
import type { Arguments, Argv } from 'yargs';
import { buildAd4mClient, CommonOptions, prettify } from './util';

export const command: string = 'neighbourhood [action]';
export const desc: string = 'Neighbourhood related action';

type Options = CommonOptions & {
  uuid?: string;
  linkLanguage?: string;
  meta?: string;
  url?: string;
};

export const builder = (yargs: Argv) =>
  yargs
    .positional('action', {
      type: 'string',
      describe: 'Action that should be executed on the neighbourhood',
      choices: ['publishFromPerspective', 'joinFromUrl'],
    })
    .options({
      uuid: { type: "string" },
      linkLanguage: { type: "string" },
      meta: { type: "string" },
      url: { type: "string" },
    });

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  const { server, uuid, linkLanguage, meta, url, action } = argv;

  const ad4mClient = buildAd4mClient(server);
  switch (action) {
    case 'publishFromPerspective': await publishFromPerspective(ad4mClient, uuid, linkLanguage, meta); break;
    case 'joinFromUrl': await joinFromUrl(ad4mClient, url); break;

    default:
      console.info(`Action "${argv.action}" is not defined on neighbourhood.`)
      break;
  }

  process.exit();
};

async function publishFromPerspective(ad4mClient: Ad4mClient, uuid: string, linkLanguage: string, meta: string) {
  if (uuid && linkLanguage && meta) {
    const result = await ad4mClient.neighbourhood.publishFromPerspective(uuid, linkLanguage, JSON.parse(meta));
    prettify(result)
    return;
  }

  console.info('Neighbourhood publishFromPerspective action is missiong param <uuid> <linkLanguage> <meta>');
}

async function joinFromUrl(ad4mClient: Ad4mClient, url: string) {
  if (url) {
    const result = await ad4mClient.neighbourhood.joinFromUrl(url);
    prettify(result)
    return;
  }

  console.info('Neighbourhood joinFromUrl action is missiong param <url>');
}
