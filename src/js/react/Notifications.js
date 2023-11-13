import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { useNavigate, useParams } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { notificationRepository, userRepository } from '../../firebase';
import { useEffect, useState} from 'react';
import { SearchComponent } from './SearchComponent';


export default function Notification() {
    const {UserId } = useParams();

    const [notifications, setNotifications] = useState([])
    const [error, setError] = useState(false)
    const [myData, setMyData] = useState([])


  
  async function getUserProfileInfo(id){
    const user = await userRepository.getProfile(id)
    return user
  }

  let id = UserId
  useEffect(()=>{
    
    if(id!= null){
        userRepository.getRawNotifications(UserId).then((notifs)=>{
            console.log(notifs)
            setNotifications(notifs)

            const d = setter(notifs).then((res)=>{
                console.log('reszzy banche is: ',res)
                setMyData(res)
            })
            
          
            
        })
    }else{
        console.log("user is null")
        setError(true)
    }

  }, [])

function setter(notifs) {
    const myData = notifs.map(async ({ event, message }) => {
      const item = {};
      const { newFollowerEvent } = event;
      try {
        // Wait for the getUserProfileInfo promise to resolve
        const res = await getUserProfileInfo(newFollowerEvent.followerId);
        console.log("res is: ", res)
        // Update the item properties inside the async block
        item.author = res.name;
        item.avatar = res.imageURL;
        item.message = `${res.name} followed you!`;
        item.name = `New Follower!`
        item.id = res.id;
      } catch (error) {
        console.error('Error fetching user profile info:', error);
      }
      // Now, the item object will have the updated properties
      return item;
    });
    
    // Wait for all the promises to resolve before returning the result
    return Promise.all(myData);
  }
  

  const data = [
    { id: 1, name: 'Brunch this weekend?', avatar: '/static/images/avatar/1.jpg', author: 'Ali Connors', message: "I'll be in your neighborhood doing errands this…" },
    { id: 2, name: 'Summer BBQ', avatar: '/static/images/avatar/2.jpg', author: 'Travis Howard', message: "Wish I could come, but I'm out of town this…" },
    { id: 3, name: 'Oui Oui', avatar: '/static/images/avatar/3.jpg', author: 'Sandra Adams', message: 'Do you have Paris recommendations? Have you ever…' },
    // Add more data as needed
  ];

  console.log("mydata is: ", myData)

  return (
    <div >
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {myData.map((item) => (
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
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {item.author}
                      </Typography>
                      {` ${item.message}`}
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>


        <SearchComponent />

    
    </div>
  );
}

