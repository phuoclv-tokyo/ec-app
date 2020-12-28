import React from 'react';
import {useSelector} from 'react-redux';
import {getUserId, getUserName} from '../reducks/users/selectors';

const Home = () => {
    const selector = useSelector(state => state);
    const uid = getUserId(selector);
    const username = getUserName(selector);
    return (
        <div>
            <h2>ホーム</h2>
            {(uid !== "")&& (
                <div>
                    <p>ID: {uid}</p>
                    <p>Username: {username}</p>
                </div>
            )}
        </div>
    )
}

export default Home