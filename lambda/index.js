const sharp = require("sharp");
const aws = require("aws-sdk");
const s3 = new aws.s3();

const transformationOptions = [
    {name:"w140", width: 140},
    {name:"w600", width: 600},
];

exports.handler = async (event) => {
    console.dir(event.Records[0].s3)
    try {
        const Key = event.Records[0].s3.object.key;
        const keyOnly = Key.split("/")[1];
        console.log(`Image Resizing: ${keyOnly}`);
        const image = await s3.getObject({Bucket: "image-upload-tutorial-smlee", Key});
        return {
            statusCode: 200,
            body: event,
        };
    } catch(err) {
        return {
            statusCode: 500,
            body: event,
        };
    }
};