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

export const uploadAdmin = multer({ 
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      return cb(null, "./public/Images/Admin");
    },
    filename: (req, file, cb) => {
      return cb(null, `${Date.now()}_${file.originalname}`);
    },
  })
});

export const uploadSeller = multer({ 
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      return cb(null, "./public/Images/Seller");
    },
    filename: (req, file, cb) => {
      return cb(null, `${Date.now()}_${file.originalname}`);
    },
  })
});

export const uploadCustomer = multer({ 
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      return cb(null, "./public/Images/Customer");
    },
    filename: (req, file, cb) => {
      return cb(null, `${Date.now()}_${file.originalname}`);
    },
  })
});

export const uploadProduct = multer({ 
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      return cb(null, "./public/Images/Product");
    },
    filename: (req, file, cb) => {
      return cb(null, `${Date.now()}_${file.originalname}`);
    },
  })
});
