const {Router} = require("express");
const imageRouter = Router();
const Image = require("../models/image");
const {upload} = require("../middleware/imageUpload");
const fs = require("fs"); 
const {promisify} = require("util");
const mongoose = require("mongoose");
const { runInNewContext } = require("vm");

const fileUnlink = promisify(fs.unlink);

// image 경로로 post 호출이 왔을 때 
// 최대 5장의 이미지까지만 업로드
imageRouter.post("/", upload.array("image", 5), async (req, res) => {
    //console.log(req.file);
    // 유저 정보 , public 유무 확인
    try {
        if(!req.user) throw new Error("권한이 없습니다.");
        const images = await Promise.all(
            req.files.map(async (file) => {
            const image = await new Image({ 
                user: {
                    _id: req.user.id,
                    name: req.user.name,
                    username: req.user.username,
                },
                public: req.body.public, // string 타입!
                key: file.filename, 
                originalFileName: file.originalname, 
            }).save();
            return image;
            })
        );
        res.json(images); // return 값
    } catch(err) {
        console.log(err);
        res.status(400).json({message:err.message});
    }
});      //이미지 업로드
imageRouter.get("/", async(req,res) => {
    // public한 이미지들만 제공
    const images = await Image.find({public:true}); // 배열로 이미지 불러오기 
    res.json(images);
});

imageRouter.delete("/:imageId", async(req,res) => {
    // 유저 권한 확인
    // 사진 삭제 
    // 1. uploads 폴더에 있는 사진 데이터를 삭제
    // 2. 데이터베이스에 있는 image 문서를 삭제
    try {
        console.log(req.params);
        if(!req.user) throw new Error("권한이 없습니다.");
        if(!mongoose.isValidObjectId(req.params.imageId)) throw new Error ("올바른 않은 이미지 id입니다.");
        
        const image = await Image.findOneAndDelete({_id:req.params.imageId});
        if(!image) 
            return res.json({message: "요청하신 사진은 이미 삭제되었습니다."});
        await fileUnlink(`./uploads/${image.key}`);
        res.json({message: "요청하신 이미지가 삭제되었습니다.", image});
    } catch(err) {
        console.log(err);
        res.status(400).json({message:err.message});
    };
});

imageRouter.patch("/:imageId/like", async(req,res) => {
    // 유저 권한 확인
    // like 중복 안되도록 확인
    try {
        if(!req.user) throw new Error("권한이 없습니다.");
        if(!mongoose.isValidObjectId(req.params.imageId)) throw new Error("올바르지 않은 imageId입니다.");
        const image = await Image.findByIdAndUpdate({_id: req.params.imageId}, {$addToSet: {likes:req.user.id}}, {new:true});
        res.json(image);
    } catch(err) {
        console.log(err);
        res.status(400).json({message:err.message});
    }
});

imageRouter.patch("/:imageId/unlike", async(req,res) => {
    // 유저 권한 확인
    // like 중복 취소 안되도록 확인
    try {
        if(!req.user) throw new Error("권한이 없습니다.");
        if(!mongoose.isValidObjectId(req.params.imageId)) throw new Error("올바르지 않은 imageId입니다.");
        const image = await Image.findByIdAndUpdate({_id: req.params.imageId}, {$pull:{likes:req.user.id}}, {new:true});
        res.json(image);
    } catch(err) {
        console.log(err);
        res.status(400).json({message:err.message});
    }
});

module.exports = {imageRouter};