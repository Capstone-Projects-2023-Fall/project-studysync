import * as React from "react";
import { useState } from "react";

import {
    Pagination,
    Typography,
    Avatar,
    ListItemAvatar,
    List,
    ListItemText,
    Divider,
    ListItem,
} from "@mui/material";
import useUser from "./useUser";
import { userRepository } from "../../firebase";
import { EVENT_TYPE } from "../models/event";
const { v4: uuidv4 } = require("uuid");

export default function Notification() {
    const [page, setPage] = useState(1);
    const itemsPerPage = 8; // You can adjust this value as needed

    const [notifications, setNotifications] = useState([]);
    const { user, isLoading } = useUser();

    React.useEffect(() => {
        if (!isLoading && user != null && user.uid) {
            userRepository.getNotifications(user.uid).then((result) => {
                result.reverse();
                setNotifications(result);
            });
        }
    }, [isLoading, user]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    let data = [];
    if (notifications.length > 0) {
        for (const notification of notifications) {
            switch (notification.event.eventType) {
                case EVENT_TYPE.NEW_FOLLOWER:
                    data.push(createNewFollowerEvent(notification));
            }
        }
    }

    return (
        <div>
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                {data
                    .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                    .map((item) => (
                        <React.Fragment key={item.id}>
                            <ListItem
                                alignItems="flex-start"
                                sx={styles.listItem}
                            >
                                <ListItemAvatar>
                                    <Avatar
                                        alt={item.author}
                                        src={item.avatar}
                                    />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={item.name}
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{ display: "inline" }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {item.author}
                                            </Typography>
                                            &nbsp;&nbsp;&nbsp;
                                            &nbsp;&nbsp;&nbsp;
                                            <Typography
                                                sx={{
                                                    display: "inline",
                                                    marginLeft: "auto",
                                                    color: "rgba(0, 0, 0, 0.54)", // Light grey color
                                                }}
                                                component="span"
                                                variant="body2"
                                            >
                                                {item.when}
                                            </Typography>
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </React.Fragment>
                    ))}
            </List>
            {notifications.length >= itemsPerPage && (
                <Pagination
                    count={Math.ceil(data.length / itemsPerPage)}
                    page={page}
                    onChange={handleChangePage}
                    color="primary"
                />
            )}
        </div>
    );
}

const styles = {
    listItem: {
        cursor: "pointer",
        "&:hover": {
            backgroundColor: "#f5f5f5", // Light grey background on hover
        },
    },
};

function createNewFollowerEvent(notification) {
    let data = {
        id: uuidv4(),
        name: "New Follower!",
    };
    data.author = notification.userFrom.name + " followed you!";
    data.avatar = notification.userFrom.imageURL;
    data.when = timeAgo(notification.createdAt);
    return data;
}

function createSharedQuizEvent(notification) {}

function timeAgo(timestamp) {
    const seconds = (Date.now() - timestamp) / 1000;

    if (seconds < 60) {
        return `${Math.floor(seconds)}s`;
    } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        return `${minutes}m`;
    } else if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600);
        return `${hours}h`;
    } else {
        const days = Math.floor(seconds / 86400);
        return `${days}d`;
    }
}
