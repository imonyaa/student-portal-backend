import multer from 'multer';
import path from 'path';

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const fileTypes = /pdf|mp4|avi|mov/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Only PDF and video files are allowed');
  }
};

// Multer upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 50 }, // 50MB
  fileFilter: fileFilter,
});

// File filter for image uploads
const imageFileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Only image files are allowed (jpeg, jpg, png, gif)');
  }
};

// Multer upload configuration
const uploadProfileImage = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit for profile images
  fileFilter: imageFileFilter,
});

export { upload, uploadProfileImage };

export default upload;
