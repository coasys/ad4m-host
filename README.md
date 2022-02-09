# Ad4m Host

This is command-line program to host ad4m service and request to the service with build-in commands.

## Usage

Dowload the latest program on the [Release page](https://github.com/fluxsocial/ad4m-host/releases), here take Mac os as example,

```shell
wget -O ad4m https://github.com/fluxsocial/ad4m-host/releases/download/v0.0.2/ad4m-macos-x64
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

**Create an expression,**

```shell
# show all the downloaded languages
./ad4m languages get --all

# install the note-ipfs language with its address
./ad4m languages get --address QmYVsrMpiFmV9S7bTWNAkUzSqjRJskQ8g4TWKKwKrHAPqL

# if got "not a trustedAgent error", try add a trusted agent with the language creator's did
./ad4m runtime addTrustedAgent --did "did:key:zQ3shfhvaHzE81hZqLorVNDmq971EpGPXq3nhyLF1JRP18LM3"

# create an expression with note-ipfs language, return the url of the expression
./ad4m expression create --content "This is a test note" --address QmYVsrMpiFmV9S7bTWNAkUzSqjRJskQ8g4TWKKwKrHAPqL

# get the expression with its url
./ad4m expression get --url "QmYVsrMpiFmV9S7bTWNAkUzSqjRJskQ8g4TWKKwKrHAPqL://QmSsCCtXMDAZXMpyiNLzwjGEU4hLmhG7fphidhEEodQ4Wy"
```

**Publish a language,**

```shell
# publish a template langauge by replacing the path and meta params. 
# you can also omit the path and meta params, and input them interactively.
# it should give the address of the language.
./ad4m languages publish --path "/Users/kaichaosun/github/holo/ad4m-languages/release/shortform/bundle.js" --meta '{"name":"shortform-expression","description":"Shortform expression for flux application","possibleTemplateParams":["uid","name"],"sourceCodeLink":"https://github.com/juntofoundation/ad4m-languages"}'

# check the metadata of the template language
./ad4m languages meta --address QmWN1LBR3Zzx3yE7mncf93BPna8RbwtkSrYxTETktfpUyJ

# publish a language by appling template data to a template language
# it should give the address of the templated language
./ad4m languages applyTemplateAndPublish --address QmWN1LBR3Zzx3yE7mncf93BPna8RbwtkSrYxTETktfpUyJ --templateData '{"uid":"123","name":"test-shortform-expression"}'

# check the metadata of the templated language
./ad4m languages meta --address QmX2e2MaN9ayWaoA4MRhjjVw72RqgxUh7v7SWNbU5Kebpq
```

**Create perspective, neighbourhood**

TODO

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

To build the binary package,

```shell
npm run release-macos
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
