import * as actionTypes from './actionTypes';

export function sendSwapMessage(message: string) {
  const action: SwapAction = {
    type: actionTypes.ADD_ARTICLE,
    message
  };

  return simulateHttpRequest(action);
}

export function simulateHttpRequest(action: SwapAction) {
  return (dispatch: DispatchType) => {
    setTimeout(() => {
      dispatch(action);
    }, 500);
  };
}
