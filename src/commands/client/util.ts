import { Ad4mClient } from '@perspect3vism/ad4m';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import WebSocket from 'ws';
import ReadlineSync from 'readline-sync';
import util from 'util';

export type CommonOptions = {
  server?: string;
  verbose?: boolean;
}

export function buildAd4mClient(server: string): Ad4mClient {
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
  return new Ad4mClient(apolloClient);
}

export function readPassphrase(): string {
  const password = ReadlineSync.question("Password: ", { hideEchoBack: true });
  return password;
}

export function prettify(obj) {
  console.info("=>\n", util.inspect(obj, {showHidden: false, depth: null}));
}
