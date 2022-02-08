# Ad4m CLI

## Development

Install dependencies,

```shell
npm install
```

Prepare holochain binaries and bootstrap languages,

```shell
npm run prepare
```

Local development without installing any binary,

```shell
npm run dev  # start ad4m service
```

## Release

To build the binary package,

```shell
npm run release
```

To run the build executable, first initialize the required the binaries like holochain, lair-keystore and hc.

```shell
./dist/ad4m init
```

Then start the ad4m service, if pass the optional parameter `connectHolochain`, you need to provide the running holochain admian and app interface port.

```shell
./dist/ad4m serve
```

## Operate with GraphQL

A handly online GraphQL client, https://hoppscotch.io/graphql. You can also save the querys and import/export the collections.

You can also use this pre-exported [collection](docs/hoppscotch-ad4m-graphql-operations.json).

### Examples

**query agent status**,

```graphql
query agentStatus {
  agentStatus {
    did
    didDocument
    error
    isInitialized
    isUnlocked
  }
}
```

**unlock agent**,

```graphql
mutation agentUnlock($passphrase: String!) {
  agentUnlock(passphrase: $passphrase) {
    isInitialized
    isUnlocked
    did
    error
  }
}
```

variables,

```json
{ "passphrase": "yourpassword" }
```

**publish a language**,

```graphql
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
```

variables,

```json
{ 
  "languageMeta": {
    "name": "shortform-expression",
    "description": "Shortform expression for flux application",
    "possibleTemplateParams": ["uid", "name"],
    "sourceCodeLink": "https://github.com/juntofoundation/ad4m-languages"
  },
  "languagePath": "your-language-path"
}
```
