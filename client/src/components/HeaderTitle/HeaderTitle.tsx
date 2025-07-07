import './HeaderTitle.css';
import { Link } from 'react-router-dom';

const HeaderTitle = () => {
  return (
    <header className = "body">
      <Link to='/' className = "alignment">
        <img src= "src/components/HeaderTitle/calendub-transparent.png" alt= "logo" className = "logo"></img>
        <h1 className = "name"> CalenDub</h1>
        </Link>
    </header>
  );
};

export default HeaderTitle;
