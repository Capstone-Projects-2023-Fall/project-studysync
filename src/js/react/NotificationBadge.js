import * as React from "react";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function NotificationBadge({ onClick, count }) {
    // You can dynamically set the badgeContent based on your application's logic
    return (
        <Badge
            onClick={onClick}
            style={{ cursor: "pointer" }}
            badgeContent={count}
            color="primary"
        >
            <NotificationsIcon color="action" />
        </Badge>
    );
}
