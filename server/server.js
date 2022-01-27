require("dotenv").config();
const express = require('express'); //express, 서버 생성
const mongoose = require("mongoose");
const {imageRouter} = require("./routes/imageRouter");
const {userRouter} = require("./routes/userRouter");

const app = express();  // express 서버 설정
const {MONGO_URI, PORT} = process.env    // 포트번호

//mongoose.connect("mongodb+srv://admin:<password>@cluster0.iqyql.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
mongoose
    .connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("MongoDB Connect");
        // 사진 조회가 가능하도록 경로 설정
        app.use("/uploads", express.static("uploads"));
        app.use(express.json());     //req를 보고 json body양식 있다면 req.body의 저장해줌
        app.use("/images", imageRouter);
        app.use("/users", userRouter);
        app.listen(PORT, () => console.log("Express server listening on PORT " + PORT)); // express 서버 설정
    })       // 접속 성공하면
    .catch((err) => console.log(err));              // 접속 실패하면



