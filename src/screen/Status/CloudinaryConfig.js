import { v2 as cloudinary } from "cloudinary";
// import { Cloudinary } from "cloudinary-react";

cloudinary.config({
  cloud_name: "YOUR_CLOUD_NAME",
  api_key: "YOUR_API_KEY",
  api_secret: "YOUR_API_SECRET",
});

export const cloudinaryConfig = cloudinary.config;
export const cloudinaryUploader = async (image) => {
  try {
    const result = await cloudinary.uploader.upload(image, {
      folder: "stories", // Replace with your desired folder on Cloudinary.
    });
    return result.secure_url;
  } catch (error) {
    throw new Error("Failed to upload image to Cloudinary: " + error.message);
  }
};

// export const Cloud = Cloudinary.config({
//   cloud_name: "your_cloud_name",
//   api_key: "your_api_key",
//   api_secret: "your_api_secret",
// });
