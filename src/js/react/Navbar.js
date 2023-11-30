import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../../css/Navbar.css";
import useUser from "./useUser";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, userRepository } from "../../firebase";
import NotificationBadge from "./NotificationBadge";
import { useState, useEffect } from "react";
import Notification from "./Notification";
import useNotificationCount from "./useNotificationCount";
function Navbar({ items }) {
    const { user, isLoading } = useUser();
    const [isNotificationPanelOpen, setIsNotificationPanelOpen] =
        useState(false);
    const [count, setCount] = useState(0);

    const [currUser, setCurrUser] = useState(null)
    useEffect(()=>{
        setCurrUser(user)
    }, [user, isLoading])
    const notificationCount = useNotificationCount()

    const toggleNotificationPanel = () => {
        if (isNotificationPanelOpen) {
            userRepository.setNotificationCountoZero(user.uid).then((res) => {
                setCount(0);
            });
        }
        setIsNotificationPanelOpen(!isNotificationPanelOpen);
    };

    useEffect(() => {
        if (user != null) {
            userRepository.getNotificationCount(user.uid).then((res) => {
                setCount(res);
            });
        }
    }, [user]);

    const navigate = useNavigate();
    const location = useLocation();

    // Filter out the 'Profile' tab if the URL contains 'profile'
    const filteredItems = items.filter(
        (item) => !location.pathname.includes("profile")
    );

    return (
        <nav className="navbar">
            <Link to="/" className="brand">
                StudySync
            </Link>
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
                {user && (
                    <a id="logout-btn" onClick={() => signOut(auth)}>
                        {" "}
                        Logout
                    </a>
                )}

                {user && (
                    <NotificationBadge
                        count={notificationCount}
                        onClick={toggleNotificationPanel}
                    />
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
                        borderRadius: "15px",
                    }}
                >
                    {/* Your notification contents go here */}
                    <Notification userId={user} closePanel={toggleNotificationPanel}/>
                </div>
            )}
        </nav>
    );
}

export default Navbar;