require("dotenv").config();
const express = require('express'); //express, 서버 생성
const multer = require('multer');   // multer, 이미지 업로드용 모듈 생성
const {v4: uuid} = require("uuid"); // uuid 생성 모듈, v4 사용
const mime = require("mime-types"); // mime-types 생성 : .jpeg와 같은 확장자 붙여주는 모듈
const mongoose = require("mongoose");
const Image = require("./models/Image");

// 파일 저장 과정 제어
const storage = multer.diskStorage({
    //destination : 저장할 위치
    destination: (req, file, cb) => cb(null, "./uploads"),
    // filename : 어떤 이름으로 저장할지
    filename: (req, file, cb) => 
    cb(null, `${uuid()}.${mime.extension(file.mimetype)}`),
});
// multer 이용한 upload 함수
const upload = multer({
    storage, 
    // 사진이 아닌 경우 제한
    fileFilter: (req,file,cb) => {
        // file type이 png, jpeg라면
        if (["image/png", "image/jpeg"].includes(file.mimetype)) cb(null, true);
        else cb(new Error("invalid file type."), false);
    },
    // 용량 제한 
    limits: {
        fileSize: 1024 * 1024 * 5, // 5 MB
    },
});


const app = express();  // express 서버 설정
const PORT = 5000;      // 포트번호

//mongoose.connect("mongodb+srv://admin:<password>@cluster0.iqyql.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
mongoose
    .connect(
        process.env.MONGO_URI
    )
    .then(()=>{
        console.log("MongoDB Connect");
        // 사진 조회가 가능하도록 경로 설정
        app.use("/uploads", express.static("uploads"));
        // image 경로로 post 호출이 왔을 때 
        app.post("/images", upload.single("image"), async (req, res) => {
            //console.log(req.file);
            const image = await new Image({ 
                key: req.file.filename, 
                originalFileName: req.file.originalname 
            }).save();
            res.json(image); // return 값
        });      //이미지 업로드
        app.get("/images", async(req,res) => {
            const images = await Image.find(); // 배열로 이미지 불러오기 
            res.json(images);
        })
        app.listen(PORT, () => console.log("Express server listening on PORT " + PORT)); // express 서버 설정
    })       // 접속 성공하면
    .catch((err) => console.log(err));              // 접속 실패하면


