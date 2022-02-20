import React, {useContext, useEffect, useRef} from "react";  
import {Link} from "react-router-dom";   //useEffect 사이드 이팩트가 발생할 때 사용
import { AuthContext } from "../context/AuthContext";
import {ImageContext} from "../context/ImageContext";
import "./ImageList.css";

const ImageList = () => {
    const {images,  isPublic, setIsPublic, loaderMoreImages, imageLoading, imageError } = useContext(ImageContext);
    const [me] = useContext(AuthContext);
    const elementRef = useRef(null);

    useEffect(()=> {
        if(!elementRef.current) return;
        const observer = new IntersectionObserver(([entry])=>{
            console.log('intersection', entry.isIntersecting);
            if(entry.isIntersecting) loaderMoreImages();
        });
        observer.observe(elementRef.current);
        return () => observer.disconnect();
    },[loaderMoreImages]);

    //console.log({images});
    const imgList = images.map((image, index) => (
        <Link key={image.key} to={`/images/${image._id}`} ref={index+5 === images.length ? elementRef : undefined}>
        <img 
        alt=""
        src={`http://localhost:5000/uploads/${image.key}`}/>
        </Link>
    ));
  
    return (
        <div>
            <h3 style={{display: "inline-block", marginRight: 10}}>Image List({(isPublic ? "공개" : "개인")} 사진)</h3>
            {me && <button onClick={() => setIsPublic(!isPublic)}>
                {(isPublic ? "개인" : "공개") + "사진 보기"}
                </button>}
                <div className="image-list-container">{imgList}</div>
                {imageError && <div>Error...</div>}
                {imageLoading ? (<div>Loading..</div>) : (<button onClick={loaderMoreImages}> Load More Images</button>)}
        </div>
    )};

export default ImageList;