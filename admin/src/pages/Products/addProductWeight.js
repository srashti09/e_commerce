import React, { useContext, useEffect, useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { FaCloudUploadAlt, FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MyContext } from '../../App';
import { deleteData, editData, fetchDataFromApi, postData } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const StyledBreadcrumb = styled(Chip)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[800],
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
        backgroundColor: emphasize(theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[800], 0.06),
    },
    '&:active': {
        boxShadow: theme.shadows[1],
        backgroundColor: emphasize(theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[800], 0.12),
    },
}));

const AddProductWeight = () => {
    const [editId, setEditId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [productWeightData, setProductWeightData] = useState([]);
    const [formFields, setFormFields] = useState({
        productWeight: '',
    });

    const context = useContext(MyContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetchDataFromApi("/api/productWeight");
            console.log('Fetched product weight data:', res);
            setProductWeightData(Array.isArray(res) ? res : []);
        } catch (error) {
            console.error('Error fetching product weight data:', error);
            setProductWeightData([]);
        }
    };

    const inputChange = (e) => {
        setFormFields({
            ...formFields,
            [e.target.name]: e.target.value
        });
        console.log(`Updated form field - ${e.target.name}: ${e.target.value}`);
    };

    const addProductWeight = async (e) => {
        e.preventDefault();
        const { productWeight } = formFields;

        console.log('Form fields before submit:', formFields);

        if (!productWeight) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Please add Product Weight'
            });
            return;
        }

        setIsLoading(true);

        try {
            const endpoint = editId ? `/api/productWeight/${editId}` : '/api/productWeight/create';
            const apiFunction = editId ? editData : postData;

            const response = await apiFunction(endpoint, formFields);
            console.log('API response:', response);

            fetchData();
            setEditId('');
            setIsLoading(false);
            setFormFields({ productWeight: '' });

            console.log('Form fields after successful submit:', formFields);
        } catch (error) {
            console.error('Error adding/editing product weight:', error);
            setIsLoading(false);
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Failed to add/edit product weight. Please try again.'
            });
        }
    };

    const deleteItem = async (id) => {
        try {
            await deleteData(`/api/productWeight/${id}`);
            console.log(`Deleted product weight with id: ${id}`);
            fetchData();
        } catch (error) {
            console.error('Error deleting product weight:', error);
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Failed to delete product weight. Please try again.'
            });
        }
    };

    const updateData = async (id) => {
        try {
            const res = await fetchDataFromApi(`/api/productWeight/${id}`);
            console.log('Fetched single product weight data for update:', res);
            setEditId(id);
            setFormFields({
                productWeight: res.productWeight
            });
        } catch (error) {
            console.error('Error updating product weight:', error);
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Failed to update product weight. Please try again.'
            });
        }
    };

    return (
        <div className="right-content w-100">
            <div className="card shadow border-0 w-100 flex-row p-4 mt-2">
                <h5 className="mb-0">Add Product WEIGHT</h5>
                <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                    <StyledBreadcrumb
                        component="a"
                        href="#"
                        label="Dashboard"
                        icon={<HomeIcon fontSize="small" />}
                    />
                    <StyledBreadcrumb
                        component="a"
                        label="Product WEIGHT"
                        href="#"
                        deleteicon={<ExpandMoreIcon />}
                    />
                    <StyledBreadcrumb
                        label="Add Product WEIGHT"
                        deleteicon={<ExpandMoreIcon />}
                    />
                </Breadcrumbs>
            </div>

            <form className='form' key={editId} onSubmit={addProductWeight}>
                <div className='row'>
                    <div className='col-sm-9'>
                        <div className='card p-4 mt-0'>
                            <div className='row'>
                                <div className='col'>
                                    <div className='form-group'>
                                        <h6>PRODUCT WEIGHT</h6>
                                        <input type='text' name="productWeight" value={formFields.productWeight} onChange={inputChange} />
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" className="btn-blue btn-lg btn-big w-100">
                                <FaCloudUploadAlt /> &nbsp; {isLoading ? <CircularProgress color="inherit" className="loader" /> : 'PUBLISH AND VIEW'}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
            
            { productWeightData.length !== 0 && 
                <div className='row'>
                    <div className='col-md-9'>
                        <div className='card p-4 mt-0'>
                            <div className="table-responsive mt-3">
                                <table className="table table-bordered table-striped v-align">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>PRODUCT WEIGHT </th>
                                            <th width="25%">ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    
                                        {productWeightData.map((item) => (
                                            <tr key={item._id}>
                                               
                                                <td>
                                                <input type ="text" value ={editId===item._id ? formFields.productWeight:item.productWeight }
                                                readOnly={editId!==item._id}/>
                                                </td>
                                                <td>
                                                    <div className="actions d-flex align-items-center">
                                                        <Button className="success" color="success" onClick={() => updateData(item._id)}><FaPencilAlt /></Button>
                                                        <Button className="error" color="error" onClick={() => deleteItem(item._id)}><MdDelete /></Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default AddProductWeight;
