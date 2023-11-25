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
        console.log(isLoading, user);
        if (!isLoading && user != null && user.uid) {
            userRepository.getNotifications(user.uid).then((result) => {
                console.log("result is: ", result);
                setNotifications(result);
            });
        }
    }, [isLoading, user]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    let d = [];
    if (notifications.length > 0) {
        console.log("notificartions are: ", notifications);
        for (const notification of notifications) {
            switch (notification.event.eventType) {
                case EVENT_TYPE.NEW_FOLLOWER:
                    d.push(createNewFollowerEvent(notification));
            }
        }
    }

    console.log("d is: ", d);
    const data = [
        {
            id: 1,
            name: "New Follower!",
            avatar: "/static/images/avatar/1.jpg",
            author: "Mike12334 followed you 10m ago",
        },
        {
            id: 2,
            name: "Jane Shared a quiz with you!",
            avatar: "/static/images/avatar/2.jpg",
            author: "Quiz: Intro To CS",
        },
        {
            id: 36767,
            name: "Mike posted a new FlashcardSet",
            avatar: "/static/images/avatar/3.jpg",
            author: "Biology Study Set",
        },
    ];

    return (
        <div>
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                {d
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

async function getUserById(userId) {
    try {
        const user = await userRepository.getUserById(userId);
        return user;
    } catch (error) {
        return error;
    }
}

function createNewFollowerEvent(notification) {
    let data = {
        id: uuidv4(),
        name: "New Follower!",
    };
    data.author = notification.userFrom.name + " followed you!";
    data.avatar = notification.userFrom.imageURL;
    return data;
}

function createSharedQuizEvent(notification) {
    try {
    } catch (erorr) {}
}
