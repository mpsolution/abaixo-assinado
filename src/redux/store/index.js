import {createStore ,applyMiddleware} from 'redux';
import rootReducer from '../reducers/';
import createSagaMiddleware from 'redux-saga'
import rootSaga from '../sagas/rootsaga'
import { composeWithDevTools } from 'redux-devtools-extension';
const sagaMiddleware = createSagaMiddleware()
export default store = createStore(rootReducer ,composeWithDevTools(
    applyMiddleware(sagaMiddleware)
) );
sagaMiddleware.run(rootSaga)
