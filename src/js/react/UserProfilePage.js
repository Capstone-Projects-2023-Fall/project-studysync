import './UserProfileStyle.css';


const  UserProfile = ()=> {

  //Replace this with real friends list
  const friends = ["Bob","Joe","Alice","John"];

  return (
    <div className="UserProfilePage">
        <div className='UserHeader'>
          <div className='UserPicture'>Picture</div>
          <div className='UserName'>Name</div>
          <div className='UserDescription'>Hello I am ......</div>
        </div>
        <div className='UserSettings'>Settings</div>
        <div className='UserFriendList'>Friends: 
          <ul>
            {friends.map((friend,index)=> 
            <li key={index}>{friend}</li>)
            }

          </ul>
        </div>
    </div>
  );
}

export default UserProfile;