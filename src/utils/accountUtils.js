import algosdk from 'algosdk';

import { clientForChain } from './algod';

export const getAccountBalance = (amount) => algosdk.microalgosToAlgos(amount);

// export const getAccountBalanceByAssetID = async (account, assetID) => {
//   Promise((resolve, reject) => {
//     try {
//       resolve(
//         fetch(`https://node.algoexplorerapi.io/v2/accounts/${account}/assets/${assetID}`, {
//           method: 'GET'
//         }).json()['asset-holding'].amount
//       );
//     } catch (error) {
//       reject(error);
//     }
//   });

//   // const data = await fetch(`https://node.algoexplorerapi.io/v2/accounts/${account}/assets/${assetID}`, {
//   //   method: 'GET'
//   // }).json();
//   // const jsonData = await data.json();
//   // return jsonData['asset-holding'].amount;
// };

export const getAssetByID = (assetId) => {
  const server =
    'https://cosmopolitan-damp-sunset.algorand-mainnet.discover.quiknode.pro/c7c0b2696bfff7209d8f14f10ac733d6d38e556d/index/';
  const client = new algosdk.Indexer('', server, '');
  return new Promise((resolve, reject) => {
    try {
      resolve(client.lookupAssetByID(assetId).do());
    } catch (error) {
      reject(error);
    }
  });
};

export const getAccountInformation = (chain, address) =>
  new Promise((resolve, reject) => {
    try {
      resolve(clientForChain(chain).accountInformation(address).do());
    } catch (error) {
      reject(error);
    }
  });
