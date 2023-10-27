import { useNavigate,useParams } from 'react-router-dom';
import './UserProfileStyle.css';
import { useState,useEffect } from 'react';
import UserProfileComponent from './UserProfileComponent';
import useUser from './useUser';

const  EditUserProfile = ()=> {

    //Replace this with real friends list from database
    const [friends,setFriends] =  useState(["Bob","Joe","Alice","John"]);
    const {UserId} = useParams();
    const {user} = useUser();
    const navigate = useNavigate();

    function saveProfile(){
        navigate(`/profile/${user && user.uid}`);
    }


   //Delete user from database here 
  function deleteProfile(e){
    var result = prompt("Are you sure you want to delete your account? Type (yes) and click ok.");
    
    
    if(result && result.toLowerCase() == 'yes'){
        alert('Deleted user account.')
    }
    else {
        return;
    }
  }  


  function RemoveFriend(index,friend){

    //replace this with code to remove friend from database  

  }

  if(user  && UserId == user.uid){
    return (
        
        <>
        <head>
        <link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css"/>
        <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>      
        </head>
        <div class="container emp-profile">
                
                    <div class="row">
                        <div class="col-md-4">
                            <div class="profile-img">
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS52y5aInsxSm31CvHOFHWujqUx_wWTS9iM6s7BAm21oEN_RiGoog" alt="user profile picture"/>
                                <div class="file btn btn-lg btn-primary">
                                    Change Photo
                                    <input type="file" name="file"/>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="profile-head">
                                        <h5>
                                            Kshiti Ghelani
                                        </h5>
                                        <h6>
                                            Web Developer and Designer
                                        </h6>
                                        <p class="proile-about"><p>About me :</p> 
                                            <textarea id='ProfileAboutMe' placeholder='Enter description'></textarea>
                                        </p>                                    
                                <ul class="nav nav-tabs" id="myTab" role="tablist">
                                    <li class="nav-item">
                                        <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">About</a>
                                    </li>

                                </ul>
                            </div>
                        </div>
                        <div class="col-md-2"> 
                            <button  onClick={saveProfile} class="profile-save-btn" name="btnAddMore" >Save</button>   
                            <button  onClick={deleteProfile} class="profile-delete-btn" name="btnAddMore" >Delete</button>   

                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                        <div class="profile-friends">
                            <p>Friends:</p>
                            <ul>
                            {friends.map((friend, index) => (
                                <li key={index}>{friend}
                                <button onClick={() => RemoveFriend(index,friend)} className='RemoveFriend'>X</button>
                                </li>
                            ))}
                            </ul>
                        </div>
                        </div>
                        <div class="col-md-8">
                            <div class="tab-content profile-tab" id="myTabContent">
                                <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">

                                            <div class="row">
                                                <div class="col-md-6">
                                                    <label>Name:</label>
                                                </div>
                                                <div class="col-md-6">
                                                    <input id='ProfileName' type='text' placeholder='Name'></input>

                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <label>Email:</label>
                                                </div>
                                                <div class="col-md-6">
                                                    <p>kshitighelani@gmail.com</p>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <label>Phone:</label>
                                                </div>
                                                <div class="col-md-6">
                                                    <input id='ProfilePhoneNum' type='text' placeholder='Phone Number'></input>

                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <label>Profession:</label>
                                                </div>
                                                <div class="col-md-6">
                                                    <input id='ProfileProfession' type='text' placeholder='profession'></input>
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
                    
            </div>
            </>
            );
        }else{
            return(
                <>
                    Error in accessing page
                </>
            )
      }
}

export default EditUserProfile;