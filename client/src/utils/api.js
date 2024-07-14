import axios from "axios";

// Retrieve token from localStorage
const token = localStorage.getItem("token");

// Common headers for API requests
const headers = {
    'Authorization': `Bearer ${token}`, // Include your API key in the Authorization header
    'Content-Type': 'application/json', // Adjust the content type as needed
};

const formHeaders = {
    'Authorization': `Bearer ${token}`, // Include your API key in the Authorization header
    'Content-Type': 'multipart/form-data', // Set content type for form data
};

// Common params for GET requests
const params = {
    headers,
};

// Fetch data from API
export const fetchDataFromApi = async (url) => {
    try {
        console.log(`Fetching data from: ${process.env.REACT_APP_BASE_URL + url}`);
        const { data } = await axios.get(process.env.REACT_APP_BASE_URL + url, params);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error.response ? error.response.data : error.message);
        return error.response ? error.response.data : error.message;
    }
};

// Upload image to API
export const uploadImage = async (url, formData) => {
    try {
        console.log(`Uploading image to: ${process.env.REACT_APP_BASE_URL + url}`);
        const { data } = await axios.post(process.env.REACT_APP_BASE_URL + url, formData, { headers: formHeaders });
        return data;
    } catch (error) {
        console.error('Error uploading image:', error.response ? error.response.data : error.message);
        return error.response ? error.response.data : error.message;
    }
};

// Post data to API
export const postData = async (url, formData) => {
    try {
        console.log(`Posting data to: ${process.env.REACT_APP_BASE_URL + url}`);
        const response = await fetch(process.env.REACT_APP_BASE_URL + url, {
            method: 'POST',
            headers,
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            const errorData = await response.json();
            console.error('Error posting data:', errorData);
            return errorData;
        }
    } catch (error) {
        console.error('Error:', error.message);
        return error.message;
    }
};

// Edit data via API
export const editData = async (url, updatedData) => {
    try {
        console.log(`Editing data at: ${process.env.REACT_APP_BASE_URL + url}`);
        const { data } = await axios.put(`${process.env.REACT_APP_BASE_URL}${url}`, updatedData, params);
        return data;
    } catch (error) {
        console.error('Error editing data:', error.response ? error.response.data : error.message);
        return error.response ? error.response.data : error.message;
    }
};

// Delete data from API
export const deleteData = async (url) => {
    try {
        console.log(`Deleting data from: ${process.env.REACT_APP_BASE_URL + url}`);
        const { data } = await axios.delete(`${process.env.REACT_APP_BASE_URL}${url}`, params);
        return data;
    } catch (error) {
        console.error('Error deleting data:', error.response ? error.response.data : error.message);
        return error.response ? error.response.data : error.message;
    }
};

// Delete images from API
export const deleteImages = async (url, image) => {
    try {
        console.log(`Deleting image from: ${process.env.REACT_APP_BASE_URL + url}`);
        const { data } = await axios.delete(`${process.env.REACT_APP_BASE_URL}${url}`, { headers, data: image });
        return data;
    } catch (error) {
        console.error('Error deleting images:', error.response ? error.response.data : error.message);
        return error.response ? error.response.data : error.message;
    }
};
