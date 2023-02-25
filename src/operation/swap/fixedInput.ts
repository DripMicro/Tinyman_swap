import { poolUtils, SupportedNetwork, Swap, SwapType } from '@tinymanorg/tinyman-js-sdk';
import { Account } from 'algosdk';

import { algodClient } from '../../util/client';
import signerWithSecretKey from '../../util/initiatorSigner';

/**
 * Executes a swap with a fixed input amount
 * (Input amount is entered by the user, output amount is to be calculated by the SDK)
 */
export async function fixedInput({
  asset_1,
  asset_2,
  amount,
  assetInDecimal,
  assetOutDecimal
}: {
  asset_1: number;
  asset_2: number;
  amount: string;
  assetInDecimal: number;
  assetOutDecimal: number;
}) {
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

  if (asset_1 === 0) {
    const fixedOutputSwapQuote = Swap.v2.getQuote(
      SwapType.FixedInput,
      pool,
      { id: pool.asset2ID, amount: Number(amount) * 10 ** assetInDecimal },
      { assetIn: assetInDecimal, assetOut: assetOutDecimal }
    );
    return fixedOutputSwapQuote.assetOutAmount;
  }

  if (asset_2 === 0) {
    const fixedOutputSwapQuote = Swap.v2.getQuote(
      SwapType.FixedOutput,
      pool,
      { id: pool.asset1ID, amount: Number(amount) * 10 ** assetOutDecimal },
      { assetIn: assetInDecimal, assetOut: assetOutDecimal }
    );
    return fixedOutputSwapQuote.assetInAmount;
  }

  const fixedInputSwapQuote = Swap.v2.getQuote(
    SwapType.FixedInput,
    pool,
    { id: pool.asset1ID, amount: Number(amount) * 10 ** assetInDecimal },
    { assetIn: assetInDecimal, assetOut: assetOutDecimal }
  );
  const assetIn = {
    id: fixedInputSwapQuote.assetInID,
    amount: fixedInputSwapQuote.assetInAmount
  };
  const assetOut = {
    id: fixedInputSwapQuote.assetOutID,
    amount: fixedInputSwapQuote.assetOutAmount
  };

  return assetOut.amount;

  // const fixedInputSwapTxns = await Swap.v2.generateTxns({
  //   client: algodClient,
  //   swapType: SwapType.FixedInput,
  //   pool,
  //   initiatorAddr,
  //   assetIn,
  //   assetOut,
  //   slippage: 0.05
  // });

  // const signedTxns = await Swap.v2.signTxns({
  //   txGroup: fixedInputSwapTxns,
  //   initiatorSigner: signerWithSecretKey(account)
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
