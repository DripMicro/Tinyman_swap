import { poolUtils, SupportedNetwork, Swap, SwapType } from '@tinymanorg/tinyman-js-sdk';
import { algodClient } from '../../util/client';

/**
 * Executes a swap with a fixed output amount
 * (Output amount is entered by the user, input amount is to be calculated by the SDK)
 */
export async function fixedOutput({
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
  const fixedOutputSwapQuote = Swap.v2.getQuote(
    SwapType.FixedOutput,
    pool,
    { id: pool.asset2ID, amount: Number(amount) * 10 ** assetOutDecimal },
    { assetIn: assetInDecimal, assetOut: assetOutDecimal }
  );

  const assetIn = {
    id: fixedOutputSwapQuote.assetInID,
    amount: fixedOutputSwapQuote.assetInAmount
  };
  const assetOut = {
    id: fixedOutputSwapQuote.assetOutID,
    amount: fixedOutputSwapQuote.assetOutAmount
  };

  console.log(typeof assetIn.amount);
  console.log(assetOut.amount);

  return assetIn.amount;

  console.log('✅ Fixed Output Swap executed successfully!');
}
