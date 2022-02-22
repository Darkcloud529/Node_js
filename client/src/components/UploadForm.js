import React, { useContext, useState } from 'react';
import axios from "axios";                  //
import { toast } from "react-toastify";     //error massage 출력
import "./UploadForm.css";
import ProgressBar from './ProgressBar';
import {ImageContext} from "../context/ImageContext";

const UploadForm = () => {
    const { setImages, setMyImages } = useContext(ImageContext);
    const [files, setFiles] = useState(null);
    
    const [previews, setPreviews] = useState([]);

    const [percent, setPercent] = useState(0);
    const [isPublic, setIsPublic] = useState(true);

    const imageSelectHandler = async (event) => {
        const imageFiles = event.target.files;
        //console.log({imageFile});
        setFiles(imageFiles);

        const imagePreviews = await Promise.all(
            [...imageFiles].map(async (imageFile) => {
                return new Promise((resolve, reject) => {
                try {
                    const fileReader = new FileReader();
                    fileReader.readAsDataURL(imageFile);
                    fileReader.onload = (e) => 
                        resolve({imgSrc: e.target.result, fileName: imageFile.name});
                } catch(err) {
                  reject(err);
                }
            });
          })
        );
        setPreviews(imagePreviews);
    };
 
    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for(let file of files) {
            formData.append("image", file);
        }
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
            if(isPublic) {setImages((prevData) => [...res.data, ...prevData]);}
            setMyImages((prevData) => [...res.data, ...prevData]);
            //console.log({res});
            toast.success("이미지 업로드 성공!");
            // 이미지 업로드 성공 후 초기화
            setTimeout(() => {
                setPercent(0);                  //퍼센트 초기화
                setPreviews([]);                //이미지 초기화
            }, 3000);
        } catch(err) {
            //alert("fail!!");
            toast.error(err.response.data.message);
            setPercent(0);
            
            setPreviews([]);
            console.error(err);
        }
    };

    const previewImages = previews.map((preview, index) => (
    <img
        key={index}
        style={{width: 200, height: 200, objectFit: "cover"}}
        src={preview.imgSrc} 
        alt="" 
        className={`image-preview ${preview.imgSrc && "image-preview-show"}`}
    />
    ));

    const fileName = previews.length === 0 ? "이미지 파일을 업로드 해주세요." : previews.reduce((previous, current)=>previous+`${current.fileName},`,"");

    return (
        <form onSubmit={onSubmit}>
            <div style={{display: "flex", flexWrap: "wrap" }}>{previewImages}</div>
            <ProgressBar percent={percent}/>
            <div className="file-dropper">
                {fileName}
                <input 
                id="image" 
                type="file" 
                multiple //여러 파일 업로드
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