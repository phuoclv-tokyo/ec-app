import { AlternateEmail } from "@material-ui/icons";
import { push } from "connected-react-router";
import { db, FirebaseTimestamp } from "../../firebase";
import { isValidRequiredInput } from "../../function/common";
import {fetchProductsAction, deleteProductAction} from './actions';

const productsRef = db.collection('products');

export const deleteProduct = (id) => {
    return async (dispatch, getState) => {
        productsRef.doc(id).delete()
            .then(() => {
                const prevProducts = getState().products.list;
                const nextProducts = prevProducts.filter(product => product.id != id);
                dispatch(deleteProductAction(nextProducts));
            })
    }
}

export const fetchProducts = (gender, category) => {
    return async (dispatch) => {
        let query = productsRef.orderBy('updated_at', 'desc');
        query = (gender !== "") ? query.where('gender', '==', gender) : query;
        query = (category !== "") ? query.where('category', '==', category) : query

        query.get()
            .then(snapshots => {
                const productList = [];
                snapshots.forEach(snapshot => {
                    const product = snapshot.data();
                    productList.push(product);
                });
                dispatch(fetchProductsAction(productList));
            });
    }
}

export const orderProduct = (productsInCart, amount) => {
    return async (dispatch, getState) => {
        const uid = getState().users.uid;
        const userRef = db.collection('users').doc(uid);
        const timestamp = FirebaseTimestamp.now();

        let products = [],
            soldOutProducts = [];
        
        const batch = db.batch();

        for (const product of productsInCart) {
            const snapshot = await productsRef.doc(product.productId).get();
            const sizes = snapshot.data().sizes;

            const updatedSizes = sizes.map(size => {
                if (size.size === product.size) {
                    console.log(size.quantity);
                    if (size.quantity === 0) {
                        soldOutProducts.push(product.name);
                        return size;
                    }
                    return {
                        size: size.size,
                        quantity: size.quantity - 1
                    }
                } else {
                    return size;
                }
            });

            products.push({
                id: product.productId,
                images: product.images,
                name: product.name,
                price: product.price,
                size: product.size
            });

            console.log(products);

            batch.update(
                productsRef.doc(product.productId),
                {sizes: updatedSizes}
            );

            batch.delete(
                userRef.collection('cart').doc(product.cartId)
            );
        }
        if (soldOutProducts.length > 0) {
            const errorMessage = (soldOutProducts.length > 1) ?
                                 soldOutProducts.join('と') :
                                 soldOutProducts[0];
            alert('大変申し訳ございません。' + errorMessage + 'が在庫切れとなったため、注文処理を中断しました。');
            return false;
        } else {
            batch.commit()
                .then(() => {
                    const orderRef = userRef.collection('orders').doc();
                    const date = timestamp.toDate();
                    const shippingDate = FirebaseTimestamp.fromDate(new Date(date.setDate(date.getDate() + 3)));

                    const history = {
                        amount: amount,
                        created_at: timestamp,
                        id: orderRef.id,
                        products: products,
                        shipping_date: shippingDate,
                        updated_at: timestamp
                    }

                    orderRef.set(history);
                    dispatch(push('/order/complete'));
                }).catch(() => {
                    alert('注文処理に失敗しました。通信環境をご確認の上、もう一度お試しください。');
                    return false;
                })
        }
    }
}

export const saveProduct = (id ,name, description, category, gender, price, images, sizes) => {
    return async (dispatch) => {
        if (!isValidRequiredInput(name, description, category, gender, price)) {
            alert('必須項目が未入力です。');
            return false;
        }
        if (images.length === 0) {
            alert('画像が未入力です。');
            return false;
        }
        const timestamp = FirebaseTimestamp.now();

        const data = {
            name: name,
            description: description,
            category: category,
            gender: gender,
            images: images,
            price: parseInt(price, 10),
            sizes: sizes,
            updated_at: timestamp
        }

        if (id === "") {
            const ref = productsRef.doc();
            id = ref.id
            data.id = id;
            data.created_at = timestamp;
        }
        return productsRef.doc(id).set(data, {merge: true})
            .then(() => {
                dispatch(push('/'));
            }).catch((error) => {
                throw new Error(error.message);
            })
    }
}