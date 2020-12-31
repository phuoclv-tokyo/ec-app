import React from 'react';
import {getUserId, getUsername} from '../reducks/users/selectors';
import {useSelector} from 'react-redux';

const Home = () => {
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
        </div>
    )
}

export default Home