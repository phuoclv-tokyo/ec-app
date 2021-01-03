import {
    createStore as reduxCreateStore,
    combineReducers,
    applyMiddleware
} from 'redux';
import {createLogger} from 'redux-logger/src';
import {connectRouter, routerMiddleware} from 'connected-react-router';
import thunk from 'redux-thunk';

import {ProductsReducer} from '../products/reducers';
import {UsersReducer} from '../users/reducers';
import {LoadingReducer} from '../loading/reducers';

export default function createStore(history) {
    const logger = createLogger({
        collapsed: true,
        diff: true
    });
    return reduxCreateStore(
        combineReducers({
            router: connectRouter(history),
            loading: LoadingReducer,
            users: UsersReducer,
            products: ProductsReducer
        }),
        applyMiddleware(
            routerMiddleware(history),
            thunk
        )
    )
}