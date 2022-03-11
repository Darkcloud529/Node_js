const sharp = require("sharp");
const aws = require("aws-sdk");
const s3 = new aws.S3();

// 이미지 크기 변경 
const transformationOptions = [
    {name:"w140", width: 140},
    {name:"w600", width: 600},
];

exports.handler = async (event) => {
    //console.dir(event.Records[0].s3)
    try {
        const Key = event.Records[0].s3.object.key;
        const keyOnly = Key.split("/")[1];
        console.log(`Image Resizing: ${keyOnly}`);
        const image = await s3.getObject({Bucket: "image-upload-tutorial-smlee", Key}).promise();

        await Promise.all(transformationOptions.map(async ({name,width})=>{
            try {
                const newKey = `${name}/${keyOnly}`;
                const resizedImage = await sharp(image.Body).rotate().resize({width, height:width, fit:"outside"}).toBuffer();
                await s3.putObject({Bucket:"image-upload-tutorial-smlee", Body:resizedImage, Key:newKey}).promise();
            } catch(err) {
                throw err
            }
        }))
        return {
            statusCode: 200,
            body: event,
        };
    } catch(err) {
        console.log(err);
        return {
            statusCode: 500,
            body: event,
        };
    }
};