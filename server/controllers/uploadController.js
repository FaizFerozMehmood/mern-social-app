// controllers/uploadController.js
// import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import cloudinary from "../config/cloudinary.js";

export const uploadFileController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }

    console.log("File path:", req.file.path);

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "updates_photos",
    });

    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Failed to delete local file:", err);
    });

    res.status(200).json({ message: "File uploaded!", data: result.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "File Upload failed..!", error: error.message });
  }
};
