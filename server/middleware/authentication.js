const mongoose = require("mongoose");
const User = require("../models/User");

const authenticate = async(req, res, next) => {
    const {sessionid} = req.headers;
    // 세션id가 없거나 존재하더라도 유효한 세션id가 아닌 경우
    if(!sessionid || !mongoose.isValidObjectId(sessionid)) return next();
    const user = await User.findOne({"sessions._id": sessionid});
    // user가 존재하지 않는 경우
    if(!user) return next();    
    req.user = user;
    return next();
};

module.exports = {authenticate};