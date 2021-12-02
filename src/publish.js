
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import WebSocket from "ws";
import { CONFIG } from "./config"

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
        variables: { "passphrase": process.env.AGENT_PASSWORD }   // change to your password
    }).then(result => console.log(result));

    const languages = CONFIG.languages;

    for (const lang of languages) {
        await client.mutate({
            mutation: gql`
                mutation languagePublish($languageMeta: LanguageMetaInput!, $languagePath: String!) {
                    languagePublish(languageMeta: $languageMeta, languagePath: $languagePath) {
                        name
                        address
                        author
                        description
                        possibleTemplateParams
                        sourceCodeLink
                        templateAppliedParams
                        templateSourceLanguageAddress
                        templated
                    }
                }
            `,
            variables: lang   // change to your password
        }).then(result => console.log(result));
    }
}
