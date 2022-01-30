const {Router} = require("express");
const userRouter = Router();
const User = require("../models/User");
const {hash, compare} = require("bcryptjs");
const Image = require("../models/image");
const mongoose = require("mongoose");

// 회원가입 처리
userRouter.post("/register", async(req, res) => {
    try {
        if(req.body.password.length<6) 
            throw new Error("비밀번호를 6자 이상 입력해주세요.");
        if(req.body.username.length<3)
            throw new Error("유저명은 3자 이상 입력해주세요.");    
        const hashedPassword = await hash(req.body.password, 10); // 비밀번호 암호화
        const user = await new User({
            name: req.body.name,
            username: req.body.username,
            hashedPassword,
            sessions:[{createdAt: new Date()}]
        }).save(); //DB에 저장
        const session = user.sessions[0];
        res.json({
            message:"user registered", 
            sessionId:session._id, 
            name:user.name,
            userId: user._id,
        });
    } catch(err) {
        res.status(400).json({message: err.message});
    }
});

//로그인 처리
userRouter.patch("/login", async(req,res)=>{
    try {
        const user = await User.findOne({username: req.body.username});
        const isValid = await compare(req.body.password, user.hashedPassword); // 비밀번호 비교 
        if(!isValid) throw new Error("입력하신 정보가 올바르지 않습니다.");
        user.sessions.push({createdAt: new Date()});
        const session = user.sessions[user.sessions.length-1];
        await user.save();
        res.json({message:"user validated", sessionId:session._id, name: user.name});
    } catch(err) {
        res.status(400).json({message:err.message});
    }
});

// 로그아웃 처리
userRouter.patch("/logout", async(req,res) => {
    try {
        console.log(req.user);
        if(!req.user) throw new Error("invalid sessionid");
        await User.updateOne(
            {_id: req.user.id}, 
            {$pull: { sessions: {_id: req.headers.sessionid}}}
        );
        res.json({message:"user is logged out."});
    } catch(err) {
        console.log(err);
        res.status(400).json({message:err.message});
    }
});

module.exports = {userRouter};