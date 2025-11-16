const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const env = require("dotenv");
env.config();

const s3client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});
const uploadToS3 = async (fileBuffer, contentType, key) => {
  const pkg = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
  });
  const response = await s3client.send(pkg);
  console.log(response);
};

module.exports = uploadToS3;
