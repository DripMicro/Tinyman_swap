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
  if (asset_2 === 0) {
    const fixedOutputSwapQuote = Swap.v2.getQuote(
      SwapType.FixedOutput,
      pool,
      { id: pool.asset2ID, amount: Number(amount) * 10 ** assetOutDecimal },
      { assetIn: assetInDecimal, assetOut: assetOutDecimal }
    );
    return fixedOutputSwapQuote.assetInAmount;
  }

  if (asset_1 === 0) {
    const fixedOutputSwapQuote = Swap.v2.getQuote(
      SwapType.FixedOutput,
      pool,
      { id: pool.asset1ID, amount: Number(amount) * 10 ** assetOutDecimal },
      { assetIn: assetInDecimal, assetOut: assetOutDecimal }
    );
    return fixedOutputSwapQuote.assetInAmount;
  }

  console.log(`assetInDecimal: ${assetInDecimal}`);
  console.log(`assetOutDecimal: ${assetOutDecimal}`);
  console.log(`asset_1: ${asset_1}`);
  console.log(`asset_2: ${asset_2}`);

  if (asset_1 === pool.asset1ID) {
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
    return assetIn.amount;
  }

  const fixedInputSwapQuote = Swap.v2.getQuote(
    SwapType.FixedInput,
    pool,
    { id: pool.asset1ID, amount: Number(amount) * 10 ** assetOutDecimal },
    { assetIn: assetOutDecimal, assetOut: assetInDecimal }
  );
  const assetIn = {
    id: fixedInputSwapQuote.assetInID,
    amount: fixedInputSwapQuote.assetInAmount
  };
  const assetOut = {
    id: fixedInputSwapQuote.assetOutID,
    amount: fixedInputSwapQuote.assetOutAmount
  };

  console.log(assetIn.amount);
  console.log(assetOut.amount);

  return assetOut.amount;

  console.log('✅ Fixed Output Swap executed successfully!');
}
