import { push } from 'connected-react-router';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { PrimaryButton, TextInput } from '../components/UIkit';
import { resetPassword } from '../reducks/users/operations';

const Reset = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    
    const inputEmail = useCallback((event) => {
        setEmail(event.target.value);
    }, [setEmail]);

    return (
        <div className="c-section-container">
            <h2 className="u-text__headline u-text-center">リセットのパスワード</h2>
            <div className="module-spacer--medium" />
            <TextInput 
                fullWidth={true} label={"メールアドレス"} required={true} multiline={false}
                rows={1} value={email} type={"email"} onChange={inputEmail}
            />
            <div className="module-spacer--medium" />
            <div className="center">
                <PrimaryButton 
                    onClick={() => dispatch(resetPassword(email))}
                    label={"Reset Password"}
                />
                <div className="module-spacer--medium" />
                <p onClick={() => dispatch(push('/signin'))}>ログイン画面に戻る</p>
            </div>
        </div>
    )
}

export default Reset