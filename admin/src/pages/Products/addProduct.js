import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import StyledBreadcrumb from '@mui/material/Breadcrumbs';

import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { FaRegImages, FaCloudUploadAlt } from 'react-icons/fa';
import { IoCloseSharp } from 'react-icons/io5';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Rating from '@mui/material/Rating';
import CountryDropdown from '../../components/CountryDropdown';
import { MyContext } from '../../App';
import { postData, uploadImage } from '../../utils/api';

const ProductUpload = () => {
    const navigate = useNavigate();
    const context = useContext(MyContext);

    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formFields, setFormFields] = useState({
        name: '',
        description: '',
        price: '',
        oldPrice: '',
        isFeatured: '',
        countInStock: '',
        brand: '',
        discount: '',
        rating: null,
        location: '',
        images: [],
        productRams: [],
        productWeight: [],
        productSize: [],
    });

    const [categoryVal, setCategoryVal] = useState('');
    const [subCatVal, setSubCatVal] = useState('');
    const [isFeaturedValue, setIsFeaturedValue] = useState('');
    const [ratingsValue, setRatingsValue] = useState(0);
    const [previews, setPreviews] = useState([]);

    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: 300,
                width: 250,
            },
        },
    };

    const inputChange = (e) => {
        setFormFields({ ...formFields, [e.target.name]: e.target.value });
    };

    const handleChangeCategory = (e) => {
        setCategoryVal(e.target.value);
    };

    const handleChangeSubCategory = (e) => {
        setSubCatVal(e.target.value);
    };

    const handleChangeisFeaturedValue = (e) => {
        setIsFeaturedValue(e.target.value);
    };

    const handleChangeProductRams = (e) => {
        const selectedRams = Array.from(e.target.selectedOptions, (option) => option.value);
        setFormFields({ ...formFields, productRams: selectedRams });
    };

    const handleChangeProductWeight = (e) => {
        const selectedWeights = Array.from(e.target.selectedOptions, (option) => option.value);
        setFormFields({ ...formFields, productWeight: selectedWeights });
    };

    const handleChangeProductSize = (e) => {
        const selectedSizes = Array.from(e.target.selectedOptions, (option) => option.value);
        setFormFields({ ...formFields, productSize: selectedSizes });
    };

    const handleLocationChange = (selectedLocation) => {
        setFormFields({ ...formFields, location: selectedLocation });
    };

    const removeImg = (index) => {
        const updatedPreviews = previews.filter((_, i) => i !== index);
        setPreviews(updatedPreviews);
    };

    const onChangeFile = async (e) => {
        try {
            const files = e.target.files;
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append('images', files[i]);
            }
            setUploading(true);
            const response = await uploadImage('/api/products/upload', formData);
            console.log('Upload response:', response);
            setPreviews([...previews, ...files]); // Assuming previews should display uploaded files
            setUploading(false);
        } catch (error) {
            console.error('Error uploading files:', error);
            setUploading(false);
        }
    };

    const addProduct = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        console.log('Form Fields:', formFields); // Logging form data for debugging
        try {
            const response = await postData('/api/products/upload', formFields);
            console.log('Post response:', response);
            navigate('/dashboard'); // Redirect after successful post
        } catch (error) {
            console.error('Error adding product:', error);
        }
        setIsLoading(false);
    };

    return (
        <>
            <div className='right-content w-100'>
                <div className='card shadow border-0 w-100 flex-row p-4 mt-2'>
                    <h5 className='mb-0'>Product Upload</h5>
                    <Breadcrumbs aria-label='breadcrumb' className='ml-auto breadcrumbs_'>
                        <StyledBreadcrumb component='a' href='#' label='Dashboard' icon={<HomeIcon fontSize='small' />} />
                        <StyledBreadcrumb component='a' label='Product' href='#' deleteicon={<ExpandMoreIcon />} />
                        <StyledBreadcrumb label='Upload Product' deleteicon={<ExpandMoreIcon />} />
                    </Breadcrumbs>
                </div>

                <form className='form' onSubmit={addProduct}>
                    <div className='row'>
                        <div className='col-md-12'>
                            <div className='card p-4 mt-0'>
                                <h5 className='mb-4'>Basic Information</h5>

                                <div className='form-group'>
                                    <h6>PRODUCT NAME</h6>
                                    <input type='text' name='name' value={formFields.name} onChange={inputChange} />
                                </div>

                                <div className='form-group'>
                                    <h6>DESCRIPTION</h6>
                                    <textarea
                                        rows={5}
                                        cols={10}
                                        value={formFields.description}
                                        name='description'
                                        onChange={inputChange}
                                    />
                                </div>

                                <div className='row'>
                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>CATEGORY</h6>
                                            <Select
                                                value={categoryVal}
                                                onChange={handleChangeCategory}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                className='w-100'
                                            >
                                                <MenuItem value=''>
                                                    <em>None</em>
                                                </MenuItem>
                                                {context.catData?.categoryList?.map((cat, index) => (
                                                    <MenuItem key={index} value={cat.id}>
                                                        {cat.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </div>
                                    </div>

                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>SUB CATEGORY</h6>
                                            <Select
                                                value={subCatVal}
                                                onChange={handleChangeSubCategory}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                className='w-100'
                                            >
                                                <MenuItem value=''>
                                                    <em>None</em>
                                                </MenuItem>
                                                {context.subCatData?.subCategoryList?.map((subCat, index) => (
                                                    <MenuItem key={index} value={subCat.id}>
                                                        {subCat.subCat}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </div>
                                    </div>

                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>PRICE</h6>
                                            <input type='text' name='price' value={formFields.price} onChange={inputChange} />
                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>OLD PRICE</h6>
                                            <input type='text' name='oldPrice' value={formFields.oldPrice} onChange={inputChange} />
                                        </div>
                                    </div>

                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>is Featured</h6>
                                            <Select
                                                value={isFeaturedValue}
                                                onChange={handleChangeisFeaturedValue}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                className='w-100'
                                            >
                                                <MenuItem value=''>
                                                    <em>None</em>
                                                </MenuItem>
                                                <MenuItem value={true}>True</MenuItem>
                                                <MenuItem value={false}>False</MenuItem>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>PRODUCT STOCK</h6>
                                            <input
                                                type='text'
                                                name='countInStock'
                                                value={formFields.countInStock}
                                                onChange={inputChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <h6>BRAND</h6>
                                            <input type='text' name='brand' value={formFields.brand} onChange={inputChange} />
                                        </div>
                                    </div>

                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <h6>DISCOUNT</h6>
                                            <input type='text' name='discount' value={formFields.discount} onChange={inputChange} />
                                        </div>
                                    </div>

                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <h6>RATING</h6>
                                            <Rating
                                                name='ratingsValue'
                                                value={ratingsValue}
                                                onChange={(event, newValue) => {
                                                    setRatingsValue(newValue);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <h6>RAM OPTIONS</h6>
                                            <Select
                                                multiple
                                                value={formFields.productRams}
                                                onChange={handleChangeProductRams}
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                MenuProps={MenuProps}
                                                className='w-100'
                                            >
                                                {context.ramOptions?.map((ram, index) => (
                                                    <MenuItem key={index} value={ram}>
                                                        {ram}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </div>
                                    </div>

                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <h6>PRODUCT WEIGHT</h6>
                                            <Select
                                                multiple
                                                value={formFields.productWeight}
                                                onChange={handleChangeProductWeight}
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                MenuProps={MenuProps}
                                                className='w-100'
                                            >
                                                {context.weightOptions?.map((weight, index) => (
                                                    <MenuItem key={index} value={weight}>
                                                        {weight}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </div>
                                    </div>

                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <h6>PRODUCT SIZE</h6>
                                            <Select
                                                multiple
                                                value={formFields.productSize}
                                                onChange={handleChangeProductSize}
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                MenuProps={MenuProps}
                                                className='w-100'
                                            >
                                                {context.sizeOptions?.map((size, index) => (
                                                    <MenuItem key={index} value={size}>
                                                        {size}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-md-6'>
                                        <div className='form-group'>
                                            <h6>Country</h6>
                                            <CountryDropdown onSelect={handleLocationChange} />
                                        </div>
                                    </div>

                                    <div className='col-md-6'>
                                        <div className='form-group'>
                                            <h6>IMAGES</h6>
                                            <label htmlFor='images' className='btn btn-light border'>
                                                <FaCloudUploadAlt /> Upload Images
                                            </label>
                                            <input
                                                type='file'
                                                id='images'
                                                accept='image/*'
                                                onChange={onChangeFile}
                                                style={{ display: 'none' }}
                                            />
                                            {uploading && <CircularProgress size={20} thickness={4} />}
                                            <div className='preview-images'>
                                                {previews.map((file, index) => (
                                                    <div key={index} className='preview'>
                                                        <LazyLoadImage
                                                            alt={`preview-${index}`}
                                                            effect='blur'
                                                            src={URL.createObjectURL(file)}
                                                            width='100'
                                                        />
                                                        <IoCloseSharp className='remove-img' onClick={() => removeImg(index)} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='form-group mt-4'>
                                    <Button type='submit' variant='contained' color='primary'>
                                        {isLoading ? <CircularProgress size={20} thickness={4} /> : 'Upload Product'}
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

export default ProductUpload;
