export const uploadAvatarAPI = async (req, res) => {
  const authUser = req.authUser;
  const file = req.file;
  if (!authUser) {
    console.log("You are unauthorized to upload image");
    return res.status(401).json({
      message: "You are unauthorized to upload image",
    });
  }

  if (file) {
    console.log("file", file);
    return res.status(200).json({
      message: "Upload image successfully",
      avatar: file.path,
    });
  } else {
    return res.status(400).json({
      message: "Upload image failed",
    });
  }
};
