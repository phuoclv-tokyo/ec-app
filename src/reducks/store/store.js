import {
    createStore as reduxCreateStore,
    combineReducers,
    applyMiddleware
} from 'redux';

import {connectRouter, routerMiddleware} from 'connected-react-router';
import thunk from 'redux-thunk';
import {UsersReducer} from '../users/reducers';
import {LoadingReducer} from '../loading/reducers';

export default function createStore(history) {
    return reduxCreateStore(
        combineReducers({
            router: connectRouter(history),
            loading: LoadingReducer,
            users: UsersReducer
        }),
        applyMiddleware(
            routerMiddleware(history),
            thunk
        )
    )
}