import path from "path";
import wget from "wget-improved";
import fs from 'fs';
import fetch from 'node-fetch'

export async function fetchLatestBootstrapSeed(appDataPath: string) {
  return new Promise(async (resolve, reject) => {
    const response = await fetch("https://api.github.com/repos/perspect3vism/ad4m-seeds/releases/latest")
    const data: any = await response.json();
  
    const dest = path.join(appDataPath, 'mainnetSeed.json');
    let download: any;

    const link = data.assets.find((e: any) =>
      e.name.includes("mainnetSeed.json")
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