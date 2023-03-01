import { Action } from './actions';

export interface NotesState {
  message: string;
  isConnected: boolean;
  walletAddress: string;
}

const initialState = {
  message: '',
  isConnected: false,
  walletAddress: ''
};

export const notesReducer = (state: NotesState = initialState, action: Action) => {
  switch (action.type) {
    case 'ADD_NOTE':
      return { ...state, message: action.payload };
    case 'CONNECTED_WALLET':
      return { ...state, isConnected: action.isConnected };
    case 'WALLETADDRESS': {
      console.log(`address :${action.walletAddress}`);
      return { ...state, walletAddress: action.walletAddress };
    }
    default:
      return state;
  }
};
