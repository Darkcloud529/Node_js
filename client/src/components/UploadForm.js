import React, { useContext, useState, useRef } from 'react';
import axios from "axios";                  //
import { toast } from "react-toastify";     //error massage 출력
import "./UploadForm.css";
import ProgressBar from './ProgressBar';
import {ImageContext} from "../context/ImageContext";

const UploadForm = () => {
    const { setImages, setMyImages } = useContext(ImageContext);
    const [files, setFiles] = useState(null);
    const [previews, setPreviews] = useState([]);
    const [percent, setPercent] = useState([]);
    const [isPublic, setIsPublic] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef();

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

    // const onSubmitV2 = async(e) => {
    //     e.preventDefault();
    //     try{
    //         setIsLoading(true);
    //         const presignedData = await axios.post("/images/presigned", {
    //             contentType: [...files].map((file) => file.type)
    //         });

    //         await Promise.all(
    //             [...files].map((file, index) => {
    //                 const {presigned} = presignedData.data[index];
    //                 const formData = new FormData();
    //                 for (const key in presigned.fields) {
    //                     formData.append(key, presigned.fields[key]);
    //                 }
    //                 formData.append("Content-Type", file.type);
    //                 formData.append("file",file);
    //                 return axios.post(presigned.url, formData, {
    //                     onUploadProgress: (e) => {
    //                         setPercent((prevData) => {
    //                             const newData = [...prevData];
    //                             newData[index] = Math.round((100 * e.loaded) / e.total);
    //                             return newData;
    //                         });
    //                     }
    //                 });
    //             })
    //         );

    //         const res = await axios.post("/images", {
    //             images: [...files].map((file, index) => ({
    //                 imageKey: presignedData.data[index].imageKey,
    //                 originalname: file.name,
    //             })),
    //             public: isPublic,
    //         });

    //         if(isPublic) setImages((prevData) => [...res.data, ...prevData]);
    //         setMyImages((prevData) => [...res.data, ...prevData]);

    //         toast.success("이미지 업로드 성공!");
    //         // 이미지 업로드 성공 후 초기화
    //         setTimeout(() => {
    //             setPercent([]);                  //퍼센트 초기화
    //             setPreviews([]);     
    //             setIsLoading(false);          //이미지 초기화
    //             inputRef.current.value = null;
    //         }, 3000);
    //     } catch(err) {
    //         toast.error(err.response.data.message);
    //         setPercent([]);
    //         setPreviews([]);
    //         setIsLoading(false);
    //         inputRef.current.value = null;
    //         console.error(err);
    //     }
    // };

 
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
                setPercent([]);                  //퍼센트 초기화
                setPreviews([]);     
                setIsLoading(false);          //이미지 초기화
                inputRef.current.value = null;
            }, 3000);
        } catch(err) {
            //alert("fail!!");
            toast.error(err.response.data.message);
            setPercent([]);
            setPreviews([]);
            setIsLoading(false);
            inputRef.current.value = null;
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
                ref={(ref)=>(inputRef.current = ref)}
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