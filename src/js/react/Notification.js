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
import { userRepository} from "../../firebase";
import { EVENT_TYPE } from "../models/event";
import {
    addNewIdField,
    updateQuestion,
    getAllDocumentsInCollection,
} from "../../firebase";
import { useNavigate} from "react-router-dom";
export default function Notification({userId, closePanel}) {
 
    const [page, setPage] = useState(1);
    const itemsPerPage = 8; // You can adjust this value as needed

    const [notifications, setNotifications] = useState([]);
    const { user, isLoading } = useUser();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (userId != null) {
            userRepository.getNotifications(userId.uid).then((result) => {
                setNotifications(result);
            });
        }
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };


    return (
        <div>
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                {parseNotifications(notifications)
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
                                        onClick={()=>{
                                            navigate(`/profile/${item.userFrom}`)
                                            closePanel()
                                        }}
                                    />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={item.name}
                                    onClick={()=>{
                                                
                                    if(item.isFlashcard){
                                        navigate(`/flashcard-ui/${item.sharedFlashcardId}`);
                                    }else if(item.isFollower){
                                        navigate(`/profile/${item.userFrom}`)
                                    }else{
                                        navigate(`/quizmain/${item.sharedQuizId}`)
                                    }
                                    
                                    closePanel()
                                }}
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{ display: "inline" }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                                onClick={()=>{
                                                if(item.isFlashcard){
                                                    navigate(`/flashcard-ui/${item.sharedFlashcardId}`);
                                                }else if(item.isFollower){
                                                    navigate(`/profile/${item.userFrom}`)
                                                    console.log("not flashcard banchekry sia: ", item.isFollower)
                                                }else{
                                                    navigate(`/quizmain/${item.sharedQuizId}`)
                                                }
                                                
                                                closePanel()
                                            }}
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
                    count={Math.ceil(notifications.length / itemsPerPage)}
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
        id: notification.id,
        name: "New Follower!",
    };
    data.author = notification.userFrom.name + " followed you!";
    data.avatar = notification.userFrom.imageURL;
    data.when = timeAgo(notification.createdAt);
    data.userFrom = notification.userFrom.id
    data.isFollower = true
    data.currUser = notification.event.newFollowerEvent.followingId
    return data;
}

function createSharedQuizEvent(notification) {
    let data = {
        id: notification.id,
        name: `${notification.userFrom.name} shared a Quiz with you!`,
    };
    data.author = notification.quiz.name;
    data.avatar = notification.userFrom.imageURL;
    data.when = timeAgo(notification.createdAt);
    data.userFrom = notification.userFrom.id
    data.isQuiz = true
    data.sharedQuizId = notification.quiz.id
    data.currUser = notification.event.shareQuizEvent.sharedWith
    return data;
}

function createSharedFlashcardEvent(notification) {
    let data = {
        id: notification.id,
        name: `${notification.userFrom.name} shared a Flashcard with you!`,
    };
    data.author = notification.flashcard.name;
    data.avatar = notification.userFrom.imageURL;
    data.when = timeAgo(notification.createdAt);
    data.sharedFlashcardId = notification.flashcard.id
    data.userFrom = notification.userFrom.id
    data.isFlashcard = true
    data.currUser = notification.event.shareFlashcardEvent.sharedWith
    return data;
}

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

function parseNotifications(notifications){
    console.log("notifications: ", notifications)
    const data = []
    for (const notification of notifications) {
        if(!notification.event) continue
        switch (notification.event.eventType) {
            case EVENT_TYPE.NEW_FOLLOWER:
                data.push(createNewFollowerEvent(notification));
                break;
            case EVENT_TYPE.SHARE_QUIZ:
                data.push(createSharedQuizEvent(notification));
                break;
            case EVENT_TYPE.SHARE_FLASHCARD:
                data.push(createSharedFlashcardEvent(notification));
                break;
            default:
                break;
        }
    }
    return data
}