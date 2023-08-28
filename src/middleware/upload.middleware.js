import multer from "multer";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     return cb(null, "./public/Images/Admin");
//   },
//   filename: (req, file, cb) => {
//     return cb(null, `${Date.now()}_${file.originalname}`);
//   },
// });

// export const uploadAdmin = multer({ storage });

export const uploadUser = multer({ 
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      return cb(null, "./public/User");
    },
    filename: (req, file, cb) => {
      return cb(null, `${Date.now()}_${file.originalname}`);
    },
  })
});

export const uploadProduct = multer({ 
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      return cb(null, "./public/Product");
    },
    filename: (req, file, cb) => {
      return cb(null, `${Date.now()}_${file.originalname}`);
    },
  })
});
