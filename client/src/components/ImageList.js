import React, {useEffect, useState} from "react";     //useEffect 사이드 이팩트가 발생할 때 사용
import axios from "axios";

const ImageList = () => {
    const [images, setImages] = useState([]);
    useEffect(() => {
        axios
        .get("/images")
        .then((result) => console.log({result}))
        .catch((err) => console.error(err));
    },[]);
    //console.log({images});
    const imgList = images.map((image) => (
        <img style={{width:"100%"}} src={`http://localhost:5000/uploads/${image.key}`}/>
    ));
    return (
        <div>
            <h3>Image List</h3>
            {imgList}
        </div>
    )};

export default ImageList;