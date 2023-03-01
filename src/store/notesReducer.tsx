import { Action } from './actions';

export interface NotesState {
  message: string;
}

const initialState = {
  message: ''
};

export const notesReducer = (state: NotesState = initialState, action: Action) => {
  switch (action.type) {
    case 'ADD_NOTE':
      return { ...state, message: action.payload };
    default:
      return state;
  }
};
