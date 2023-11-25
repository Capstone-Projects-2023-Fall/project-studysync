import * as React from "react";
import { useState } from "react";
import { Pagination, Typography, Avatar, ListItemAvatar, List, ListItemText, Divider, ListItem } from "@mui/material";
import useUser from "./useUser";
import { userRepository } from "../../firebase";

export default function Notification() {
  const [page, setPage] = useState(1);
  const itemsPerPage = 8; // You can adjust this value as needed

  const [notifications, setNotifications] = useState([])
  const { user } = useUser()

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

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
      id: 35665676,
      name: "Mike posted a new FlashcardSet",
      avatar: "/static/images/avatar/3.jpg",
      author: "Biology Study Set",
    },
    {
      id: 3353656,
      name: "Mike posted a new FlashcardSet",
      avatar: "/static/images/avatar/3.jpg",
      author: "Biology Study Set",
    },
    {
      id: 345546,
      name: "Mike posted a new FlashcardSet",
      avatar: "/static/images/avatar/3.jpg",
      author: "Biology Study Set",
      read: "true"
    },
    {
      id: 36767,
      name: "Mike posted a new FlashcardSet",
      avatar: "/static/images/avatar/3.jpg",
      author: "Biology Study Set",
    },
    {
      id: 356565,
      name: "Mike posted a new FlashcardSet",
      avatar: "/static/images/avatar/3.jpg",
      author: "Biology Study Set",
    },
    {
      id: 31221,
      name: "Mike posted a new FlashcardSet",
      avatar: "/static/images/avatar/3.jpg",
      author: "Biology Study Set",
    },
    {
      id: 31212121,
      name: "Mike posted a new FlashcardSet",
      avatar: "/static/images/avatar/3.jpg",
      author: "Biology Study Set",
    },
    {
      id: 312132,
      name: "Mike posted a new FlashcardSet",
      avatar: "/static/images/avatar/3.jpg",
      author: "Biology Study Set",
    },
    {
      id: 111112,
      name: "Mike posted a new FlashcardSet",
      avatar: "/static/images/avatar/3.jpg",
      author: "Biology Study Set",
    },
    {
      id: 123222212,
      name: "Mike posted a new FlashcardSet",
      avatar: "/static/images/avatar/3.jpg",
      author: "Biology Study Set",
    },
    {
      id: 1232166312,
      name: "Mike posted a new FlashcardSet",
      avatar: "/static/images/avatar/3.jpg",
      author: "Biology Study Set",
    },
    {
      id: 1232312,
      name: "Mike posted a new FlashcardSet",
      avatar: "/static/images/avatar/3.jpg",
      author: "Biology Study Set",
    },
    {
      id: 11232,
      name: "Mike posted a new FlashcardSet",
      avatar: "/static/images/avatar/3.jpg",
      author: "Biology Study Set",
    },
    // Add more data as needed
  ];

  React.useEffect(() => {
    if (user != null) {
      userRepository.getNotifications(user.uid).then((result) => {
        console.log("result is: ", result)
        setNotifications(result)
      })
    }
  }, [])

  return (
    <div>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {data
          .slice((page - 1) * itemsPerPage, page * itemsPerPage)
          .map((item) => (
            <React.Fragment key={item.id}>
              <ListItem alignItems="flex-start" sx={styles.listItem}>
                <ListItemAvatar>
                  <Avatar alt={item.author} src={item.avatar} />
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
      <Pagination
        count={Math.ceil(data.length / itemsPerPage)}
        page={page}
        onChange={handleChangePage}
        color="primary"
      />
    </div>
  );
}


const styles = {
  listItem: {
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#f5f5f5", // Light grey background on hover
    },
  }
}

async function getUserById(userId){
  try{
    const user = await userRepository.getUserById(userId);
    return user
  }catch(error){
    return error
  }
}

async function createNewFollowerEvent(notification){
  try{
    
  }catch(erorr){

  }
}

async function createSharedQuizEvent(notification){
  try{

  }catch(erorr){

  }
}


