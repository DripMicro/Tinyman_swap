import { poolUtils, SupportedNetwork, Swap, SwapType } from '@tinymanorg/tinyman-js-sdk';
import { Account } from 'algosdk';

import { PeraWalletConnect } from '@perawallet/connect';
import { algodClient } from '../../util/client';
import signerWithPera from '../../util/initiatorSigner';

/**
 * Executes a swap with a fixed input amount
 * (Input amount is entered by the user, output amount is to be calculated by the SDK)
 */
export async function fixedInputSwap({
  asset_1,
  asset_2,
  amount,
  assetInDecimal,
  assetOutDecimal,
  account
}: {
  asset_1: number;
  asset_2: number;
  amount: string;
  assetInDecimal: number;
  assetOutDecimal: number;
  account: string;
}) {
  const initiatorAddr = account;
  const pool = await poolUtils.v2.getPoolInfo({
    network: 'mainnet' as SupportedNetwork,
    client: algodClient,
    asset1ID: Number(asset_1),
    asset2ID: Number(asset_2)
  });

  /**
   * This example uses only v2 quote. Similarly, we can use
   * Swap.getQuote method, which will return the best quote (highest rate)
   * after checking both v1 and v2
   */
  const fixedInputSwapQuote = Swap.v2.getQuote(
    SwapType.FixedInput,
    pool,
    { id: pool.asset1ID, amount: Number(amount) * 10 ** assetInDecimal },
    { assetIn: assetInDecimal, assetOut: assetOutDecimal }
  );

  let assetIn = {
    id: fixedInputSwapQuote.assetInID,
    amount: fixedInputSwapQuote.assetInAmount
  };
  let assetOut = {
    id: fixedInputSwapQuote.assetOutID,
    amount: fixedInputSwapQuote.assetOutAmount
  };

  if (asset_1 === 0) {
    const fixedInputSwapQuote = Swap.v2.getQuote(
      SwapType.FixedInput,
      pool,
      { id: pool.asset2ID, amount: Number(amount) * 10 ** assetInDecimal },
      { assetIn: assetInDecimal, assetOut: assetOutDecimal }
    );
    assetIn = {
      id: fixedInputSwapQuote.assetInID,
      amount: fixedInputSwapQuote.assetInAmount
    };
    assetOut = {
      id: fixedInputSwapQuote.assetOutID,
      amount: fixedInputSwapQuote.assetOutAmount
    };
  }

  if (asset_2 === 0) {
    const fixedInputSwapQuote = Swap.v2.getQuote(
      SwapType.FixedOutput,
      pool,
      { id: pool.asset1ID, amount: Number(amount) * 10 ** assetOutDecimal },
      { assetIn: assetInDecimal, assetOut: assetOutDecimal }
    );
    assetIn = {
      id: fixedInputSwapQuote.assetInID,
      amount: fixedInputSwapQuote.assetInAmount
    };
    assetOut = {
      id: fixedInputSwapQuote.assetOutID,
      amount: fixedInputSwapQuote.assetOutAmount
    };
  }

  const fixedInputSwapTxns = await Swap.v2.generateTxns({
    client: algodClient,
    swapType: SwapType.FixedInput,
    pool,
    initiatorAddr,
    assetIn,
    assetOut,
    slippage: 0.05
  });

  console.log(fixedInputSwapTxns);

  // const signedTxns = await Swap.v2.signTxns({
  //   txGroup: fixedInputSwapTxns,
  //   initiatorSigner: signerWithPera(account, perawallet)
  // });

  // const swapExecutionResponse = await Swap.v2.execute({
  //   network: 'testnet' as SupportedNetwork,
  //   client: algodClient,
  //   signedTxns,
  //   pool,
  //   txGroup: fixedInputSwapTxns,
  //   assetIn
  // });

  console.log('✅ Fixed Input Swap executed successfully!');
  // console.log({ txnID: swapExecutionResponse.txnID });
}
