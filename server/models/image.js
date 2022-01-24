const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
    {
        key: {type: String, requried: true},
        originalFileName: {type:String, required: true},
    },
    {timestamps: true}
 );

 module.exports = mongoose.model("image", ImageSchema);