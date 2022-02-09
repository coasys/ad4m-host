# Ad4m Host

This is command-line program to host ad4m service and request to the service with build-in commands.

## Usage

Dowload the program with this command,

```shell
wget -O ad4m https://github.com/fluxsocial/ad4m-host/releases/download/v0.0.1/ad4m-macos-x64
chmod +x ./ad4m
```

Get help inforamtion for available commands,

```shell
./ad4m -h
./ad4m serve -h
./ad4m agent -h
```

Initialize the dependencies by coping the holochain binaries (**Required**),

```shell
./ad4m init
```

Run ad4m service with or without connecting to an existing running holochain process,

```shell
./ad4m serve --connectHolochain  # connect with existing running holochain process
./ad4m serve # start its own holochain process
```

When running the AD4M executor for the very first time, we need to generate an agent (i.e. DID and keys) with:

```shell
./ad4m agent generate
```

After restart the ad4m service, it's usually necessary to check agent status and unlock the agent with passphrase,

```shell
./ad4m agent status
./ad4m agent unlock
```

Create an expression,

```shell
```

## Development

Install dependencies,

```shell
npm install
```

Prepare holochain binaries and bootstrap languages,

```shell
npm run prepare-dev
```

Local development without installing any binary,

```shell
npm run dev  # start ad4m service
```

## Release

To build the binary package,

```shell
npm run release-macos
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
