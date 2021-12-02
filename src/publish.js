
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import WebSocket from "ws";

const client = new ApolloClient({
    link: new WebSocketLink({
        uri: `ws://localhost:4000/graphql`,
        options: {
            reconnect: true,
        },
        webSocketImpl: WebSocket
    }),
    cache: new InMemoryCache({}),
    defaultOptions: {
        watchQuery: {
            errorPolicy: "ignore",
        },
        query: {
            errorPolicy: "all",
        },
    },
});

export async function publish() {
    await client.query({
        query: gql`
            query agentStatus {
                agentStatus {
                    did
                    didDocument
                    error
                    isInitialized
                    isUnlocked
                }
            }
        `
    }).then(result => console.log(result));

    await client.mutate({
        mutation: gql`
            mutation agentUnlock($passphrase: String!) {
                agentUnlock(passphrase: $passphrase) {
                    isInitialized
                    isUnlocked
                    did
                    error
                }
            }
        `,
        variables: { "passphrase": "123456" }
    }).then(result => console.log(result));
}
