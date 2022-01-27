const {Router} = require("express");
const imageRouter = Router();
const Image = require("../models/image");
const {upload} = require("../middleware/imageUpload");

// image 경로로 post 호출이 왔을 때 
imageRouter.post("/", upload.single("image"), async (req, res) => {
    //console.log(req.file);
    const image = await new Image({ 
        key: req.file.filename, 
        originalFileName: req.file.originalname, 
    }).save();
    res.json(image); // return 값
});      //이미지 업로드
imageRouter.get("/", async(req,res) => {
    const images = await Image.find(); // 배열로 이미지 불러오기 
    res.json(images);
});

module.exports = {imageRouter};