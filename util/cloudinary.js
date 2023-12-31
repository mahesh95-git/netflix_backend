const v2 = require("cloudinary").v2;
const fs = require("fs").promises;

const uploadContentCloudinary = async (loclPath) => {
  try {
    v2.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET_KEY,
    });

    const responses = [];
    for (const key in loclPath) {
      for (let i = 0; i < loclPath[key].length; i++) {
        const response = await v2.uploader.upload(loclPath[key][i].path, {
          resource_type: "auto",
          folder: "netflixContent",
        });
        responses.push({ fieldname: loclPath[key][i].fieldname, ...response });
        await fs.unlink(loclPath[key][i].path);
      } // Delete the file even if the suceessfully upload
    }
    return responses;
  } catch (error) {
    console.log(error)
    for (const key in loclPath) {
      for (let i = 0; i < loclPath[key].length; i++) {
        await fs.unlink(loclPath[key][i].path);
      }
    } // Delete the file even if the upload fails
    return null;
  }
};

const deleteContent = async (publicIds) => {
  try {
    if (!Array.isArray(publicIds)) {
      return await v2.uploader.destroy(publicIds);
    }
    for (const value of publicIds) {
      const result = await v2.uploader.destroy(value);
    }
  } catch (error) {
    throw error;
  }
};

module.exports = { uploadContentCloudinary, deleteContent };
