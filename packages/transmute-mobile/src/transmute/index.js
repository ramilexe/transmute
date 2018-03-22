import * as actionCreators from './actions';
import * as middleware from './middleware';
import { initialState, reducer } from './reducers';
import init from './init';

export default {
  middleware,
  actionCreators,
  initialState,
  reducer,
  init
};
