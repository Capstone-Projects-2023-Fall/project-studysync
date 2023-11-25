import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';
import { userRepository } from '../../../firebase';
import {useEffect,useState} from 'react';
import useUser from '../useUser';
function preventDefault(event) {
  event.preventDefault();
}

export default function Friends(props) {
    
    const {user} = useUser();
    const {userId,setUserId} = useState('');
    const {friends,setFriends} = useState([]);
    const {followers,setFollowers} = useState([]);
    const {setIsLoading, setError} = props;

    useEffect(()=>{
        if(user){
            setUserId(user.uid);
        }
        setIsLoading(true);
        userRepository.getFollowers(userId).then((friends)=>{
          setFriends(friends);
          setIsLoading(false);
        }).catch((e)=>{
          setError(e);
          setIsLoading(false);
        })
    },[])

  return (
    <React.Fragment>
      <Title>Recent Deposits</Title>
      <Typography component="p" variant="h4">
        $3,024.00
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        on 15 March, 2019
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          View balance
        </Link>
      </div>
    </React.Fragment>
  );
}