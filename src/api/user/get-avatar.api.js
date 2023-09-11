import fs from "fs";

export const getAvatarAPi = async (req, res) => {
  const id = req.params.id;

  const authUser = req.authUser;
  if (!authUser) {
    return res.status(401).json({
      message: "You are unauthorized to get avatar",
    });
  }

  const newFileName = id.toString() + ".png";
  const avatarPreFix = `public/user/${newFileName}`;

  fs.readFile(avatarPreFix, (err, data) => {
    if (err) {
      
      if (err.code === "ENOENT") {
        return res.status(400).json({
          message: "File does not exist",
        });
      }
    } else {
      return res.status(200).sendFile(avatarPreFix, { root: "." });
    }
  });
};
