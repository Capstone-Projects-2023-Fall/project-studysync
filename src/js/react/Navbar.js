import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/Navbar.css';
import useUser from './useUser';
import {signOut} from 'firebase/auth';
import { auth } from '../../firebase';

function Navbar({ items }) {

  const {user} = useUser();

  
  return (
    <nav className="navbar">
      <Link to="/" className="brand">StudySync</Link>
      <div className="nav-items">

      {items.map((item, index) => 
        <div key={index} className="nav-item">
          {item.link ? <Link to={item.link} onClick={item.action}>{item.label}</Link> : item.label}
          {item.submenu && 
            <div className="submenu"> 
              {item.submenu.map((subItem, subIndex) => <Link key={subIndex} to={subItem.link}>{subItem.label}</Link>)}
            </div>
          }
        </div>
      )}

      {user && <a  id='logout-btn' onClick={()=>signOut(auth)}> Logout</a>}
      </div>
    </nav>
  );
}


export default Navbar;