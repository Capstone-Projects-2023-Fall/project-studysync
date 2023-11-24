import React from "react";
import { Link } from "react-router-dom";
import "../../css/Navbar.css";
import useUser from "./useUser";
import { signOut } from "firebase/auth";
import { auth, userRepository } from "../../firebase";
import NotificationBadge from "./NotificationBadge";
import { useState, useEffect } from "react";
import Notification from "./Notification";

function Navbar({ items }) {
  const { user } = useUser();
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [count, setCount] = useState(0);
  const toggleNotificationPanel = () => {
    setIsNotificationPanelOpen(!isNotificationPanelOpen);
  };

  useEffect(() => {
    if (user != null) {
      userRepository.getNotificationCount(user.uid).then((res) => {
        setCount(res);
      });
    }
  }, [user]);

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        StudySync
      </Link>
      <div className="nav-items">
        {items.map((item, index) => (
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
        {user && (
          <a id="logout-btn" onClick={() => signOut(auth)}>
            Logout
          </a>
        )}
        {user && (
          <NotificationBadge count={count} onClick={toggleNotificationPanel} />
        )}
      </div>

      {/* Notification Panel */}
      {user && isNotificationPanelOpen && (
        <div
          className="notification-panel"
          style={{
            position: "absolute",
            top: "60px" /* Adjust this value based on your navbar's height */,
            right: "20px" /* Positioning the panel on the right */,
            width: "30%" /* Adjust the width as needed */,
            height: "60%",
            backgroundColor: "white",
            border: "1px solid #ccc",
            boxShadow: " 0 2px 8px rgba(0,0,0,0.15)",
            zIndex: "1000" /* Ensure it overlays other content */,
            overflowY: "auto",
          }}
        >
          {/* Your notification contents go here */}
          <Notification />
        </div>
      )}
    </nav>
  );
}

export default Navbar;
