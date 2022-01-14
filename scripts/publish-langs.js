
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import WebSocket from "ws";

const CONFIG = {
    // Change to your own released languages
    languages: [
        { 
            "languageMeta": {
              "name": "shortform-expression",
              "description": "Shortform expression for flux application",
              "possibleTemplateParams": ["uid", "name"],
              "sourceCodeLink": "https://github.com/juntofoundation/ad4m-languages"
            },
            "languagePath": "/Users/kaichaosun/github/holo/ad4m-languages/release/shortform/bundle.js"
        },
        { 
            "languageMeta": {
              "name": "group-expression",
              "description": "Group expression for flux application",
              "possibleTemplateParams": ["uid", "name"],
              "sourceCodeLink": "https://github.com/juntofoundation/ad4m-languages"
            },
            "languagePath": "/Users/kaichaosun/github/holo/ad4m-languages/release/group/bundle.js"
        },
        { 
            "languageMeta": {
              "name": "profile-expression",
              "description": "Profile expression for flux application",
              "possibleTemplateParams": ["uid", "name"],
              "sourceCodeLink": "https://github.com/jdeepee/profiles"
            },
            "languagePath": "/Users/kaichaosun/github/holo/josh/profiles/build/bundle.js"
        },
        { 
            "languageMeta": {
              "name": "social-context",
              "description": "Link sharing for ad4m neighbourhoods",
              "possibleTemplateParams": ["uid", "name"],
              "sourceCodeLink": "https://github.com/juntofoundation/Social-Context"
            },
            "languagePath": "/Users/kaichaosun/Downloads/bundle.js"
        }
    ]
}

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

async function publish() {
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
        }).then(result => console.log(JSON.stringify(result, null, 2)));
    }
}

publish();
