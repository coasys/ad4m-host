import type { Arguments, Argv } from 'yargs';
import { Ad4mClient } from '@perspect3vism/ad4m';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import WebSocket from 'ws';
import ReadlineSync from 'readline-sync';
import util from 'util';

export const command: string = 'agent [action]';
export const desc: string = 'Agent-related action';

type Options = {
  server?: string;
  verbose?: boolean;
};

export const builder = (yargs: Argv) =>
  yargs
    .positional('action', {
      type: 'string',
      describe: 'Action that should be executed on the agent',
      default: 'status'
    })
    .options({
      server: { type: 'string', default: 'ws://localhost:4000/graphql', aslia: 's' },
      verbose: { type: "boolean", default: false, alias: 'v' }
    });;

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  const { server, verbose, action } = argv;
  switch (action) {
    case 'generate': await generate(server, verbose); break;
    // case 'lock': agentLock(argv); break;
    // case 'unlock': agentUnlock(argv); break;
    // case 'status': agentStatus(argv); break;
    // case 'me': outputNicely(await ad4mClient(argv.server).agent.me()); process.exit(0); break;

    default:
      console.info(`Action "${argv.action}" is not defined on agent.`)
      break;
  }

  process.exit(0);
};

async function generate(server: string, verbose: boolean) {
  if (verbose) {
    console.info(`Generating agent`);
    console.info(`Attempting to connect to ${server}`);
  }

  let apolloClient = new ApolloClient({
    link: new WebSocketLink({
      uri: server,
      options: { reconnect: true },
      webSocketImpl: WebSocket,
    }),
    cache: new InMemoryCache({ resultCaching: false, addTypename: false }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "no-cache",
      },
      query: {
        fetchPolicy: "no-cache",
      }
    },
  });
  //@ts-ignore
  let ad4mClient = new Ad4mClient(apolloClient);

  const agentDump = await ad4mClient.agent.generate(queryPassphrase());
  outputNicely(agentDump);
}

function queryPassphrase(): string {
  const password = ReadlineSync.question("Password: ", { hideEchoBack: true });
  return password;
}

function outputNicely(obj) {
  console.info("=>\n", util.inspect(obj, {showHidden: false, depth: null}));
}
