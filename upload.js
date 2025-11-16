import multer from "multer";

const storage = multer.memoryStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.fileid + file.originalname);
  },
});

const upload = multer({ storage });

export default upload;
