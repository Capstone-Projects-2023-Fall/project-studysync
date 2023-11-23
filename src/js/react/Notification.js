import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { useNavigate, useParams } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { notificationRepository, userRepository } from "../../firebase";
import { useEffect, useState } from "react";
import { SearchComponent } from "./SearchComponent";
import SingleUserComponent from "./SingleUserComponent";
import { UsersList } from "./SingleUserComponent";
import useUser from "./useUser";

export default function Notification() {
  const { user } = useUser();

  const [notifications, setNotifications] = useState([]);
  const [myData, setMyData] = useState([]);
  const [currUser, setCurrUser] = useState(null);

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       const res = await userRepository.getProfile(UserId);
  //       setCurrUser(res);
  //     } catch (error) {
  //       console.error("Error fetching user profile:", error);
  //     }
  //   };

  //   fetchProfile();
  //   userRepository.getRawNotifications(UserId).then((notifs) => {
  //     console.log("notifs are: ", notifs);
  //     setNotifications(notifs);
  //   });
  // }, [UserId]); // Include UserId in the dependency array if it might change

  useEffect(() => {
    if (user != null) {
      console.log("userId is: ", user.uid);
      userRepository.getRawNotifications(user.uid).then((res) => {
        console.log("banche notifications are: ", res);
      });
    }
  });
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
      id: 112,
      name: "Mike posted a new FlashcardSet",
      avatar: "/static/images/avatar/3.jpg",
      author: "Biology Study Set",
    },
    // Add more data as needed
  ];

  return (
    <div>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {data.map((item) => (
          <React.Fragment key={item.id}>
            <ListItem alignItems="flex-start">
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

      {/* <SingleUserComponent user={{ username: "Toey", n: "Jane Doeski" }} /> */}
    </div>
  );
}
