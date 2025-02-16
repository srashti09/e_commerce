import React, { useContext, useEffect, useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MyContext } from '../../App';
import Button from '@mui/material/Button';
import { FaCloudUploadAlt } from "react-icons/fa";
import CircularProgress from '@mui/material/CircularProgress';
import { deleteData, editData, fetchDataFromApi, postData } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor =
        theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[800];
    return {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: emphasize(backgroundColor, 0.06),
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
        },
    };
});

const AddProductRAMS = () => {
    const [editId, setEditId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [productRamData, setProductRamData] = useState([]);
    const [formFields, setFormFields] = useState({
        productRam: '',
    });

    const navigate = useNavigate();
    const context = useContext(MyContext);

    const inputChange = (e) => {
        setFormFields({
            ...formFields,
            [e.target.name]: e.target.value
        });
    };

    useEffect(() => {
        fetchDataFromApi("/api/productRAMS")
            .then((res) => {
                console.log("Fetched product RAMs:", res);
                if (Array.isArray(res)) {
                    setProductRamData(res);
                } else {
                    setProductRamData([]);
                }
            })
            .catch((error) => {
                console.error("Error fetching product RAMs:", error);
                setProductRamData([]);
            });
    }, []);

    const addProductRam = (e) => {
        e.preventDefault();

        if (formFields.productRam === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Please add Product RAM'
            });
            return;
        }

        setIsLoading(true);

        if (editId === "") {
            postData('/api/productRAMS/create', formFields)
                .then(() => {
                    setIsLoading(false);
                    setFormFields({ productRam: "" });
                    fetchDataFromApi("/api/productRAMS").then((res) => {
                        setProductRamData(Array.isArray(res) ? res : []);
                    });
                })
                .catch((error) => {
                    console.error("Error adding product RAM:", error);
                    setIsLoading(false);
                });
        } else {
            editData(`/api/productRAMS/${editId}`, formFields)
                .then(() => {
                    fetchDataFromApi("/api/productRAMS").then((res) => {
                        setProductRamData(Array.isArray(res) ? res : []);
                        setEditId("");
                        setIsLoading(false);
                        setFormFields({ productRam: "" });
                    });
                })
                .catch((error) => {
                    console.error("Error editing product RAM:", error);
                    setIsLoading(false);
                });
        }
    };

    const deleteItem = (id) => {
        deleteData(`/api/productRAMS/${id}`)
            .then(() => {
                fetchDataFromApi("/api/productRAMS").then((res) => {
                    setProductRamData(Array.isArray(res) ? res : []);
                });
            })
            .catch((error) => {
                console.error("Error deleting product RAM:", error);
            });
    };

    const updateData = (id) => {
        const item = productRamData.find((item) => item._id === id);
        if (item) {
            setEditId(id);
            setFormFields({ productRam: item.productRam });
        }
    };

    return (
        <div className="right-content w-100">
            <div className="card shadow border-0 w-100 flex-row p-4 mt-2">
                <h5 className="mb-0">Add Product RAM</h5>
                <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                    <StyledBreadcrumb
                        component="a"
                        href="#"
                        label="Dashboard"
                        icon={<HomeIcon fontSize="small" />}
                    />
                    <StyledBreadcrumb
                        component="a"
                        label="Product RAMS"
                        href="#"
                        deleteicon={<ExpandMoreIcon />}
                    />
                    <StyledBreadcrumb
                        label="Add Product RAMS"
                        deleteicon={<ExpandMoreIcon />}
                    />
                </Breadcrumbs>
            </div>

            <form className='form' onSubmit={addProductRam}>
                <div className='row'>
                    <div className='col-sm-9'>
                        <div className='card p-4 mt-0'>
                            <div className='row'>
                                <div className='col'>
                                    <div className='form-group'>
                                        <h6>PRODUCT RAM</h6>
                                        <input type='text' name="productRam" value={formFields.productRam} onChange={inputChange} />
                                    </div>
                                </div>
                            </div>
                            <Button type="submit" className="btn-blue btn-lg btn-big w-100">
                                <FaCloudUploadAlt /> &nbsp;  {isLoading ? <CircularProgress color="inherit" className="loader" /> : 'PUBLISH AND VIEW'}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>

            {productRamData.length !== 0 && (
                <div className='row'>
                    <div className='col-md-9'>
                        <div className='card p-4 mt-0'>
                            <div className="table-responsive mt-3">
                                <table className="table table-bordered table-striped v-align">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>PRODUCT RAM</th>
                                            <th width="25%">ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productRamData.map((item, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <input
                                                        type="text"
                                                        value={editId === item._id ? formFields.productRam : item.productRam}
                                                        readOnly={editId !== item._id}
                                                    />
                                                </td>
                                                <td>
                                                    <div className="actions d-flex align-items-center">
                                                        <Button className="success" color="success" onClick={() => updateData(item._id)}>
                                                            <FaPencilAlt />
                                                        </Button>
                                                        <Button className="error" color="error" onClick={() => deleteItem(item._id)}>
                                                            <MdDelete />
                                                        </Button>
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
            )}
        </div>
    );
};

export default AddProductRAMS;
