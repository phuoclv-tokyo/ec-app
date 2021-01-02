import React from 'react';
import {getUserId, getUsername} from '../reducks/users/selectors';
import {useDispatch, useSelector} from 'react-redux';
import { signOut } from '../reducks/users/operations';

const Home = () => {
    const dispatch = useDispatch();
    const selector = useSelector(state => state);
    const uid = getUserId(selector);
    const username = getUsername(selector);
    const isSignedIn = selector.users.isSignedIn;
    return (
        <div>
            <h2>ホーム</h2>
            {(isSignedIn) && (
                <div>
                    <p>ID: {uid}</p>
                    <p>Username: {username}</p>
                </div>
            )}
            <button onClick={() => dispatch(signOut())} >SIGN OUT</button>
        </div>
    )
}

export default Home