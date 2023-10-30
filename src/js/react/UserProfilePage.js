import { useNavigate, useParams } from 'react-router-dom';
import './UserProfileStyle.css';
import useUser from './useUser';
import UserProfileComponent from './UserProfileComponent';
import { userRepository } from '../../firebase';
import { useEffect, useState } from 'react';

const  UserProfile = ()=> {
  //Replace this with real friends list
  const friends = ["Bob","Joe","Alice","John"];

  const [profile, setProfile] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const {UserId } = useParams();
  const {user} = useUser();
  const navigate = useNavigate();

  const dataToSend = {
    UserId: UserId, 
    userProfile: profile
  }
    const serializedData = JSON.stringify(dataToSend);
    const encodedData = encodeURIComponent(serializedData);

  function editProfile(e){
    e.preventDefault();
    navigate(`/profile/${encodedData}/edit`, );
  }

  useEffect(()=>{
    //while awaiting database response, display some loading indication
    setIsLoading(true)
    //fetch and set user profile upon page load
    userRepository.getProfile(UserId).then((profile)=>{
        console.log("printing profile")
        console.log(profile)
        setProfile(profile)
        setIsLoading(false)
    }).catch((error)=>{
        //handle the error in the ui
        setError(error)
        setIsLoading(false)
        console.log(error)
    })
  }, [])

  if(isLoading){
    return (
        <>
            <head>
                <link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css"/>
                <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
                <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>      
            </head>
            <div class="container emp-profile">
                <h2>LOADING PROFILE...</h2>
            </div>
            
        </>
    )
  }

  if(error){
    return(
        <>
            <head>
                <link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css"/>
                <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
                <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>      
            </head>
            <div class="container emp-profile">
                <h2>ERROR LOADING PROFILE...</h2>
            </div>
            
        </>
    )
  }


  return (
    
    <>
    <head>
      <link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css"/>
      <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
      <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>      
    </head>
      <div class="container emp-profile">
            <form >
                <div class="row">
                    <div class="col-md-4">
                        <div class="profile-img">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS52y5aInsxSm31CvHOFHWujqUx_wWTS9iM6s7BAm21oEN_RiGoog" alt=""/>

                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="profile-head">
                                    <h5>
                                        {profile.name} 
                                    </h5>
                                    <h6>
                                    {profile.profession}
                                    </h6>
                                    <p class="proile-rating">About me : <span>
                                    {profile.bio}
                                      </span></p>

                            <ul class="nav nav-tabs" id="myTab" role="tablist">
                                <li class="nav-item">
                                    <div class="nav-link active" id="home-tab" data-toggle="tab"  role="tab" aria-controls="home" aria-selected="true">Info</div>
                                </li>
                                <li class="nav-item">
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-md-2">
                      { ( user && user.uid == UserId )   &&
                        <button  onClick={editProfile} class="profile-edit-btn" name="btnAddMore" >Edit profile</button>
                      }
                        </div>
                </div>
                <div class="row">
                    <div class="col-md-4">
                      <div class="profile-work">
                        <p>Friends:</p>
                        <ul>
                          {friends.map((friend, index) => (
                            <li key={index}><a href='#'>{friend}</a></li>
                          ))}
                        </ul>
                        <a href='#' id='flashcards'>FlashCards</a>
                        <p><a href='#' id='quizzes'>Quizzes</a></p>
                      </div>
                    </div>
                    <div class="col-md-8">
                        <div class="tab-content profile-tab" id="myTabContent">
                            <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                        <div class="row">
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <label>Name:</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>{profile.name}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <label>Email:</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>{profile.email}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <label>Phone:</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>{profile.phone}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <label>Profession:</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>{profile.profession}</p>
                                            </div>
                                        </div>
                            </div>
                            <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <label>Experience</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>Expert</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <label>Hourly Rate</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>10$/hr</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <label>Total Projects</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>230</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <label>English Level</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>Expert</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <label>Availability</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>6 months</p>
                                            </div>
                                        </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <label>Your Bio</label><br/>
                                        <p>Your detail description</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>           
        </div>
        </>
  );
}

export default UserProfile;