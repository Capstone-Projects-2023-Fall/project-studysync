import * as React from "react";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function SingleUserComponent(props) {
  const { user, shouldFollow, handleFollowOrUnfollow } = props;

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
          primary={user.firstName || user.email || user.username}
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
        <Button onClick={handleFollowOrUnfollow}>
          {shouldFollow ? "FOLLOW" : "UNFOLLOW"}
        </Button>
      </ListItem>
      <Divider />
    </>
  );
}
