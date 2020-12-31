import {signInAction} from './actions';
import {push} from 'connected-react-router';
import {isValidEmailFormat, isValidRequiredInput} from '../../function/common';
import { auth, db, FirebaseTimestamp } from '../../firebase';

export const signIn = (email, password) => {
    return async (dispatch) => {
        // Validation
        if (!isValidRequiredInput(email, password)) {
            alert('必須項目が未入力です。');
            return false;
        }

        if (!isValidEmailFormat(email)) {
            alert('メールアドレスの形式が不正です。もう1度お試しください。');
            return false;
        }

        return auth.signInWithEmailAndPassword(email, password)
            .then(result => {
                const userState = result.user;

                if (userState) {
                    const userId = userState.uid;
                    db.collection('users').doc(userId).get().then(snapshort => {
                        const data = snapshort.data();
                        dispatch(signInAction({
                            isSignedIn: true,
                            role: data.role,
                            uid: userId,
                            username: data.username
                        }));
                        dispatch(push('/'));
                    })
                }
            })
    }
}

export const signUp = (username, email, password, confirmPassword) => {
    return async (dispatch) => {
        // Validation
        if (!isValidRequiredInput(username, email, password, confirmPassword)) {
            alert('必須項目が未入力です。');
            return false;
        }

        if (!isValidEmailFormat(email)) {
            alert('メールアドレスの形式が不正です。もう1度お試しください。');
            return false;
        }

        if (password !== confirmPassword) {
            alert('パスワードが一致しません。もう１度お試しください。');
            return false;
        }

        if (password.length < 6) {
            alert('パスワードが６文字以上で入力してください');
            return false;
        }

        return auth.createUserWithEmailAndPassword(email, password)
            .then(result => {
                const userState = result.user;
                if (userState) {
                    const uid = userState.uid;
                    const timestamp = FirebaseTimestamp.now();

                    const userInitialData = {
                        created_at: timestamp,
                        email: email,
                        role: "customer",
                        uid: uid,
                        username: username,
                        updated_at: timestamp
                    }

                    db.collection('users').doc(uid).set(userInitialData)
                        .then(() => {
                            dispatch(push('/'))
                        })
                }
            })

    }
}