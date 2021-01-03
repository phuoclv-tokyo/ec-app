import { push } from 'connected-react-router';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {PrimaryButton, TextInput} from '../components/UIkit';
import { getLoadingState, getLoadingText } from '../reducks/loading/selectors';
import { signUp } from '../reducks/users/operations';

const SignUp = () => {
    const dispatch = useDispatch();
    const selector = useSelector(state => state);
    const loadingText = getLoadingText(selector);
    const loadingState = getLoadingState(selector);

    const [username, setUsername] = useState(""),
          [email, setEmail] = useState(""),
          [password, setPassword] = useState(""),
          [confirmPassword, setConfirmPassword] = useState("");

    const inputUsername = useCallback((event) => {
        setUsername(event.target.value);
    }, [setUsername]);

    const inputEmail = useCallback((event) => {
        setEmail(event.target.value);
    }, [setEmail]);

    const inputPassword = useCallback((event) => {
        setPassword(event.target.value);
    }, [setPassword]);

    const inputConfirmPassword = useCallback((event) => {
        setConfirmPassword(event.target.value);
    }, [setConfirmPassword]);

    return (
        <div className="c-section-container">

            {loadingState && (
                <div className="c-section__loading">
                    <p>{loadingText}</p>
                </div>
            )}
            
            <h2 className="u-text__headline u-text-center" >アカウント登録</h2>
            <div className="module-spacer--medium" />
            <TextInput 
                fullWidth={true} label={"ユーザー名"} required={true} multiline={false}
                rows={1} value={username} type={"text"} onChange={inputUsername}
            />
            <TextInput 
                fullWidth={true} label={"メールアドレス"} required={true} multiline={false}
                rows={1} value={email} type={"email"} onChange={inputEmail}
            />
            <TextInput 
                fullWidth={true} label={"パスワード"} required={true} multiline={false}
                rows={1} value={password} type={"password"} onChange={inputPassword}
            />
            <TextInput 
                fullWidth={true} label={"パスワード（再確認）"} required={true} multiline={false}
                rows={1} value={confirmPassword} type={"password"} onChange={inputConfirmPassword}
            />
            <div className="module-spacer--medium" />
            <div className="u-text-center" >
                <PrimaryButton 
                    onClick={() => dispatch(signUp(username, email, password, confirmPassword))}
                    label={"アカウントを登録する"}
                />
                <div className="module-spacer--medium" />
                <p onClick={() => dispatch(push('/signin'))} >アカウントをお持ちの方はこちら</p>
            </div>
        </div>
    )
}

export default SignUp