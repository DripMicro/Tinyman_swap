import * as React from 'react';
import { poolUtils, SupportedNetwork, Swap, SwapType } from '@tinymanorg/tinyman-js-sdk';
import { Account } from 'algosdk';
import { PeraWalletConnect } from '@perawallet/connect';
import { Dispatch } from 'redux';
import { algodClient } from '../../util/client';
import { sendSwapMessage } from '../../store/actionCreators';
import { addNote } from '../../store/actions';
// import signerWithPera from '../../util/initiatorSigner';
// import signerWithPera from '../../util/perawalletInitiatorSigner';

/**
 * Executes a swap with a fixed input amount
 * (Input amount is entered by the user, output amount is to be calculated by the SDK)
 */
export async function FixedInputSwap({
  asset_1,
  asset_2,
  amount,
  assetInDecimal,
  assetOutDecimal,
  account,
  perawallet,
  setMessage
}: {
  asset_1: number;
  asset_2: number;
  amount: string;
  assetInDecimal: number;
  assetOutDecimal: number;
  account: string;
  perawallet: PeraWalletConnect;
  setMessage: any;
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
    console.log(assetIn);
    console.log(assetOut);
  }

  let fixedInputSwapTxns = await Swap.v2.generateTxns({
    client: algodClient,
    swapType: SwapType.FixedInput,
    pool,
    initiatorAddr,
    assetIn,
    assetOut,
    slippage: 0.05
  });

  if (asset_2 === 0) {
    const fixedInputSwapQuote = Swap.v2.getQuote(
      SwapType.FixedOutput,
      pool,
      { id: pool.asset1ID, amount: Number(amount) * 10 ** assetInDecimal },
      { assetIn: assetInDecimal, assetOut: assetOutDecimal }
    );
    assetOut = {
      id: fixedInputSwapQuote.assetInID,
      amount: fixedInputSwapQuote.assetInAmount
    };
    assetIn = {
      id: fixedInputSwapQuote.assetOutID,
      amount: fixedInputSwapQuote.assetOutAmount
    };

    console.log(assetIn);
    console.log(assetOut);

    fixedInputSwapTxns = await Swap.v2.generateTxns({
      client: algodClient,
      swapType: SwapType.FixedInput,
      pool,
      initiatorAddr,
      assetIn,
      assetOut,
      slippage: 0.05
    });
  }

  if (asset_1 !== pool.asset1ID && asset_1 !== 0 && asset_2 !== 0) {
    console.log(pool.asset1ID);
    console.log(pool.asset2ID);
    console.log(assetOutDecimal);
    console.log(assetInDecimal);
    console.log(amount);

    const fixedOutputSwapQuote = Swap.v2.getQuote(
      SwapType.FixedOutput,
      pool,
      { id: pool.asset2ID, amount: Number(amount) * 10 ** assetInDecimal },
      { assetIn: assetOutDecimal, assetOut: assetInDecimal }
    );

    assetIn = {
      id: fixedOutputSwapQuote.assetInID,
      amount: fixedOutputSwapQuote.assetInAmount
    };
    assetOut = {
      id: fixedOutputSwapQuote.assetOutID,
      amount: fixedOutputSwapQuote.assetOutAmount
    };

    fixedInputSwapTxns = await Swap.v2.generateTxns({
      client: algodClient,
      swapType: SwapType.FixedOutput,
      pool,
      initiatorAddr,
      assetIn,
      assetOut,
      slippage: 0.05
    });

    console.log(fixedInputSwapTxns);
  }

  console.log(`assetIn.amount: ${assetIn.amount}`);
  console.log(`assetOut.amount: ${assetOut.amount}`);

  console.log(fixedInputSwapTxns);

  const signedTxns = await perawallet.signTransaction([fixedInputSwapTxns]);

  console.log(signedTxns);
  // const signedTxns = await Swap.v2.signTxns({
  //   txGroup: fixedInputSwapTxns,
  //   initiatorSigner: signerWithPera(account, perawallet)
  // });

  try {
    const swapExecutionResponse = await Swap.v2.execute({
      network: 'mainnet' as SupportedNetwork,
      client: algodClient,
      signedTxns,
      pool,
      txGroup: fixedInputSwapTxns,
      assetIn
    });
    console.log('✅ Fixed Input Swap executed successfully!');
    console.log({ txnID: swapExecutionResponse.txnID });
    setMessage('Swap executed successfully!');

    return 'xecuted successfully!';
  } catch (e) {
    console.log(e);
    setMessage('Swap failed');
    return 'Swap failed!';
  }
}
