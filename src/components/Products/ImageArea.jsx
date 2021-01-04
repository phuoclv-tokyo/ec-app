import React, { useCallback } from 'react';
import IconButton from '@material-ui/core/IconButton';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import { makeStyles } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoadingAction, showLoadingAction } from '../../reducks/loading/actions';
import {storage} from '../../firebase/index';
import ImagePreview from './ImagePreview';
import { getLoadingText } from '../../reducks/loading/selectors';

const useStyles = makeStyles({
    "icon": {
        height: 48,
        width: 48
    }
})

const ImageArea = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const selector = useSelector((state) => state);
    const loadingState = getLoadingText(selector);
    const loadingText = getLoadingText(selector);

    const deleteImage = useCallback(async(id) => {
        const ret = window.confirm('この画像を削除しますか？');
        if (!ret) {
            return false;
        } else {
            const newImage = props.images.filter(image => image.id !== id);
            props.setImages(newImage);
            return storage.ref('images').child(id).delete();
        }
    }, [props.images]);

    const uploadImage = useCallback((event) => {
        dispatch(showLoadingAction("uploading..."));
        const file = event.target.files;
        let blob = new Blob(file, {type: "image/jpeg"});

        // Generate random 16 digits strings
        const S = "abcdefghijklmnopgrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const N = 16;
        const fileName = Array.from(crypto.getRandomValues(new Uint32Array(N))).map((n)=>S[n%S.length]).join('');

        const uploadRef = storage.ref('images').child(fileName);
        const uploadTask = uploadRef.put(blob);

        uploadTask.then(() => {
            // Handle sucessful uploads on complete
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                const newImage = {id: fileName, path: downloadURL};
                props.setImages((prevState => [...prevState, newImage]));
                dispatch(hideLoadingAction());
            });
        }).catch(() => {
            dispatch(hideLoadingAction());
        });
    }, [props.setImages]);
    return (
        <div>
            <div className="p-grid__list-images">
                {props.images.length > 0 && (
                    props.images.map(image => <ImagePreview delete={deleteImage} id={image.id} path={image.path} key={image.id} />)
                )}
            </div>
            <div className="u-text-right">
                <span>商品画像を登録する</span>
                {loadingState && (
                    <div className="c-section__loading">
                        <p>{loadingText}</p>
                    </div>
                )}
                <IconButton className={classes.icon}>
                    <label>
                        <AddPhotoAlternateIcon />
                        <input 
                            className="u-display-none" type="file" id="image"
                            onChange={(event) => uploadImage(event)}
                        />
                    </label>
                </IconButton>
            </div>
        </div>
    )
}

export default ImageArea