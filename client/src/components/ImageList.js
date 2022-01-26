import React, {useEffect, useState, useContext} from "react";     //useEffect 사이드 이팩트가 발생할 때 사용
import axios from "axios";
import {ImageContext} from "../context/ImageContext";

const ImageList = () => {
    const [images] = useContext(ImageContext);
    //console.log({images});
    const imgList = images.map((image) => (
        <img 
        key={image.key}
        style={{width:"100%"}} 
        src={`http://localhost:5000/uploads/${image.key}`}/>
    ));
    return (
        <div>
            <h3>Image List</h3>
            {imgList}
        </div>
    )};

export default ImageList;