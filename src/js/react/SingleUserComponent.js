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
import { ListItemButton } from "@mui/material";
import TextField from "@mui/material/TextField";

export default function SingleUserComponent(props) {
  const { user, shouldFollow, handleFollowOrUnfollow } = props;

  const [_user,setUser] = useState()

  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar
            alt={user.name || user.firstName || user.email || user.username}
            src={user.imageURL}
          />
        </ListItemAvatar>
        <ListItemText
          primary={ user.name || user.firstName || user.email || user.id}

          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {user.n}
              </Typography>
            </React.Fragment>
          }
        />
        <Button onClick={() => handleFollowOrUnfollow(user.id)}>
          {shouldFollow ? "FOLLOW" : "UNFOLLOW"}
        </Button>
      </ListItem>
      <Divider />
    </>
  );
}
const SearchBar = ({ onSearch }) => {
  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    onSearch(searchTerm);
  };

  return (
    <TextField label="Search" variant="outlined" onChange={handleSearch} />
  );
};

export function UsersList(props) {
  //   const [users, setUsers] = useState([]);
  const { currUser, users, userStr } = props;
  const currUserId = currUser.id;

  const [filteredData, setFilteredData] = useState(users || []);
  console.log("userStr is: ", userStr);

  useEffect(() => {
    console.log("user data changed");
  });

  const handleSearch = (searchTerm) => {
    const filtered = users.filter((item) => {
      if (item.name != null) {
        return item.name.toLowerCase().includes(searchTerm.toLowerCase());
      }
      if (item.firstName != null) {
        return item.firstName.toLowerCase().includes(searchTerm.toLowerCase());
      }
      if (item.email != null) {
        return item.email.toLowerCase().includes(searchTerm.toLowerCase());
      }
    });
    setFilteredData(filtered);
  };

  //   useEffect(() => {
  //     userRepository.getAllUsers().then((res) => {
  //       setUsers(res);
  //     });
  //   }, [users]);

  async function handleFollowOrUnfollow(userId) {
    const user = await userRepository.getUserById(userId);
    const shouldFollow = !user.followers.includes(currUserId);
    if (shouldFollow) {
      return await followUser(userId);
    } else {
      await unfollowUser(userId);
      return;
    }
  }

  //   async function updateAllUsers() {
  //     // Fetch the updated user list after follow or unfollow
  //     const updatedUsers = await userRepository.getAllUsers();
  //     setUsers(updatedUsers);
  //   }

  async function unfollowUser(id) {
    //remove follower for the user being clicked on
    await userRepository.removeFollowing(currUserId, id);

    //remove following
    await userRepository.removeFollower(id, currUser.id);
    // Optionally, update state or perform other actions after unfollowing
  }

  async function followUser(userToFollowId) {
    const res = await userRepository.addFollowing(currUserId, userToFollowId);
    console.log("result adding following is: ", res);
    // Optionally, update state or perform other actions after following
    return res;
  }

  if (currUser == null) {
    return null;
  }

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      {filteredData.map((user) => (
        <SingleUserComponent
          handleFollowOrUnfollow={() => handleFollowOrUnfollow(user.id)}
          key={user.id}
          user={user}
          shouldFollow={!user.followers.includes(currUserId)}
        />
      ))}
    </div>
  );
}
