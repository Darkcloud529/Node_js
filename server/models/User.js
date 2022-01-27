const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        username: {type: String, required: true, unique: true}, //unique: true , 고유하도록 함 , unique 설정 , 중복x
        hashedPassword: {type: String, required: true},
        sessions:[
            {
                createdAt: {type: Date, required: true},
            },
        ],
    },
    {timestamps: true}
);

module.exports = mongoose.model("user", UserSchema);