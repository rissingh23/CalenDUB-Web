import './SignUpPage.css';
import logo from 'assets/logo.png';
import sideImage from 'assets/signup-image.webp';
import passwordEyeShow from 'assets/password-eye-show.png';
import passwordEyeHide from 'assets/password-eye-hide.png';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import GoogleLoginButton from 'components/GoogleLoginButton/GoogleLoginButton';
import { auth } from "../../firebase/firebase.ts";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { makeAuthenticatedRequest, API_ENDPOINTS } from '../../utils/api';

const SignUpPage: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!name || !email || !password) {
            setError('Please fill out all fields');
            setLoading(false);
            return;
        }
 
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            const user = result.user;
            console.log('Created user:', user);

            // Register user with backend using proper Authorization header
            const response = await makeAuthenticatedRequest(API_ENDPOINTS.USERS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    uid: user.uid, 
                    email: user.email,
                    name: name 
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to register with backend');
            }

            navigate('/explore');
        } catch(error : any) {
            console.error(error);

            switch (error.code) {
                case 'auth/email-already-in-use':
                    setError('This email is already in use. Please try logging in.');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email address. Please enter a valid email.');
                    break;
                case 'auth/weak-password':
                    setError('Password must be at least 6 characters.');
                    break;
                default:
                    setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='signup-component'>
            <div className='signup-component-fields'>
                <Link to='/' className='signup-component-fields-header'>
                    <img src={logo} alt="Logo" className='signup-component-fields-header-logo' />
                    <h1 className='signup-component-fields-header-name'>Calendub</h1>
                </Link>
                <div className='signup-component-fields-form'>
                    <div className='signup-component-fields-form-titles'>
                        <span className='form-title'>Get Started With Us</span>
                        <span className='form-subtitle'>Please enter your details</span>
                    </div>
                    <GoogleLoginButton />
                    <div className='or-separator'>
                        <hr />
                        or
                        <hr />
                    </div>
                    <div className="signup-form-container">
                        <div className="signup-form-field">
                            <span>Name</span>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="signup-form-field">
                            <span>Email address</span>
                            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="signup-form-field">
                            <span>Password</span>
                            <input type={showPassword? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
                            <div className="show-password" onClick={() => setShowPassword(!showPassword)}>
                                <img src={showPassword? passwordEyeHide : passwordEyeShow}></img>
                            </div>
                        </div>
                        <button onClick={handleSignUp}> {loading? 'Signing Up...' : 'Sign Up'} </button>
                    </div>
                    { error && <div className='signup-error-message'>{error}</div>}
                    <span>Already have an account? <a href="/login">Log In</a></span>
                </div>
            </div>
            <div className='signup-component-image'>
                <img src={sideImage} alt="Sign Up" className='signup-component-image-image' />
            </div>
        </div>
    );
};

export default SignUpPage;