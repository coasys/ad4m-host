# Ad4m host service

## Run

Install dependencies,

```shell
npm install
```

Build holochain binaries,

```shell
npm run build-holochain
```

Get bootstrap languages,

```shell
npm run get-languages
```

Run ad4m service,

```shell
npm run ad4m
```

Publish released langugages,
* start ad4m service first
* change scripts/publish-langs.js to your langugages
* run publish with
```shell
AGENT_PASSWORD=your-password npm run publish-languages
```

## Build

Build executable,

```shell
npm run build
npm run package
```

To run the build executable, first init the required the binaries like holochain, lair-keystore and hc.

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
