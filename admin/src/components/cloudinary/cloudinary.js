import axios from 'axios';

export const uploadCloudinary = async (file, formData) => {
    try {
        formData.append("file", file);
        formData.append("upload_preset", "ddipnhuhx");

        const { data } = await axios.post("https://api.cloudinary.com/v1_1/ddipnhuhx/image/upload", formData);

        if (data && data.public_id && data.secure_url) {
            return { publicId: data.public_id, url: data.secure_url, formData };
        } else {
            throw new Error("Failed to upload image to Cloudinary");
        }
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw error; // Propagate the error back to the caller
    }
};
