import React from 'react';
import { Link ,useLocation} from 'react-router-dom';
import '../../css/Navbar.css';
import useUser from './useUser';
import {signOut} from 'firebase/auth';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
function Navbar({ items }) {

  const {user} = useUser();
  const navigate = useNavigate();
  const location = useLocation();

    // Filter out the 'Profile' tab if the URL contains 'profile'
  const filteredItems = items.filter((item) => !location.pathname.includes('profile'));
  
  return (
    <nav className="navbar">
      <Link to="/" className="brand">StudySync</Link>
      <div className="nav-items">
        {filteredItems.map((item, index) => (
          <div key={index} className="nav-item">
            {item.link ? (
              <Link to={item.link} onClick={item.action}>
                {item.label}
              </Link>
            ) : (
              item.label
            )}
            {item.submenu && (
              <div className="submenu">
                {item.submenu.map((subItem, subIndex) => (
                  <Link key={subIndex} to={subItem.link}>
                    {subItem.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        {user && <a id='logout-btn' onClick={() => signOut(auth)}> Logout</a>}
      </div>
    </nav>
  );

}


export default Navbar;