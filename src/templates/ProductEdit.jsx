import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import ImageArea from '../components/Products/ImageArea';
import { PrimaryButton, SelectBox, TextInput } from '../components/UIkit';
import { saveProduct } from '../reducks/products/operations';

const ProductBox = () => {
    const dispatch = useDispatch();

    const [name, setName] = useState(""),
          [description, setDescription] = useState(""),
          [category, setCategory] = useState(""),
          [gender, setGender] = useState(""),
          [images, setImages] = useState([]),
          [price, setPrice] = useState("");

    const inputName = useCallback((event) => {
        setName(event.target.value)
    }, [setName]);

    const inputDescription = useCallback((event) => {
        setDescription(event.target.value)
    }, [setDescription]);

    const inputPrice = useCallback((event) => {
        setPrice(event.target.value)
    }, [setPrice]);

    const categories = [
        {id: "tops", name: "トップス"},
        {id: "shirts", name: "シャツ"},
        {id: "pant", name: "パンツ"},
    ];

    const genders = [
        {id: "all", name: "すべて"},
        {id: "male", name: "メンス"},
        {id: "female", name: "レディース"},
    ];

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
            <div className="module-spacer--medium"/>
            <div className="center">
                <PrimaryButton 
                    label={"商品情報を登録する"}
                    onClick={() => dispatch(saveProduct(name, description, category, gender, price, images))}
                />
            </div>
        </div>
    )
}

export default ProductBox