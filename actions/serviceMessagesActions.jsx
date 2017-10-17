import * as types from './actionTypes';

export function dispatchServiceMessage(messageConfig){
  return {
    type: types.DISPATCH_SERVICE_MESSAGE,
    payload: messageConfig
  }
}
