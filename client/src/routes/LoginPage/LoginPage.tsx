import './LoginPage.css';
import logo from 'assets/logo.png';
import sideImage from 'assets/login-image.jpg';
import passwordEyeShow from 'assets/password-eye-show.png';
import passwordEyeHide from 'assets/password-eye-hide.png';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import GoogleLoginButton from 'components/GoogleLoginButton/GoogleLoginButton';
import { auth } from "../../firebase/firebase";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { makeAuthenticatedRequest, API_ENDPOINTS } from '../../utils/api';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        console.log('Submitted:', { email, password });

        if (!email || !password) {
            setError('Please fill out all fields.');
            setLoading(false);
            return;
        }

        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            const user = result.user;
            console.log('Logged in user:', user);

            // Register/authenticate user with backend using proper Authorization header
            const response = await makeAuthenticatedRequest(API_ENDPOINTS.USERS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    uid: user.uid, 
                    email: user.email 
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to authenticate with backend');
            }

            navigate('/explore');
        } catch (error : any) {
            console.error(error);
            
            switch (error.code) {
                case 'auth/invalid-email':
                    setError('Invalid email address. Please enter a valid email.');
                    break;
                case 'auth/invalid-credential':
                    setError('No account found with this email and password.');
                    break;
                case 'auth/too-many-requests':
                    setError('Too many failed attempts. Please try again later.');
                    break;
                default:
                    setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='login-component'>
            <div className='login-component-fields'>
                <Link to='/' className='login-component-fields-header'>
                    <img src={logo} alt="Logo" className='login-component-fields-header-logo' />
                    <h1 className='login-component-fields-header-name'>Calendub</h1>
                </Link>
                <div className='login-component-fields-form'>
                    <div className='login-component-fields-form-titles'>
                        <span className='form-title'>Welcome Back</span>
                        <span className='form-subtitle'>Please enter your details</span>
                    </div>
                    <GoogleLoginButton />
                    <div className='or-separator'>
                        <hr></hr>
                            or
                        <hr></hr>
                    </div>
                    <div className="login-form-container">
                        <div className="form-field">
                            <span>Email address</span>
                            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <div className="form-field">
                            <span>Password</span>
                            <input type={showPassword? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}/>
                            <div className="show-password" onClick={() => setShowPassword(!showPassword)}>
                                <img src={showPassword? passwordEyeHide : passwordEyeShow}></img>
                            </div>
                        </div>
                        <button onClick={handleLogIn} disabled={loading}> {loading? 'Logging In...' : 'Log In'} </button>
                    </div>
                    { error && <div className='error-message'>{error}</div>}
                    <span>Don't have an account? <a href="/signup">Sign Up</a></span>
                </div>
            </div>
            <div className='login-component-image'>
                <img src={sideImage} alt="Login" className='login-component-image-image' />
            </div>
        </div>
    )
};

export default LoginPage;