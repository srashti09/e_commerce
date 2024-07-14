import { useContext, useEffect, useState } from 'react';
import Logo from '../../assets/images/logo.webp';
import patern from '../../assets/images/pattern.webp';
import { MyContext } from '../../App';
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import Button from '@mui/material/Button';
import { Link, useNavigate } from "react-router-dom";
import googleIcon from '../../assets/images/googleIcon.png';
import { postData } from '../../utils/api';
import CircularProgress from '@mui/material/CircularProgress';

const Login = () => {
    const [inputIndex, setInputIndex] = useState(null);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const history = useNavigate();
    const context = useContext(MyContext);

    const [formfields, setFormfields] = useState({
        email: "",
        password: "",
        isAdmin: true // Adjust based on your application logic
    });

    useEffect(() => {
        context.setisHideSidebarAndHeader(true);

        // Check if user is already logged in
        const token = localStorage.getItem("token");
        if (token) {
            history("/dashboard"); // Redirect to dashboard or appropriate page
        }
    }, []);

    const focusInput = (index) => {
        setInputIndex(index);
    };

    const onChangeInput = (e) => {
        setFormfields({
            ...formfields,
            [e.target.name]: e.target.value
        });
    };

    const signIn = (e) => {
        e.preventDefault();

        // Validate form fields
        if (formfields.email === "" || formfields.password === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Please fill in all fields"
            });
            return;
        }

        setIsLoading(true);

        // Make API call to sign in
        postData("/api/user/signin", formfields)
            .then((res) => {
                console.log('Response:', res);

                if (res.error !== true) {
                    // Save token to localStorage
                    localStorage.setItem("token", res.token);

                    // Check if user is admin
                    if (res.user?.isAdmin === true) {
                        const user = {
                            name: res.user?.name,
                            email: res.user?.email,
                            userId: res.user?.id,
                            isAdmin: res.user?.isAdmin
                        };

                        // Save user info to localStorage
                        localStorage.setItem("user", JSON.stringify(user));

                        context.setAlertBox({
                            open: true,
                            error: false,
                            msg: "User Login Successfully!"
                        });

                        setTimeout(() => {
                            setIsLoading(false);
                            history("/dashboard");
                        }, 2000);
                    } else {
                        context.setAlertBox({
                            open: true,
                            error: true,
                            msg: "You are not authorized to access this dashboard"
                        });
                        setIsLoading(false);
                    }
                } else {
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: res.msg || "Error signing in. Please try again."
                    });
                    setIsLoading(false);
                }
            })
            .catch((error) => {
                console.error('Error posting data:', error);
                setIsLoading(false);
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "Error connecting to the server. Please try again later."
                });
            });
    };

    return (
        <>
            <img src={patern} className='loginPatern' />
            <section className="loginSection">
                <div className="loginBox">
                    <div className='logo text-center'>
                        <img src={Logo} width="60px" alt="Logo" />
                        <h5 className='font-weight-bold'>Login to Hotash</h5>
                    </div>

                    <div className='wrapper mt-3 card border'>
                        <form onSubmit={signIn}>
                            <div className={`form-group position-relative ${inputIndex === 0 && 'focus'}`}>
                                <span className='icon'><MdEmail /></span>
                                <input
                                    type='text'
                                    className='form-control'
                                    placeholder='Enter your email'
                                    onFocus={() => focusInput(0)}
                                    onBlur={() => setInputIndex(null)}
                                    autoFocus
                                    name="email"
                                    value={formfields.email}
                                    onChange={onChangeInput}
                                />
                            </div>

                            <div className={`form-group position-relative ${inputIndex === 1 && 'focus'}`}>
                                <span className='icon'><RiLockPasswordFill /></span>
                                <input
                                    type={`${isShowPassword ? 'text' : 'password'}`}
                                    className='form-control'
                                    placeholder='Enter your password'
                                    onFocus={() => focusInput(1)}
                                    onBlur={() => setInputIndex(null)}
                                    name="password"
                                    value={formfields.password}
                                    onChange={onChangeInput}
                                />

                                <span className='toggleShowPassword' onClick={() => setIsShowPassword(!isShowPassword)}>
                                    {isShowPassword ? <IoMdEyeOff /> : <IoMdEye />}
                                </span>
                            </div>

                            <div className='form-group'>
                                <Button type='submit' className="btn-blue btn-lg w-100 btn-big">
                                    {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
                                </Button>
                            </div>

                            <div className='form-group text-center mb-0'>
                                <Link to={'/forgot-password'} className="link">Forgot Password?</Link>
                                <div className='d-flex align-items-center justify-content-center or mt-3 mb-3'>
                                    <span className='line'></span>
                                    <span className='txt'>or</span>
                                    <span className='line'></span>
                                </div>

                                <Button variant="outlined" className='w-100 btn-lg btn-big loginWithGoogle'>
                                    <img src={googleIcon} width="25px" alt="Google Icon" /> &nbsp; Sign In with Google
                                </Button>
                            </div>
                        </form>
                    </div>

                    <div className='wrapper mt-3 card border footer p-3'>
                        <span className='text-center'>
                            Don't have an account? <Link to={'/signUp'} className='link color ml-2'>Register</Link>
                        </span>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Login;
