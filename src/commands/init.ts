/**
 * Copy binaries from pkg to os file system, https://github.com/vercel/pkg/issues/342
 */

import type { Arguments, Argv } from 'yargs';
import path from 'path';
import fs from 'fs';
// @ts-ignore
import { getAppDataPath } from "appdata-path";
import utils from 'util';

const copyFile = utils.promisify(fs.copyFile);
const chmod = utils.promisify(fs.chmod);

async function copy(source, target) {
  //@ts-ignore
  if (process.pkg) {
    // use stream pipe to reduce memory usage
    // when loading a large file into memory.
    return new Promise<void>((resolve, reject) => {
      let readStream = fs.createReadStream(source);
      let writeStream = fs.createWriteStream(target);
      readStream.pipe(writeStream);
      readStream.on('error', reject);
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });
  } else {
    await copyFile(source, target);
  }
}

type Options = {
  hcOnly?: boolean;
  relativePath?: string;
};

export const command: string = 'init';
export const desc: string = 'Init ad4m service with prebuild binary.';

export const builder = (yargs: Argv) =>
  yargs
    .options({
      hcOnly: { type: "boolean" },
      relativePath: { 
        type: 'string', 
        describe: 'Relative path to the appdata for ad4m-host to store binaries', 
        alias: 'rp'
      },
    });

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  const { hcOnly, relativePath } = argv;
  const binaryPath = path.join(getAppDataPath(relativePath || 'ad4m-host'), 'binary')
  
  if(!fs.existsSync(binaryPath)) {
    fs.mkdirSync(binaryPath, { recursive: true })
  }

  if(!hcOnly) {
    const holochainSource = path.join(__dirname, '../../temp/binary/holochain');
    const holochaintarget = path.join(binaryPath, 'holochain');
    await copy(holochainSource, holochaintarget);
    await chmod(holochaintarget, '755');
  
    const lairSource = path.join(__dirname, '../../temp/binary/lair-keystore');
    const lairTarget = path.join(binaryPath, 'lair-keystore');
    await copy(lairSource, lairTarget);
    await chmod(lairTarget, '755');
  }

  const hcSource = path.join(__dirname, '../../temp/binary/hc');
  const hcTarget = path.join(binaryPath, 'hc');
  await copy(hcSource, hcTarget);
  await chmod(hcTarget, '755');

  process.exit();
};
