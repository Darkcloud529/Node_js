import React, {useContext, useEffect, useState} from "react";
import { useParams } from "react-router";
import {ImageContext} from "../context/ImageContext"
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

const ImagePage = () => {
    const navigate = useNavigate();
    const {imageId} = useParams(); 
    const { images, setImages, setMyImages } = useContext(ImageContext);
    const [me] = useContext(AuthContext);
    const [hasLiked, setHasLiked] = useState(false);
    const [image,setImage] = useState();
    const [error, setError] = useState(false);

    useEffect(() => {
        const img = images.find((image) => image._id === imageId);
        if(img) setImage(img);
    },[images, imageId]);

    useEffect(()=> {
        if(image && image._id === imageId) return; //배열에 이미지가 존재할 때 
        else {
            // 배열에 이미지가 존재하지 않으면 무조건 서버 호출한다. 
        axios.get(`/images/${imageId}`)
        .then(({data}) => {
            setImage(data);
            setError(false);
        })
        .catch((err) => {
            setError(true);
            toast.error(err.response.data.message)}
            );
    }
    },[imageId, image]);

    useEffect(() => {
        if(me && image && image.likes.includes(me.userId)) setHasLiked(true);
    }, [me, image]);
    if(error) return <h3>Error...</h3>
    else if(!image) return <h3>loading...</h3>;
    //이미지 표시 함수
    const updateImage = (images, image) => 
    [...images.filter((image) => image._id !== imageId), image].sort(
        (a,b) => {
            if(a._id < b._id) return 1;
            else return -1;
        });
        
    // 좋아요 함수
    const onSubmit = async () => {
        const result = await axios.patch(`/images/${imageId}/${hasLiked ? "unlike" : "like"}`);
        if(result.data.public) 
            setImages((prevData) => updateImage(prevData, result.data));
        setMyImages((prevData) => updateImage(prevData, result.data));
    
        setHasLiked(!hasLiked);
    };

    // 이미지 삭제 함수
    const deleteHandler = async() => {
        try {
            if(!window.confirm("정말 해당 이미지를 삭제하시겠습니까?")) return;
            const result = await axios.delete(`/images/${imageId}`);
            toast.success(result.data.message);
            setImages((prevData) => prevData.filter((image) => image._id !== imageId));
            setMyImages((prevData) => prevData.filter((image) => image._id !== imageId));
            navigate("/");
        } catch(err) {
            toast.error(err.message);
        }
    };

    return (
    <div>
        <h3>Image Page - {imageId} </h3>
        <img 
            style={{width:"100%"}} 
            alt={imageId} 
            src={`https://image-upload-tutorial-smlee.s3.ap-northeast-2.amazonaws.com/raw/${image.key}`}
        />
        <span> 좋아요 {image.likes.length} </span>
        {me && image.user._id === me.userId && (
            <button 
                style={{float:"right", marginLeft: 10 }} 
                onClick={deleteHandler}> 
            삭제 
            </button>
            )}
        <button style={{float:"right"}} onClick={onSubmit}>
            {hasLiked ? "좋아요 취소" : "좋아요"}
        </button>
    </div>
    );
};

export default ImagePage;