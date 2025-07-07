import './Header.css';
import logo from 'assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from 'context/AuthContext.tsx';
import { auth } from "../../firebase/firebase.ts";
import { signOut } from 'firebase/auth';

interface HeaderProps {}

const Header : React.FC<HeaderProps> = () => {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const { currentUser, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            console.log("Current User:", currentUser);
            setLoggedIn(!!currentUser);
        }
    }, [loading, currentUser]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setLoggedIn(false);
            setShowDropdown(false);
            navigate('/');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const handleGoToCalendar = () => {
        setShowDropdown(false);
        navigate('/');
    };

    return (
        <div className='header'>
            <Link to='/' className='header-branding'>
                <img src={logo} alt="Logo" className='header-branding-logo' />
                <h1 className='header-branding-name'>Calendub</h1>
            </Link>

            {loggedIn ? (
                <div className='header-profile-view'>
                    <div onClick={() => setShowDropdown(!showDropdown)} className='profile-dropdown-toggle'>
                        <h3>{currentUser?.email}</h3>
                        <span className={`caret-icon ${showDropdown ? 'rotate' : ''}`}>
                            {showDropdown ? '▲' : '▼'}
                        </span>
                    </div>

                    {showDropdown && (
                        <div className='dropdown-menu'>
                            { currentUser?.email?.endsWith('@uw.edu') && <div onClick={handleGoToCalendar}>Go to Calendar</div> } 
                            <div onClick={handleLogout}>Log Out</div>
                        </div>
                    )}
                </div>
            ) : (
                <div className='header-cta'>
                    <button onClick={() => navigate('/login')} className='header-cta-login'>Log In</button>
                    <button onClick={() => navigate('/signup')} className='header-cta-signup'>Sign Up</button>
                </div>
            )}
        </div>
    );
};

export default Header;
