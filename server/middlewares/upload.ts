import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, done) => done(null, './server/uploads'),
  filename: (req, file, done) =>
    done(null, file.fieldname + req.user + Date.now() + file.originalname),
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5000000,
  },
});

export default upload;
