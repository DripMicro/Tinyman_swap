export type Action = {
  type: string;
  payload: string;
  isConnected: boolean;
  walletAddress: string;
};

export const addNote = (note: string): Action => ({
  type: 'ADD_NOTE',
  payload: note,
  isConnected: true,
  walletAddress: ''
});

export const isConnected = (note: boolean): Action => ({
  type: 'CONNECTED_WALLET',
  payload: '',
  isConnected: note,
  walletAddress: ''
});

export const getWalletAddress = (note: string): Action => ({
  type: 'WALLETADDRESS',
  payload: '',
  isConnected: true,
  walletAddress: note
});
