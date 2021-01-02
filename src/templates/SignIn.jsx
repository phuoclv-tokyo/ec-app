import { push } from 'connected-react-router';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PrimaryButton, TextInput } from '../components/UIkit';
import { getLoadingState, getLoadingText } from '../reducks/loading/selectors';
import { signIn } from '../reducks/users/operations';

const SignIn = () => {
    const dispatch = useDispatch();
    const selector = useSelector(state => state);
    const loadingState = getLoadingState(selector);
    const loadingText = getLoadingText(selector);

    const [email, setEmail] = useState(""),
          [password, setPassword] = useState("");
    
    const inputEmail = useCallback((event) => {
        setEmail(event.target.value);
    }, [setEmail]);

    const inputPassword = useCallback((event) => {
        setPassword(event.target.value);
    }, [setPassword]);

    return (
        <div className="c-section-container">
            {loadingState && (
                <div className="c-section__loading">
                    <p>{loadingText}</p>
                </div>
            )}
            <h2 className="u-text__headline u-text-center">サインイン</h2>
            <div className="module-spacer--medium" />
            <TextInput 
                fullWidth={true} label={"メールアドレス"} required={true} multiline={false}
                rows={1} value={email} type={"email"} onChange={inputEmail}
            />
            <TextInput 
                fullWidth={true} label={"パスワード"} required={true} multiline={false}
                rows={1} value={password} type={"password"} onChange={inputPassword}
            />
            <div className="module-spacer--medium" />
            <div className="center">
                <PrimaryButton 
                    onClick={() => dispatch(signIn(email, password))}
                    label={"Sign in"}
                />
                <div className="module-spacer--medium" />
                <p onClick={() => dispatch(push('/signup'))}><a>アカウントをお持ちでない方はこちら</a></p>
                <p onClick={() => dispatch(push('/signin/reset'))}>パスワードをお忘れた方はこちら</p>
            </div>
        </div>
    )
}

export default SignIn