const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_Config_api_secret,
    secure: true
});

// Function to upload images to Cloudinary
const uploadImage = async (file) => {
    try {
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(file, {
            folder: 'your-folder-name', // Optionally specify a folder in Cloudinary
            use_filename: true, // Use the original file name
            unique_filename: false // Ensure the file names are not overwritten
        });

        return { publicId: result.public_id, url: result.secure_url };
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw error; // Throw the error for handling in calling function
    }
};

module.exports = { uploadImage };
