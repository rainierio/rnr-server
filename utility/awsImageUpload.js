const AWS = require("aws-sdk");

// AWS S3 config
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// S3 upload promise with parameter
const s3UploadPromise = (image, subfolder) => {
  return new Promise(function (resolve, reject) {
    // Create S3 instance
    const s3 = new AWS.S3();

    // Parameters setting
    const buffer = Buffer.from(image.data, "binary");
    const type = image.mimetype;
    const name = image.name;
    const timestamp = Date.now().toString();
    const fileName = `${subfolder}/${timestamp}-${name}`;

    const params = {
      ACL: "public-read",
      Body: buffer,
      Bucket: process.env.AWS_S3_BUCKET,
      ContentType: type,
      Key: fileName,
    };

    s3.upload(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};
module.exports = s3UploadPromise;
