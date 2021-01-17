import { isValidEmailFormat, isValidRequiredInput } from '../../function/common';
import {hideLoadingAction, showLoadingAction} from '../loading/actions';
import { auth, db, FirebaseTimestamp } from '../../firebase';
import { push } from 'connected-react-router';
import { fetchOrdersHistoryAction, fetchProductsInCartAction, signInAction, signOutAction } from './actions';

const usersRef = db.collection('users');

export const addProductToCart = (addedProduct) => {
    return async (dispatch, getState) => {
        const uid = getState().users.uid;
        const cartRef = usersRef.doc(uid).collection('cart').doc();
        addedProduct['cartId'] = cartRef.id;
        await cartRef.set(addedProduct);
        dispatch(push('/'));
    }
}

export const fetchOrdersHistory = () => {
    return async (dispatch, getState) => {
        const uid = getState().users.uid;
        const list = [];

        db.collection('users').doc(uid)
            .collection('orders')
            .orderBy('updated_at', 'desc')
            .get()
            .then((snapshots) => {
                snapshots.forEach(snapshot => {
                    const data = snapshot.data()
                    list.push(data)
                });
                dispatch(fetchOrdersHistoryAction(list));
            })
    }
}

export const fetchProductsInCart = (products) => {
    return async (dispatch) => {
        dispatch(fetchProductsInCartAction(products));
    }
}

export const listenAuthState = () => {
    return async (dispatch) => {
        auth.onAuthStateChanged(user => {
            if (user) {
                const userId = user.uid;

                usersRef.doc(userId).get().then(snapshot => {
                    const data = snapshot.data();
                    dispatch(signInAction({
                        isSignedIn: true,
                        role: data.role,
                        uid: userId,
                        username: data.username
                    }));
                })
            } else {
                dispatch(push('/signin'));
            }
        })
    }
}

export const signUp = (username, email, password, confirmPassword) => {
    return async (dispatch) => {
        dispatch(showLoadingAction("Sign up..."));
        // Validation
        if (!isValidRequiredInput(username, email, password, confirmPassword)) {
            dispatch(hideLoadingAction());
            alert('必須項目が未入力です。');
            return false;
        }
        if (!isValidEmailFormat(email)) {
            dispatch(hideLoadingAction());
            alert('メールアドレスの形式が不正です。もう１度お試しください。');
            return false;
        }
        if (password !== confirmPassword) {
            dispatch(hideLoadingAction());
            alert('パスワードが一致しません。もう１度お試しください。');
            return false;
        }
        if (password.length < 6) {
            dispatch(hideLoadingAction());
            alert('パスワードが６文字以上入力してください。')
            return false;
        }

        return auth.createUserWithEmailAndPassword(email, password)
                .then(result => {
                    dispatch(showLoadingAction("Loading..."));
                    const userState = result.user;
                    const timestamp = FirebaseTimestamp.now();

                    if (userState) {
                        const userId = userState.uid;
                        const userInitialData = {
                            created_at: timestamp,
                            email: email,
                            role: "customer",
                            uid: userId,
                            username: username,
                            updated_at: timestamp
                        }

                        usersRef.doc(userId).set(userInitialData)
                            .then(() => {
                                dispatch(hideLoadingAction());
                                dispatch(push('/'));
                            })
                    }

                }).catch((error) => {
                    dispatch(hideLoadingAction());
                    switch (error.code) {
                        case 'auth/email-already-in-use':
                            // console.log(`Email address ${this.state.email} already in use.`);
                            alert(`メースアドレス：${email}が既に存在されている。\n別のメールアドレスで登録してください。`);
                            break;
                        case 'auth/invalid-email':
                            // console.log(`Email address ${this.state.email} is invalid.`);
                            alert(`メールアドレス：${email}の形式が不正です。`);
                            break;
                        case 'auth/operation-not-allowed':
                            //console.log(`Error during sign up.`);
                            alert(`サインアップ中にエラーが発生しました。`);
                            break;
                        case 'auth/weak-password':
                            //console.log('Password is not strong enough. Add additional characters including special characters and numbers.');
                            alert(`パスワードが十分に強力ではありせん。\n特殊文字や数字などの文字を追加してください。`)
                            break;
                        default:
                            console.log(error.message);
                            break;
                    }
                    
                })
    }
}

export const signIn = (email, password) => {
    return async (dispatch) => {
        dispatch(showLoadingAction("Sign in..."));
        // Validation
        if (!isValidRequiredInput(email, password)) {
            dispatch(hideLoadingAction());
            alert('必須項目が未入力です。');
            return false;
        }
        if (!isValidEmailFormat(email)) {
            dispatch(hideLoadingAction());
            alert('メールアドレスの形式が不正です。もう１度お試しください');
            return false;
        }

        return auth.signInWithEmailAndPassword(email, password)
                .then(result => {
                    dispatch(showLoadingAction("Loading..."));
                    const userState = result.user;
                    if (!userState) {
                        dispatch(hideLoadingAction());
                        alert('ユーザIDが存在しません。もう１度お試しください。');
                        return false;
                    }
                    const userId = userState.uid;

                    usersRef.doc(userId).get().then(snapshot => {
                        const data = snapshot.data();
                        if (!data) {
                            dispatch(hideLoadingAction());
                            alert('ユーザーデータが存在しません。');
                            return false;
                        }

                        dispatch(signInAction({
                            isSignedIn: true,
                            role: data.role,
                            uid: userId,
                            username: data.username
                        }));
                        dispatch(push('/'));
                    })
                }).catch(error => {
                    dispatch(hideLoadingAction());
                    switch (error.code) {
                        case 'auth/email-already-in-use':
                            // console.log(`Email address ${this.state.email} already in use.`);
                            alert(`メースアドレス：${email}が既に存在されている。\n別のメールアドレスで登録してください。`);
                            break;
                        case 'auth/invalid-email':
                            // console.log(`Email address ${this.state.email} is invalid.`);
                            alert(`メールアドレス：${email}の形式が不正です。`);
                            break;
                        case 'auth/operation-not-allowed':
                            //console.log(`Error during sign up.`);
                            alert(`サインアップ中にエラーが発生しました。`);
                            break;
                        case 'auth/weak-password':
                            //console.log('Password is not strong enough. Add additional characters including special characters and numbers.');
                            alert(`パスワードが十分に強力ではありせん。\n特殊文字や数字などの文字を追加してください。`)
                            break;
                        case 'auth/user-not-found':
                            alert(`メールアドレス：${email}が存在しません。もう１度お試しください。`);
                            break;
                        case 'auth/wrong-password':
                            // The password is invalid or the user does not have a password.
                            alert(`パスワードが無効です。もう１度お試しください。`);
                            break;
                        default:
                            console.log(error.message);
                            break;
                    }
                })
    }
} 

export const signOut = () => {
    return async (dispatch) => {
        auth.signOut()
            .then(() => {
                dispatch(hideLoadingAction());
                dispatch(signOutAction());
                dispatch(push('/signin'));
            })
    }
}

export const resetPassword = (email) => {
    return async (dispatch) => {
        if (!isValidRequiredInput(email)) {
            alert('必須項目が未入力です。');
            return false;
        }
        if (!isValidEmailFormat(email)) {
            alert('メールアドレスの形式が不正です。')
            return false;
        }
        auth.sendPasswordResetEmail(email)
            .then(() => {
                alert('入力したメールアドレス宛にパスワードリセット用のメールをお送りしましたのでご確認ください。');
                dispatch(push('/signin'));
            }).catch(() => {
                alert('登録されていないメールアドレスです。もう一度ご確認ください。');
            })
    }
} 
