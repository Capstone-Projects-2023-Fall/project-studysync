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
import User from "../models/user";
import { UsersList } from "./SingleUserComponent";
import GroupsIcon from '@mui/icons-material/Groups';
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="#">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

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

export default function FriendsPage() {
  const { UserId } = useParams();
  const [open, setOpen] = React.useState(true);
  const [type, setType] = useState("Friends");
  const [showList, setShowList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currUser, setCurrUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [userStr, setUserStr] = useState("");
  const navigate = useNavigate();

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
          console.log("all users are: ", res);
          setShowList([]);
          setIsLoading(false);
          setUsers(res);
          setUserStr(JSON.stringify(res));
        })
        .catch(() => console.log("error fetching all users"));

      userRepository.getProfile(UserId).then((res) => {
        setCurrUser(res);
        setIsLoading(false);
      });
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
  }, [type, userStr]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  function updateUserCount() {
    userRepository.getAllUsers().then((res) => {
      setUserStr(JSON.stringify(res));
    });
  }

  const styles = {
    marginBottom: "10%",
  };
  const mainListItems = (
    <React.Fragment>
      <ListItemButton style={styles}>
        <ListItemIcon>
          <PeopleIcon
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
          <PersonAddAltIcon
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
          <PeopleOutlineIcon
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
          <GroupsIcon
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

  function MainList() {
    function removeFriend(uid) {
      removeFollower(uid);
      stopFollowing(uid);
    }
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
    function viewUser(uid) {
      navigate(`/profile/${uid}`);
    }
    function followBack(uid) {
      userRepository
        .addFollowing(UserId, uid)
        .then(() => {
          console.log(`Followed ${uid} back!`);
        })
        .catch((e) => {
          setError(e);
          console.log(`Error: ${e}`);
        });
    }
    function stopFollowing(uid) {
      setIsLoading(true);
      userRepository
        .removeFollowing(UserId, uid)
        .then(() => {
          console.log(`Stopped Following ${uid}`);
          setIsLoading(false);
          updateUserCount();
        })
        .catch((e) => {
          setError(e);
          console.log(`Error: ${e}`);
          setIsLoading(false);
        });
      const index = showList.findIndex((x) => x.id === uid);
      showList.splice(index, 1);
      console.log(`Stopped following: ${showList}`);
      updateUserCount();
    }
    function handlebtn1(uid) {
      if (type == "Followers") {
        followBack(uid);
      } else {
        viewUser(uid);
      }
    }
    function handlebtn2(uid) {
      if (type == "Followers") {
        removeFollower(uid);
      } else if (type == "Following") {
        stopFollowing(uid);
      } else {
        removeFriend(uid);
      }
    }

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
                {user.firstName || user.name || user.email || user.id}{" "}
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
          <UsersList userStr={userStr} currUser={currUser} users={users} />
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
            <TableBody>
              {/* {displayList().map((user,index) => (
              <TableRow key={index}>
                {showList(user)}
              </TableRow>
            ))} */}
              {tableContent()}
            </TableBody>
          </Table>
        )}
      </React.Fragment>
    );
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
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  {/* <MainList type={type}/> */}
                  {MainList()}
                </Paper>
              </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
