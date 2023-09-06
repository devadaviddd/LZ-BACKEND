import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, "./public/product");
  },
  filename: async (req, file, cb) => {
    const id = req.params.id;
    const newFileName = id + ".png";
    const avatarPreFix = `public/product/${newFileName}`;

    try {
      // Check if the file exists
      await fs.promises.access(avatarPreFix, fs.constants.F_OK);

      // File exists, so delete it
      await fs.promises.unlink(avatarPreFix);
      console.log("File deleted");
    } catch (err) {
      if (err.code === "ENOENT") {
        console.log("File does not exist");
      } else {
        console.error("Error while checking/deleting file:", err);
      }
    }

    cb(null, newFileName);
  },
});

const upload = multer({ storage }).single("file");

export const uploadProductImage = async (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      throw new Error("A Multer error occurred when uploading");
    } else if (err) {
      throw new Error("An unknown error occurred when uploading");
    }
    next();
  });
};
