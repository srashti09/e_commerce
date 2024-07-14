import { useContext, useEffect, useState } from 'react';
import Logo from '../../assets/images/logo.webp';
import patern from '../../assets/images/pattern.webp';
import { MyContext } from '../../App';
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import Button from '@mui/material/Button';
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaPhoneAlt } from "react-icons/fa";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { IoMdHome } from "react-icons/io";
import CircularProgress from '@mui/material/CircularProgress';
import googleIcon from '../../assets/images/googleIcon.png';
import { postData } from '../../utils/api';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const SignUp = () => {
    const [inputIndex, setInputIndex] = useState(null);
    const [isShowPassword, setisShowPassword] = useState(false);
    const [isShowConfirmPassword, setisShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formfields, setFormfields] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        isAdmin: true // Adjust this based on your application logic
    });

    const history = useNavigate();
    const context = useContext(MyContext);

    useEffect(() => {
        context.setisHideSidebarAndHeader(true);
        window.scrollTo(0, 0);
    }, []);

    const focusInput = (index) => {
        setInputIndex(index);
    };

    const onchangeInput = (e) => {
        setFormfields((prevFormfields) => ({
            ...prevFormfields,
            [e.target.name]: e.target.value
        }));
    };

    const signUp = (e) => {
        e.preventDefault();

        try {
            // Validate form fields
            if (formfields.name === "" || formfields.email === "" || formfields.phone === "" || formfields.password === "" || formfields.confirmPassword === "") {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "All fields are required"
                });
                return;
            }

            if (formfields.confirmPassword !== formfields.password) {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "Passwords do not match"
                });
                return;
            }

            setIsLoading(true);

            // Make API call to sign up
            console.log('Sending signup request with:', formfields); // Log the form data being sent
            postData("/api/user/signup", formfields)
                .then((res) => {
                    console.log('Response:', res);

                    // Ensure res is defined and has the expected properties
                    if (res && res.error !== undefined) {
                        if (!res.error) {
                            context.setAlertBox({
                                open: true,
                                error: false,
                                msg: "Registered Successfully!"
                            });
                            setTimeout(() => {
                                setIsLoading(false);
                                history("/login");
                            }, 2000);
                        } else {
                            setIsLoading(false);
                            context.setAlertBox({
                                open: true,
                                error: true,
                                msg: res.msg || "Error signing up. Please try again."
                            });
                        }
                    } else {
                        setIsLoading(false);
                        console.error('Unexpected response format:', res);
                        context.setAlertBox({
                            open: true,
                            error: true,
                            msg: "Unexpected response from server. Please try again."
                        });
                    }
                })
                .catch((error) => {
                    setIsLoading(false);
                    console.error('Error posting data:', error);
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: "Error connecting to the server. Please try again later."
                    });
                });
        } catch (error) {
            setIsLoading(false);
            console.error('Unexpected error:', error);
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Unexpected error. Please try again."
            });
        }
    };

    return (
        <>
            <img src={patern} className='loginPatern' alt="Pattern" />
            <section className="loginSection signUpSection">
                <div className='row'>
                    <div className='col-md-8 d-flex align-items-center flex-column part1 justify-content-center'>
                        <h1>BEST UX/UI FASHION <span className='text-sky'>ECOMMERCE DASHBOARD</span> & ADMIN PANEL</h1>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries</p>

                        <div className='w-100 mt-4'>
                            <Link to={'/'}><Button className="btn-blue btn-lg btn-big"><IoMdHome /> Go To Home</Button></Link>
                        </div>
                    </div>

                    <div className='col-md-4 pr-0'>
                        <div className="loginBox">
                            <div className='logo text-center'>
                                <img src={Logo} width="60px" alt="Logo" />
                                <h5 className='font-weight-bold'>Register a new account</h5>
                            </div>

                            <div className='wrapper mt-3 card border'>
                                <form onSubmit={signUp}>

                                    <div className={`form-group position-relative ${inputIndex === 0 && 'focus'}`}>
                                        <span className='icon'><FaUserCircle /></span>
                                        <input type='text' className='form-control' placeholder='Enter your name' onFocus={() => focusInput(0)} onBlur={() => setInputIndex(null)} autoFocus name="name" onChange={onchangeInput} />
                                    </div>

                                    <div className={`form-group position-relative ${inputIndex === 1 && 'focus'}`}>
                                        <span className='icon'><MdEmail /></span>
                                        <input type='text' className='form-control' placeholder='Enter your email' onFocus={() => focusInput(1)} onBlur={() => setInputIndex(null)} name="email" onChange={onchangeInput} />
                                    </div>

                                    <div className={`form-group position-relative ${inputIndex === 2 && 'focus'}`}>
                                        <span className='icon'><FaPhoneAlt /></span>
                                        <input type='text' className='form-control' placeholder='Enter your Phone' onFocus={() => focusInput(2)} onBlur={() => setInputIndex(null)} name="phone" onChange={onchangeInput} />
                                    </div>

                                    <div className={`form-group position-relative ${inputIndex === 3 && 'focus'}`}>
                                        <span className='icon'><RiLockPasswordFill /></span>
                                        <input type={`${isShowPassword ? 'text' : 'password'}`} className='form-control' placeholder='Enter your password' onFocus={() => focusInput(3)} onBlur={() => setInputIndex(null)} name="password" onChange={onchangeInput} />

                                        <span className='toggleShowPassword' onClick={() => setisShowPassword(!isShowPassword)}>
                                            {isShowPassword ? <IoMdEyeOff /> : <IoMdEye />}
                                        </span>
                                    </div>

                                    <div className={`form-group position-relative ${inputIndex === 4 && 'focus'}`}>
                                        <span className='icon'><IoShieldCheckmarkSharp /></span>
                                        <input type={`${isShowConfirmPassword ? 'text' : 'password'}`} className='form-control' placeholder='Confirm your password' onFocus={() => focusInput(4)} onBlur={() => setInputIndex(null)} name="confirmPassword" onChange={onchangeInput} />

                                        <span className='toggleShowPassword' onClick={() => setisShowConfirmPassword(!isShowConfirmPassword)}>
                                            {isShowConfirmPassword ? <IoMdEyeOff /> : <IoMdEye />}
                                        </span>
                                    </div>

                                    <FormControlLabel control={<Checkbox />} label="I agree to the all Terms & Conditions" />

                                    <div className='form-group'>
                                        <Button type='submit' className="btn-blue btn-lg w-100 btn-big">
                                            {isLoading ? <CircularProgress size={24} /> : 'Sign Up'}
                                        </Button>
                                    </div>

                                    <div className='form-group text-center mb-0'>
                                        <div className='d-flex align-items-center justify-content-center or mt-3 mb-3'>
                                            <span className='line'></span>
                                            <span className='txt'>or</span>
                                            <span className='line'></span>
                                        </div>

                                        <Button variant="outlined" className='w-100 btn-lg btn-big loginWithGoogle'>
                                            <img src={googleIcon} alt="Google Icon" width="25px" /> &nbsp; Sign In with Google
                                        </Button>
                                    </div>

                                </form>

                                <span className='text-center d-block mt-3'>
                                    Already have an account?
                                    <Link to={'/login'} className='link color ml-2'>Sign In</Link>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SignUp;
