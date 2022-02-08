import React, { useContext, useState } from 'react';
import axios from "axios";                  //
import { toast } from "react-toastify";     //error massage 출력
import "./UploadForm.css";
import ProgressBar from './ProgressBar';
import {ImageContext} from "../context/ImageContext";

const UploadForm = () => {
    const [images, setImages] = useContext(ImageContext);
    const defaultFileName = "이미지 파일을 업로드 해주세요.";
    const [file, setFile] = useState(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [fileName, setFileName] = useState(defaultFileName);
    const [percent, setPercent] = useState(0);
    const [isPublic, setIsPublic] = useState(true);

    const imageSelectHandler = (event) => {
        const imageFile = event.target.files[0];
        //console.log({imageFile});
        setFile(imageFile);
        setFileName(imageFile.name);
        const fileReader = new FileReader();
        fileReader.readAsDataURL(imageFile);
        fileReader.onload = e => setImgSrc(e.target.result);
    };
    console.log({isPublic});
    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", file);
        formData.append("public", isPublic);
        try {
            const res = await axios.post("/images", formData, {
                headers: {"Content-Type":"multipart/form-data"},
                // 현재 이미지 업로드 진행상황 표현 함수
                onUploadProgress: (e) => {
                    //console.log(ProgressEvent);
                    setPercent(Math.round((100*e.loaded) / e.total));
                },
            });
            setImages([...images, res.data]);
            //console.log({res});
            toast.success("이미지 업로드 성공!");
            // 이미지 업로드 성공 후 초기화
            setTimeout(() => {
                setPercent(0);                  //퍼센트 초기화
                setFileName(defaultFileName);   //파일명 초기화
                setImgSrc(null);                //이미지 초기화
            }, 3000);
        } catch(err) {
            //alert("fail!!");
            toast.error(err.response.data.message);
            setPercent(0);
            setFileName(defaultFileName);
            console.error(err);
        }
    };

    return (
        
        <form onSubmit={onSubmit}>
            <img src={imgSrc} alt="" className={`image-preview ${imgSrc && "image-preview-show"}`} />
            <ProgressBar percent={percent}/>
            <div className="file-dropper">
                {fileName}
                <input 
                id="image" 
                type="file" 
                accept="image/*" //이미지 파일만 업로드 설정
                onChange={imageSelectHandler} 
                />
            </div>
            <input type="checkbox" id="public-check" value={!isPublic} onChange={() => setIsPublic(!isPublic)}/>
            <label htmlFor="public-check">비공개</label>
        <button type="submit" style={{width:"100%", height:40, borderRadius:3, cursor:'pointer'}}> 제출 </button>
      </form>
    );
};

export default UploadForm;