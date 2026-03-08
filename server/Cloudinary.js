import cloudinary from "./cloudinary.config";

async function UploadDocument({filePath}) {
  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: "raw",
    folder: "documents",
  });

  return result.secure_url;
}

export default UploadDocument; 