import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';

import reducers from '../reducers';
import transmute from './transmute';

export const store = createStore(
  combineReducers({
    transmuteReducer: transmute.reducer,
    documentReducer: reducers.documentReducer
  }),
  {},
  compose(
    applyMiddleware(thunk),
  )
);

transmute.init(store);