import { SignerTransaction } from '@tinymanorg/tinyman-js-sdk';
import algosdk, { Account } from 'algosdk';
import { PeraWalletConnect } from '@perawallet/connect';

/**
 * @param account account data that will sign the transactions
 * @returns a function that will sign the transactions, can be used as `initiatorSigner`
 */
export default function signerWithPera(account: string, perawallet: PeraWalletConnect) {
  return function (txGroups: SignerTransaction[][]): Promise<Uint8Array[]> {
    // Filter out transactions that don't need to be signed by the account
    const txnsToBeSigned = txGroups.flatMap((txGroup) => txGroup.filter((item) => item.signers?.includes(account)));

    // Sign all transactions that need to be signed by the account
    algosdk.assignGroupID(txnsToBeSigned.map((toSign) => toSign.txn));

    // txnsToBeSigned.reduce((acc, val) => acc.concat(val), []);

    // We wrap this with a Promise since SDK's initiatorSigner expects a Promise
    return new Promise((resolve) => {
      // resolve(signedTxns);
    });
  };
}
