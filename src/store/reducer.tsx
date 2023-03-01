/* eslint default-case: "error" */
import * as actionTypes from './actionTypes';

const reducer = (state = '', action: SwapAction): any => {
  switch (action.type) {
    case actionTypes.SWAP_MESSAGE: {
      const swapMesage: string = action.message;
      return {
        message: swapMesage
      };
    }
    // no default
  }
  return state;
};

export default reducer;
