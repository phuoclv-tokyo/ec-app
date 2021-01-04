import { AlternateEmail } from "@material-ui/icons";
import { push } from "connected-react-router";
import { db, FirebaseTimestamp } from "../../firebase";
import { isValidRequiredInput } from "../../function/common";
import { hideLoadingAction } from "../loading/actions";

const productsRef = db.collection('products');

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