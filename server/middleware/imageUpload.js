const multer = require('multer');   // multer, 이미지 업로드용 모듈 생성
const {v4: uuid} = require("uuid"); // uuid 생성 모듈, v4 사용
const mime = require("mime-types"); // mime-types 생성 : .jpeg와 같은 확장자 붙여주는 모듈
const multerS3 = require("multer-s3");
const { s3 } = require("../aws");


// 파일 저장 과정 제어
// const storage = multer.diskStorage({
//     //destination : 저장할 위치
//     destination: (req, file, cb) => cb(null, "./uploads"),
//     //filename : 어떤 이름으로 저장할지
//     filename: (req, file, cb) => 
//         cb(null, `${uuid()}.${mime.extension(file.mimetype)}`),
// });

//AWS S3 연결
const storage = multerS3({
    s3,
    bucket: "image-upload-tutorial-smlee",
    key: (req, file, cb) => 
        cb(null, `raw/${uuid()}.${mime.extension(file.mimetype)}`),
});

// multer 이용한 upload 함수
const upload = multer({
    storage, 
    // 사진이 아닌 경우 제한
    fileFilter: (req,file,cb) => {
        // file type이 png, jpeg라면
        console.log("file type : " , file);
        if (["image/png", "image/jpeg"].includes(file.mimetype)) cb(null, true);
        else cb(new Error("invalid file type."), false);
    },
    // 용량 제한 
    limits: {
        fileSize: 1024 * 1024 * 5, // 5 MB
    },
});

module.exports = {upload};