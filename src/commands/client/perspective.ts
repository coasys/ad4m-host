import { Ad4mClient, Link, LinkQuery } from '@perspect3vism/ad4m';
import type { Arguments, Argv } from 'yargs';
import { buildAd4mClient, CommonOptions, prettify } from './util';

export const command: string = 'perspective [action]';
export const desc: string = 'Perspective related action';

type Options = CommonOptions & {
  uuid?: string;
  snapshot?: boolean;
  all?: boolean;
  query?: string;
  name?: string;
  link?: string;
  newLink?: string;
};

export const builder = (yargs: Argv) =>
  yargs
    .positional('action', {
      type: 'string',
      describe: 'Action that should be executed on the perspective',
      choices: ['get', 'add', 'update', 'remove', 'queryLinks', 'addLink', 'updateLink', 'removeLink', 'queryProlog'],
    })
    .options({
      url: { type: "string" },
      snapshot: { type: "boolean" },
      all: { type: "boolean" },
      query: { type: "string"},
      name: { type: "string"},
      link: { type: "string"},
      newLink: { type: "string"},
    });

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  const { server, uuid, snapshot, all, query, name, link, newLink, action } = argv;

  const ad4mClient = buildAd4mClient(server);
  switch (action) {
    case 'get': await get(ad4mClient, uuid, snapshot, all); break;
    case 'add': await add(ad4mClient, name); break;
    case 'update': await update(ad4mClient, uuid, name); break;
    case 'remove': await remove(ad4mClient, uuid); break;
    case 'queryLinks': await queryLinks(ad4mClient, uuid, query); break;
    case 'addLink': await addLink(ad4mClient, uuid, link); break;
    case 'updateLink': await updateLink(ad4mClient, uuid, link, newLink); break;
    case 'removeLink': await removeLink(ad4mClient, uuid, link); break;
    case 'queryProlog': await queryProlog(ad4mClient, uuid, query); break;

    default:
      console.info(`Action "${argv.action}" is not defined on perspective.`)
      break;
  }

  process.exit();
};

async function get(ad4mClient: Ad4mClient, uuid: string, snapshot: boolean, all: boolean) {
  if (snapshot && uuid) {
    const result = await ad4mClient.perspective.snapshotByUUID(uuid);
    prettify(result)
    return;
  }

  if (uuid) {
    const result = await ad4mClient.perspective.byUUID(uuid);
    prettify(result)
    return;
  }

  if (all) {
    const results = await ad4mClient.perspective.all();
    const formatted = results.map(proxy => {
      return {
        name: proxy.name,
        uuid: proxy.uuid,
        sharedUrl: proxy.sharedUrl 
      }
    });
    prettify(formatted);
    return;
  }

  console.info('Expression get action is missiong param <uuid> <snapshot> <all>');
}

async function add(ad4mClient: Ad4mClient, name: string) {
  if (name) {
    const result = await ad4mClient.perspective.add(name);
    prettify(result)
    return;
  }

  console.info('Expression add action is missiong param <name>');
}

async function update(ad4mClient: Ad4mClient, uuid: string, name: string) {
  if (uuid && name) {
    const result = await ad4mClient.perspective.update(uuid, name);
    prettify(result)
    return;
  }

  console.info('Expression update action is missiong param <uuid> <name>');
}

async function remove(ad4mClient: Ad4mClient, uuid: string) {
  if (uuid) {
    const result = await ad4mClient.perspective.remove(uuid);
    prettify(result)
    return;
  }

  console.info('Expression remove action is missiong param <uuid>');
}

async function queryLinks(ad4mClient: Ad4mClient, uuid: string, query: string) {
  if (uuid && query) {
    const links = await ad4mClient.perspective.queryLinks(uuid, new LinkQuery(JSON.parse(query)));
    prettify(links)
    return;
  }

  console.info('Expression queryLinks action is missiong param <uuid> <query>');
}

async function addLink(ad4mClient: Ad4mClient, uuid: string, link: string) {
  if (uuid && link) {
    const result = await ad4mClient.perspective.addLink(uuid, new Link(JSON.parse(link)));
    prettify(result)
    return;
  }

  console.info('Expression addLink action is missiong param <uuid> <link>');
}

async function updateLink(ad4mClient: Ad4mClient, uuid: string, link: string, newLink: string) {
  if (uuid && link && newLink) {
    const result = await ad4mClient.perspective.updateLink(uuid, JSON.parse(link), JSON.parse(newLink));
    prettify(result)
    return;
  }

  console.info('Expression updateLink action is missiong param <uuid> <link> <newLink>');
}

async function removeLink(ad4mClient: Ad4mClient, uuid: string, link: string) {
  if (uuid && link) {
    const result = await ad4mClient.perspective.removeLink(uuid, JSON.parse(link));
    prettify(result)
    return;
  }

  console.info('Expression removeLink action is missiong param <uuid> <link>');
}

async function queryProlog(ad4mClient: Ad4mClient, uuid: string, query: string) {
  if (uuid && query) {
    const result = await ad4mClient.perspective.queryProlog(uuid, query);
    prettify(result)
    return;
  }

  console.info('Expression queryProlog action is missiong param <uuid> <query>');
}
