const uploadToS3 = require("../handleuploads");
const PicuploadController = async (req) => {
  if (!req.file) {
    return { ok: false, msg: "File not found" };
  }
  console.log(req.file);
  console.log(req.body.fileid);
  const key = `ChatNow/${req.body.fileid}/${req.file.originalname}`;
  try {
    const respone = await uploadToS3(req.file.buffer, req.file.mimetype, key);
    const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${
      process.env.AWS_REGION
    }.amazonaws.com/${encodeURIComponent(key)}`;
    return { ok: true, msg: "file uploaded successfully", url };
  } catch (err) {
    console.log(err);
  }
};

module.exports = PicuploadController;
