import path from "path";
import wget from "wget-improved";
import fs from 'fs';
import fetch from 'node-fetch'

const BOOTSTRAP_LINK = "https://api.github.com/repos/perspect3vism/ad4m-seeds/releases/63393700";

export const MAINNET_SEED = "mainnet_seed.json";

export async function fetchLatestBootstrapSeed(appDataPath: string) {
  return new Promise(async (resolve, reject) => {
    const response = await fetch(BOOTSTRAP_LINK)
    const data: any = await response.json();

    const dest = path.join(appDataPath, MAINNET_SEED);
    let download: any;

    const link = data.assets.find((e: any) =>
      e.name.includes('mainnetSeed.json')
    ).browser_download_url;
    download = wget.download(link, dest)
    download.on('end', async () => {
      await fs.chmodSync(dest, '777');
      console.log('Mainnet seed download succesfully')
      resolve(null);
    })

    download.on('error', async (err: any) => {
      console.log("Something went wrong downloading mainnet seed");
      reject(err);
    })
  });
}