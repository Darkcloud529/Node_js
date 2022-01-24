require("dotenv").config();
const express = require('express'); //express 생성
const multer = require('multer');   // multer 생성
const {v4: uuid} = require("uuid"); // uuid 생성
const mime = require("mime-types"); // mime-types 생성 : .jpeg와 같은 확장자 붙여주기
const mongoose = require("mongoose");
const Image = require("./models/Image");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./uploads"),
    filename: (req, file, cb) => 
    cb(null, `${uuid()}.${mime.extension(file.mimetype)}`),
});
const upload = multer({
    storage, 
    // 사진이 아닌 경우 제한
    fileFilter: (req,file,cb) => {
    if (["image/png", "image/jpeg"].includes(file.mimetype)) cb(null, true);
    else cb(new Error("invalid file type."), false);
    },
    // 용량 제한 
    limits: {
        fileSize: 1024 * 1024 * 5, // 5 MB
    },
});


const app = express();
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
        app.post("/images", upload.single("image"), async (req, res) => {
            //console.log(req.file);
            const image = await new Image({ 
                key: req.file.filename, 
                originalFileName: req.file.originalname 
            }).save();
            res.json(image);
        });      //이미지 업로드
        app.get("/images", async(req,res) => {
            const images = await Image.find();
            res.json(images);
        })
        app.listen(PORT, () => console.log("Express server listening on PORT " + PORT));
    })       // 접속 성공하면
    .catch((err) => console.log(err));              // 접속 실패하면


