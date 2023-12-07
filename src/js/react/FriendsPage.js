import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PeopleIcon from "@mui/icons-material/People";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Title from "./FriendsUI/Title";
import { userRepository } from "../../firebase";
import useUser from "./useUser";
import { useNavigate, useParams } from "react-router-dom";
import GroupsIcon from "@mui/icons-material/Groups";
import TextField from "@mui/material/TextField";
import SingleUserComponent from "./SingleUserComponent";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import EmojiPeopleRoundedIcon from "@mui/icons-material/EmojiPeopleRounded";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import ErrorPage from "./ErrorPage";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const defaultTheme = createTheme();
/**
 * @class FriendsPage
 * @classdesc FriendsPage - A React functional component for displaying and managing friends, followers, and following.
 * It offers features for viewing profiles, adding or removing friends, following or unfollowing users, and searching for new friends.
 */
export default function FriendsPage() {
  const { UserId } = useParams();
  const [open, setOpen] = React.useState(true);
  const [type, setType] = useState("Friends");
  const [showList, setShowList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currUser, setCurrUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const navigate = useNavigate();
  const currUserId = UserId;
  const { user } = useUser();
  useEffect(() => {
    setIsLoading(true);
    userRepository
      .getFriends(UserId)
      .then((friends) => {
        console.log(`friends: ${friends}`);
        setShowList(friends);
        setIsLoading(false);
      })
      .catch((e) => {
        setError(e);
        setIsLoading(false);
        console.log(`Error: ${e}`);
      });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    userRepository
      .getUserById(currUserId)
      .then((res) => {
        setCurrUser(res);
      })
      .catch((error) => {
        console.log("error finding user with id: ", currUserId);
        setError(error);
      });

    if (type == "Following") {
      userRepository
        .getFollowing(UserId)
        .then((_following) => {
          setShowList(_following);
          setIsLoading(false);
        })
        .catch((e) => {
          setError(e);
          setIsLoading(false);
          console.log(`Error: ${e}`);
        });
    } else if (type == "Followers") {
      userRepository
        .getFollowers(UserId)
        .then((followers) => {
          console.log(`followers: ${followers}`);
          setShowList(followers);
          setIsLoading(false);
        })
        .catch((e) => {
          setError(e);
          setIsLoading(false);
          console.log(`Error: ${e}`);
        });
    } else if (type == "Find Friends") {
      userRepository
        .getAllUsers()
        .then((res) => {
          setIsLoading(false);
          setUsers(res);
          setFilteredData(res.filter((item) => item.id != UserId));
        })
        .catch(() => console.log("error fetching all users"));
    } else {
      userRepository
        .getFriends(UserId)
        .then((friends) => {
          console.log(`friends: ${friends}`);
          setShowList(friends);
          setIsLoading(false);
        })
        .catch((e) => {
          setError(e);
          setIsLoading(false);
          console.log(`Error: ${e}`);
        });
    }
  }, [type]);
  /**
     * @memberof FriendsPage
     * @function toggleDrawer
     * @description Toggles the side drawer open and close state.
     */
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const styles = {
    marginBottom: "10%",
  };

  const mainListItems = (
    <React.Fragment>
      <ListItemButton style={styles}>
        <ListItemIcon>
          <GroupsIcon
            onClick={() => {
              setType("Friends");
            }}
          />
        </ListItemIcon>
        <ListItemText
          primary="Friends"
          onClick={() => {
            setType("Friends");
          }}
        />
      </ListItemButton>
      <ListItemButton style={styles}>
        <ListItemIcon>
          <PeopleOutlineRoundedIcon
            onClick={() => {
              setType("Following");
            }}
          />
        </ListItemIcon>
        <ListItemText
          primary="Following"
          onClick={() => {
            setType("Following");
          }}
        />
      </ListItemButton>
      <ListItemButton style={styles}>
        <ListItemIcon>
          <EmojiPeopleRoundedIcon
            onClick={() => {
              setType("Followers");
            }}
          />
        </ListItemIcon>
        <ListItemText
          primary="Followers"
          onClick={() => {
            setType("Followers");
          }}
        />
      </ListItemButton>
      <ListItemButton style={styles}>
        <ListItemIcon>
          <SearchRoundedIcon
            onClick={() => {
              setType("Find Friends");
            }}
          />
        </ListItemIcon>
        <ListItemText
          primary="Find Friends"
          onClick={() => {
            setType("Find Friends");
          }}
        />
      </ListItemButton>
    </React.Fragment>
  );
  /**
     * @memberof FriendsPage
     * @function MainList
     * @description Renders the main list of friends, followers, or following based on the selected type.
     * Allows users to manage their social connections.
     * @returns {React.Component} A component representing the main list in the FriendsPage.
     */
  function MainList() {
    function removeFriend(uid) {
      removeFollower(uid);
      unfollowUser(uid);
    }
    /**
 * @memberof FriendsPage
 * @function removeFollower
 * @description Removes a follower from the current user's followers list.
 * @param {string} uid - The unique ID of the user to be removed from followers.
 */
    function removeFollower(uid) {
      setIsLoading(true);
      userRepository
        .removeFollower(UserId, uid)
        .then(() => {
          console.log(`Remove ${uid}.`);
          setIsLoading(false);
        })
        .catch((e) => {
          setError(e);
          console.log(`Error: ${e}`);
          setIsLoading(false);
        });
    }
    /**
 * @memberof FriendsPage
 * @function viewUser
 * @description Navigates to the profile page of a specified user.
 * @param {string} uid - The unique ID of the user whose profile is to be viewed.
 */
    function viewUser(uid) {
      navigate(`/profile/${uid}`);
    }
    // function followBack(uid) {
    //   userRepository
    //     .addFollowing(UserId, uid)
    //     .then(() => {
    //       console.log(`Followed ${uid} back!`);
    //     })
    //     .catch((e) => {
    //       setError(e);
    //       console.log(`Error: ${e}`);
    //     });
    // }

    // function stopFollowing(uid) {
    //   setIsLoading(true);
    //   userRepository
    //     .removeFollowing(UserId, uid)
    //     .then(() => {
    //       console.log(`Stopped Following ${uid}`);
    //       setIsLoading(false);
    //     })
    //     .catch((e) => {
    //       setError(e);
    //       console.log(`Error: ${e}`);
    //       setIsLoading(false);
    //     });
    //   const index = showList.findIndex((x) => x.id === uid);
    //   showList.splice(index, 1);
    //   console.log(`Stopped following: ${showList}`);
    // }
    /**
     * @memberof FriendsPage
     * @function handlebtn1
     * @description Handles actions for the first button in the table. This could be either following a user or viewing a user's profile.
     * @param {string} uid - The unique ID of the user for which the action is to be taken.
     */
    function handlebtn1(uid) {
      if (type == "Followers") {
        followUser(uid);
      } else {
        viewUser(uid);
      }
    }
    /**
 * @memberof FriendsPage
 * @function handlebtn2
 * @description Handles actions for the second button in the table. This could be removing a friend, unfollowing a user, or removing a follower.
 * @param {string} uid - The unique ID of the user for which the action is to be taken.
 */
    function handlebtn2(uid) {
      if (type == "Followers") {
        removeFollower(uid);
      } else if (type == "Following") {
        //stopFollowing(uid);
        unfollowUser(uid);
      } else {
        removeFriend(uid);
      }
    }
    /**
     * @memberof FriendsPage
     * @function handleFollowOrUnfollow
     * @description Decides whether to follow or unfollow a user based on the current state.
     * @param {string} userId - The unique ID of the user to follow or unfollow.
     * @param {boolean} isFollowing - Indicates whether the current user is already following the target user.
     */
    const handleFollowOrUnfollow = (userId, isFollowing) => {
      const shouldFollow = isFollowing;
      if (shouldFollow) {
        unfollowUser(userId);
      } else {
        followUser(userId);
      }
    };

    async function unfollowUser(userToUnfollowId) {
      await userRepository.stopFollowing(currUser.id, userToUnfollowId);
    }

    async function followUser(userToFollowId) {
      await userRepository.startFollowing(currUser.id, userToFollowId);
    }

    const handleSearch = (searchTerm) => {
      const filtered = users.filter((item) => {
        if (item.name != null) {
          return item.name.toLowerCase().includes(searchTerm.toLowerCase());
        }
        if (item.firstName != null) {
          return item.firstName
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        }
        if (item.email != null) {
          return item.email.toLowerCase().includes(searchTerm.toLowerCase());
        }
      });
      setFilteredData(filtered);
    };
    /**
     * @memberof FriendsPage
     * @function tableContent
     * @description Generates the table content based on the current type (Friends, Following, or Followers).
     * @returns {React.Component} Table rows with user data and action buttons.
     */
    function tableContent() {
      let firstbtn = "";
      let secondbtn = "";
      if (type == "Friends") {
        firstbtn = "View Profile";
        secondbtn = "Remove friend";
      } else if (type == "Following") {
        firstbtn = "View Profile";
        secondbtn = "Stop Following";
      } else {
        firstbtn = "Follow Back";
        secondbtn = "Remove Follower";
      }
      return (
        <>
          {showList.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                {user.name || user.firstName || user.email || user.id}{" "}
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>
                <Button
                  onClick={() => {
                    handlebtn1(user.id);
                  }}
                  variant="contained"
                >
                  {firstbtn}
                </Button>
              </TableCell>
              <TableCell align="right">
                <Button
                  onClick={() => {
                    handlebtn2(user.id);
                  }}
                  sx={{ backgroundColor: "red" }}
                  variant="contained"
                >
                  {secondbtn}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </>
      );
    }
    if (isLoading) {
      return (
        <>
          <head>
            <link
              href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css"
              rel="stylesheet"
              id="bootstrap-css"
            />
            <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
            <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
          </head>
          <div class="container emp-profile">
            <h2>LOADING {type}...</h2>
          </div>
        </>
      );
    }
    if (error) {
      return (
        <>
          <head>
            <link
              href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css"
              rel="stylesheet"
              id="bootstrap-css"
            />
            <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
            <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
          </head>
          <div class="container emp-profile">
            <h2>ERROR LOADING {type}...</h2>
          </div>
        </>
      );
    }

    return (
      <React.Fragment>
        <Title> {type}</Title>
        {type == "Find Friends" && currUser != null && (
          <div>
            <SearchBar onSearch={handleSearch} />
            {filteredData.map((user, index) => {
              return (
                <SingleUserComponent
                  handleFollowOrUnfollow={handleFollowOrUnfollow}
                  key={user.id ?? index}
                  user={user}
                  shouldFollow={!currUser.following.includes(user.id)}
                />
              );
            })}
          </div>
        )}

        {type != "Find Friends" && (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{tableContent()}</TableBody>
          </Table>
        )}
      </React.Fragment>
    );
  }

  if (!user || (user && user.uid != UserId)) {
    return <ErrorPage code="401" />;
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">{mainListItems}</List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {MainList()}
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
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