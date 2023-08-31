import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, "./public/user");
  },
  filename: (req, file, cb) => {
    const authUser = req.authUser;
    const { _id } = authUser;
    const newFileName = _id.toString() + ".png";
    const avatarPreFix = `public/user/${newFileName}`;

    fs.readFile(avatarPreFix, (err, data) => {
      if (err) {
        if (err.code === "ENOENT") {
          console.log("File does not exist");
        } else {
          throw err;
        }
      } else {
        console.log("File exists");
        fs.unlink(avatarPreFix, (err) => {
          if (err) throw err;
          console.log("File deleted");
        });
      }

      cb(null, newFileName);
    });
  },
});

const upload = multer({ storage }).single("file");

export const uploadAvatarImage = async (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      throw new Error("A Multer error occurred when uploading");
    } else if (err) {
      throw new Error("An unknown error occurred when uploading");
    }
    next();
  });
};
