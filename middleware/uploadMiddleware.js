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


// assignment file upload
const assignmentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Store assignments and submissions in separate folders
    const isTeacher = req.user && req.user.role === 'teacher';
    const folder = isTeacher ? './uploads/assignments' : './uploads/submissions';
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// File filter for assignments and submissions
const assignmentFileFilter = (req, file, cb) => {
  // Allow typical document formats, images, and zip files
  const fileTypes = /pdf|doc|docx|ppt|pptx|xls|xlsx|txt|zip|jpeg|jpg|png|gif|mp4|avi|mov/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Unsupported file type for assignments or submissions');
  }
};

// Multer upload configuration for assignments and submissions
const uploadAssignment = multer({
  storage: assignmentStorage,
  limits: { fileSize: 1024 * 1024 * 100 }, // 100MB limit for assignments and submissions
  fileFilter: assignmentFileFilter,
});


export { upload, uploadProfileImage, uploadAssignment };

export default upload;
