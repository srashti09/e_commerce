import React, { useContext, useEffect, useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import { deleteData, deleteImages, fetchDataFromApi, postData, uploadImage } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { FaRegImages, FaCloudUploadAlt } from 'react-icons/fa';
import CircularProgress from '@mui/material/CircularProgress';
import { IoCloseSharp } from "react-icons/io5";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { MyContext } from '../../App'; // Import MyContext

const StyledBreadcrumb = styled(Chip)(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[800],
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
        backgroundColor: emphasize(
            theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[800],
            0.06,
        ),
    },
    '&:active': {
        boxShadow: theme.shadows[1],
        backgroundColor: emphasize(
            theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[800],
            0.12,
        ),
    },
}));

const AddCategory = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formFields, setFormFields] = useState({
        name: '',
        images: [],
        color: ''
    });
    const [previews, setPreviews] = useState([]);
    const formdata = new FormData();
    const navigate = useNavigate();
    const context = useContext(MyContext); // Use MyContext

    useEffect(() => {
        fetchDataFromApi("/api/imageUpload")
            .then((res) => {
                console.log("Fetched image upload data:", res);
                res?.map((item) => {
                    item?.images?.map((img) => {
                        deleteImages(`/api/category/deleteImage?img=${img}`)
                            .then((res) => {
                                console.log("Deleted image:", img);
                                deleteData("/api/imageUpload/deleteAllImages")
                                    .then(() => {
                                        console.log("All images deleted.");
                                    })
                                    .catch(error => console.error('Error deleting all images:', error));
                            })
                            .catch(error => console.error('Error deleting image:', error));
                    });
                });
            })
            .catch(error => console.error('Error fetching initial data:', error));
    }, []);

    const changeInput = (e) => {
        setFormFields((prevFields) => ({
            ...prevFields,
            [e.target.name]: e.target.value
        }));
    };

    const onChangeFile = async (e, apiEndPoint) => {
        try {
            const files = e.target.files;
            console.log("Selected files:", files);
            setUploading(true);

            for (var i = 0; i < files.length; i++) {
                if (files && (files[i].type === 'image/jpeg' || files[i].type === 'image/png' || files[i].type === 'image/webp')) {
                    console.log("Uploading file:", files[i].name);
                    const file = files[i];
                    formdata.append('images', file);
                } else {
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: 'Please select a valid JPG or PNG image file.'
                    });
                    setUploading(false);
                    return;
                }
            }

            formFields.images = Array.from(files);
            const res = await uploadImage(apiEndPoint, formdata);
            console.log("Upload response:", res);
            const response = await fetchDataFromApi("/api/imageUpload");
            console.log("Fetched image upload after upload:", response);

            if (response && response.length > 0) {
                response.forEach((item) => {
                    item.images.forEach((img) => {
                        setPreviews((prevPreviews) => [...prevPreviews, img]);
                    });
                });

                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: "Images Uploaded!"
                });
            }

            setUploading(false);
        } catch (error) {
            console.error('Error uploading files:', error);
            setUploading(false);
        }
    };

    const removeImg = async (index, imgUrl) => {
        try {
            await deleteImages(`/api/category/deleteImage?img=${imgUrl}`);
            setPreviews((prevPreviews) => prevPreviews.filter((img, i) => i !== index));

            context.setAlertBox({
                open: true,
                error: false,
                msg: "Image Deleted!"
            });
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    const addCat = async (e) => {
        e.preventDefault();
        const appendedArray = [...previews, ...formFields.images];

        if (formFields.name && formFields.color && appendedArray.length > 0) {
            setIsLoading(true);

            try {
                console.log("Form data before sending:", formFields);
                const response = await postData(`/api/category/create`, {
                    ...formFields,
                    images: appendedArray
                });
                console.log("Category creation response:", response);

                setIsLoading(false);
                context.fetchCategory();
                await deleteData("/api/imageUpload/deleteAllImages");
                navigate('/category');
            } catch (error) {
                console.error('Error creating category:', error);
                setIsLoading(false);
            }
        } else {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Please fill all the details'
            });
        }
    };

    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-4 mt-2">
                    <h5 className="mb-0">Add Category</h5>
                    <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                        <StyledBreadcrumb component="a" href="#" label="Dashboard" icon={<HomeIcon fontSize="small" />} />
                        <StyledBreadcrumb component="a" label="Category" href="#" deleteicon={<ExpandMoreIcon />} />
                        <StyledBreadcrumb label="Add Category" deleteicon={<ExpandMoreIcon />} />
                    </Breadcrumbs>
                </div>

                <form className='form' onSubmit={addCat}>
                    <div className='row'>
                        <div className='col-sm-9'>
                            <div className='card p-4 mt-0'>
                                <div className='form-group'>
                                    <h6>Category Name</h6>
                                    <input type='text' name='name' value={formFields.name} onChange={changeInput} />
                                </div>
                                <div className='form-group'>
                                    <h6>Color</h6>
                                    <input type='text' name='color' value={formFields.color} onChange={changeInput} />
                                </div>
                                <div className="imagesUploadSec">
                                    <h5 className="mb-4">Media And Published</h5>
                                    <div className='imgUploadBox d-flex align-items-center'>
                                        {previews.map((img, index) => (
                                            <div className='uploadBox' key={index}>
                                                <span className="remove" onClick={() => removeImg(index, img)}><IoCloseSharp /></span>
                                                <div className='box'>
                                                    <LazyLoadImage alt="image" effect="blur" className="w-100" src={img} />
                                                </div>
                                            </div>
                                        ))}
                                        <div className='uploadBox'>
                                            {uploading ? (
                                                <div className="progressBar text-center d-flex align-items-center justify-content-center flex-column">
                                                    <CircularProgress />
                                                    <span>Uploading...</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <input type="file" multiple onChange={(e) => onChangeFile(e, '/api/category/upload')} />
                                                    <div className='info'>
                                                        <FaRegImages />
                                                        <h5>Image upload</h5>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <br />
                                    <Button type="submit" className="btn-blue btn-lg btn-big w-100">
                                        <FaCloudUploadAlt /> &nbsp; {isLoading ? <CircularProgress color="inherit" className="loader" /> : 'PUBLISH AND VIEW'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddCategory;
