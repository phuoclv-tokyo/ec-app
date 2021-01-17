import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { SetSizeArea } from '../components/Products';
import ImageArea from '../components/Products/ImageArea';
import { PrimaryButton, SelectBox, TextInput } from '../components/UIkit';
import { db } from '../firebase';
import { saveProduct } from '../reducks/products/operations';

const ProductBox = () => {
    const dispatch = useDispatch();
    let id = window.location.pathname.split('/product/edit')[1];
    if (id !== "") {
        id = id.split('/')[1];
    }
    const [name, setName] = useState(""),
          [description, setDescription] = useState(""),
          [category, setCategory] = useState(""),
          [categories, setCategories] = useState([]),
          [gender, setGender] = useState(""),
          [images, setImages] = useState([]),
          [price, setPrice] = useState(""),
          [sizes, setSizes] = useState([]);

    const inputName = useCallback((event) => {
        setName(event.target.value)
    }, [setName]);

    const inputDescription = useCallback((event) => {
        setDescription(event.target.value)
    }, [setDescription]);

    const inputPrice = useCallback((event) => {
        setPrice(event.target.value)
    }, [setPrice]);

    const genders = [
        {id: "all", name: "すべて"},
        {id: "male", name: "メンス"},
        {id: "female", name: "レディース"},
    ];

    useEffect(() => {
        if (id !== "") {
            db.collection('products').doc(id).get()
                .then(snapshot => {
                    const data = snapshot.data();
                    setName(data.name);
                    setDescription(data.description);
                    setCategory(data.category);
                    setGender(data.gender);
                    setImages(data.images);
                    setPrice(data.price);
                    setSizes(data.sizes);
                })
        }
    }, [id]);

    useEffect(() => {
        db.collection('categories')
            .orderBy('order', 'asc')
            .get()
            .then(snapshots => {
                const list = []
                snapshots.forEach(snapshot => {
                    const data = snapshot.data()
                    list.push({
                        id: data.id,
                        name: data.name
                    })
                })
                setCategories(list)
            })
    }, [])

    return (
        <div className="c-section-container">
            <h2 className="u-text__headline u-text-center">商品の登録・編集</h2>
            <ImageArea images={images} setImages={setImages}/>
            <TextInput 
                fullWidth={true} label={"商品名"} required={true} multiline={false}
                rows={1} value={name} type={"text"} onChange={inputName}
            />
            <TextInput 
                fullWidth={true} label={"商品説明"} required={true} multiline={true}
                rows={5} value={description} type={"text"} onChange={inputDescription}
            />
            <SelectBox 
                label={"カテゴリ"} required={true} value={category} select={setCategory} options={categories}
            />
            <SelectBox 
                label={"性別"} required={true} value={gender} select={setGender} options={genders}
            />
            <TextInput 
                fullWidth={true} label={"価格"} required={true} multiline={false}
                rows={1} value={price} type={"number"} onChange={inputPrice}
            />
            <div className="module-spacer--small"/>
            <SetSizeArea sizes={sizes} setSizes={setSizes}/>
            <div className="module-spacer--small"/>
            <div className="center">
                <PrimaryButton 
                    label={"商品情報を登録する"}
                    onClick={() => dispatch(saveProduct(id, name, description, category, gender, price, images, sizes))}
                />
            </div>
        </div>
    )
}

export default ProductBox