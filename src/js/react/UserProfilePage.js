import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from './ProfileComponents/Header';
import MainFeaturedPost from './ProfileComponents/MainFeaturePost';
import FeaturedPost from './ProfileComponents/FeaturedPost';
import Main from './ProfileComponents/Main';
import Sidebar from './ProfileComponents/Sidebar';
import Footer from './ProfileComponents/Footer';
import { userRepository } from '../../firebase';
import { useState ,useEffect} from 'react';
import { useParams } from 'react-router-dom';




const sections = [
    { title: 'Technology', url: '#' },
    { title: 'Design', url: '#' },
    { title: 'Culture', url: '#' },
    { title: 'Business', url: '#' },
    { title: 'Politics', url: '#' },
    { title: 'Opinion', url: '#' },
    { title: 'Science', url: '#' },
    { title: 'Health', url: '#' },
    { title: 'Style', url: '#' },
    { title: 'Travel', url: '#' },
  ];
  
  function mainFeaturedPost(profile){

    return{  
    title: 'Title of a longer featured blog post',
    description:
      "Multiple lines of text that form the lede, informing new readers quickly and efficiently about what's most interesting in this post's contents.",
    image: 'https://source.unsplash.com/random?wallpapers',
    imageText: 'main image description',
    linkText: 'View flashcards',
    Name: profile.name,
    bio: profile.bio,
    imageURL: profile.imageURL,
    profession: profile.profession,
    phone: profile.phone,
    friends: profile.friends,
    email: profile.email,
    id: profile.id,
    cardlink: `/flashcard-ui/${profile.id}`
    }
};
  
  const featuredPosts = [
    {
      title: 'Featured post',
      date: 'Nov 12',
      description:
        'This is a wider card with supporting text below as a natural lead-in to additional content.',
      image: 'https://source.unsplash.com/random?wallpapers',
      imageLabel: 'Image Text',
    },
    {
      title: 'Post title',
      date: 'Nov 11',
      description:
        'This is a wider card with supporting text below as a natural lead-in to additional content.',
      image: 'https://source.unsplash.com/random?wallpapers',
      imageLabel: 'Image Text',
    },
  ];
  
  
  const sidebar = {
    title: 'About',
    description:
      'Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur.',
    archives: [
      { title: 'March 2020', url: '#' },
      { title: 'February 2020', url: '#' },
      { title: 'January 2020', url: '#' },
      { title: 'November 1999', url: '#' },
      { title: 'October 1999', url: '#' },
      { title: 'September 1999', url: '#' },
      { title: 'August 1999', url: '#' },
      { title: 'July 1999', url: '#' },
      { title: 'June 1999', url: '#' },
      { title: 'May 1999', url: '#' },
      { title: 'April 1999', url: '#' },
    ],
    social: [
      { name: 'GitHub', icon: GitHubIcon },
      { name: 'Twitter', icon: TwitterIcon },
      { name: 'Facebook', icon: FacebookIcon },
    ],
  };
  
  // TODO remove, this demo shouldn't need to reset the theme.
  const defaultTheme = createTheme();
  
  export default function UserProfile() {

    const [profile,setProfile] = useState({});
    const [isLoading,setIsLoading] = useState(false);
    const [error,setError] = useState(null);
    const {UserId} = useParams();

  useEffect(()=>{
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

  const userDescription = {
    bio: profile.bio,
    email: profile.email,
    phone: profile.phone 
  }

    return (
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <Container maxWidth="lg">
          <main>
            <MainFeaturedPost post={mainFeaturedPost(profile)} />
            <Grid container spacing={4}>
              {featuredPosts.map((post) => (
                <FeaturedPost key={post.title} post={post} />
              ))}
            </Grid>
            <Grid container spacing={5} sx={{ mt: 3 }}>
              <Main title="About" userDescription={userDescription} />
              <Sidebar
                title={sidebar.title}
                description={profile.bio}
                archives={sidebar.archives}
                social={sidebar.social}
                imageURL={profile.imageURL != '' ? profile.imageURL : 'https://source.unsplash.com/random?wallpapers'}
              />
            </Grid>
          </main>
        </Container>
        <Footer
          title="Footer"
          description="Something here to give the footer a purpose!"
        />
      </ThemeProvider>
    );
  }






















// import { useNavigate, useParams } from 'react-router-dom';
// import './UserProfileStyle.css';
// import useUser from './useUser';
// import UserProfileComponent from './UserProfileComponent';
// import { userRepository } from '../../firebase';
// import { useEffect, useState } from 'react';

// const  UserProfile = ()=> {
//   //Replace this with real friends list
//   const friends = ["Bob","Joe","Alice","John"];

//   const [profile, setProfile] = useState({})
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState(null)

//   const {UserId } = useParams();
//   const {user} = useUser();
//   const navigate = useNavigate();

//   const dataToSend = {
//     UserId: UserId, 
//     userProfile: profile
//   }
//     const serializedData = JSON.stringify(dataToSend);
//     const encodedData = encodeURIComponent(serializedData);

//   function editProfile(e){
//     e.preventDefault();
//     navigate(`/profile/${encodedData}/edit`, );
//   }

//   useEffect(()=>{
//     //while awaiting database response, display some loading indication
//     setIsLoading(true)
//     //fetch and set user profile upon page load
//     userRepository.getProfile(UserId).then((profile)=>{
//         console.log("printing profile")
//         console.log(profile)
//         setProfile(profile)
//         setIsLoading(false)
//     }).catch((error)=>{
//         //handle the error in the ui
//         setError(error)
//         setIsLoading(false)
//         console.log(error)
//     })
//   }, [])

//   if(isLoading){
//     return (
//         <>
//             <head>
//                 <link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css"/>
//                 <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
//                 <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>      
//             </head>
//             <div class="container emp-profile">
//                 <h2>LOADING PROFILE...</h2>
//             </div>
            
//         </>
//     )
//   }

//   if(error){
//     return(
//         <>
//             <head>
//                 <link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css"/>
//                 <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
//                 <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>      
//             </head>
//             <div class="container emp-profile">
//                 <h2>ERROR LOADING PROFILE...</h2>
//             </div>
            
//         </>
//     )
//   }


//   return (
    
//     <>
//     <head>
//       <link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css"/>
//       <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
//       <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>      
//     </head>
//       <div class="container emp-profile">
//             <form >
//                 <div class="row">
//                     <div class="col-md-4">
//                         <div class="profile-img">
//                             {profile.imageURL && (<img src={profile.imageURL} alt="" />)}

//                             {!profile.imageURL && (
//                             <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS52y5aInsxSm31CvHOFHWujqUx_wWTS9iM6s7BAm21oEN_RiGoog" alt="" />
//                             )}

//                         </div>
//                     </div>
//                     <div class="col-md-6">
//                         <div class="profile-head">
//                                     <h5>
//                                         {profile.name} 
//                                     </h5>
//                                     <h6>
//                                     {profile.profession}
//                                     </h6>
//                                     <p class="proile-rating">About me : <span>
//                                     {profile.bio}
//                                       </span></p>

//                             <ul class="nav nav-tabs" id="myTab" role="tablist">
//                                 <li class="nav-item">
//                                     <div class="nav-link active" id="home-tab" data-toggle="tab"  role="tab" aria-controls="home" aria-selected="true">Info</div>
//                                 </li>
//                                 <li class="nav-item">
//                                 </li>
//                             </ul>
//                         </div>
//                     </div>
//                     <div class="col-md-2">
//                       { ( user && user.uid == UserId )   &&
//                         <button  onClick={editProfile} class="profile-edit-btn" name="btnAddMore" >Edit profile</button>
//                       }
//                         </div>
//                 </div>
//                 <div class="row">
//                     <div class="col-md-4">
//                       <div class="profile-work">
//                         <p>Friends:</p>
//                         <ul>
//                           {friends.map((friend, index) => (
//                             <li key={index}><a href='#'>{friend}</a></li>
//                           ))}
//                         </ul>
//                         <a href='#' id='flashcards'>FlashCards</a>
//                         <p><a href='#' id='quizzes'>Quizzes</a></p>
//                       </div>
//                     </div>
//                     <div class="col-md-8">
//                         <div class="tab-content profile-tab" id="myTabContent">
//                             <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
//                                         <div class="row">
//                                         </div>
//                                         <div class="row">
//                                             <div class="col-md-6">
//                                                 <label>Name:</label>
//                                             </div>
//                                             <div class="col-md-6">
//                                                 <p>{profile.name}</p>
//                                             </div>
//                                         </div>
//                                         <div class="row">
//                                             <div class="col-md-6">
//                                                 <label>Email:</label>
//                                             </div>
//                                             <div class="col-md-6">
//                                                 <p>{profile.email}</p>
//                                             </div>
//                                         </div>
//                                         <div class="row">
//                                             <div class="col-md-6">
//                                                 <label>Phone:</label>
//                                             </div>
//                                             <div class="col-md-6">
//                                                 <p>{profile.phone}</p>
//                                             </div>
//                                         </div>
//                                         <div class="row">
//                                             <div class="col-md-6">
//                                                 <label>Profession:</label>
//                                             </div>
//                                             <div class="col-md-6">
//                                                 <p>{profile.profession}</p>
//                                             </div>
//                                         </div>
//                             </div>
//                             <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
//                                         <div class="row">
//                                             <div class="col-md-6">
//                                                 <label>Experience</label>
//                                             </div>
//                                             <div class="col-md-6">
//                                                 <p>Expert</p>
//                                             </div>
//                                         </div>
//                                         <div class="row">
//                                             <div class="col-md-6">
//                                                 <label>Hourly Rate</label>
//                                             </div>
//                                             <div class="col-md-6">
//                                                 <p>10$/hr</p>
//                                             </div>
//                                         </div>
//                                         <div class="row">
//                                             <div class="col-md-6">
//                                                 <label>Total Projects</label>
//                                             </div>
//                                             <div class="col-md-6">
//                                                 <p>230</p>
//                                             </div>
//                                         </div>
//                                         <div class="row">
//                                             <div class="col-md-6">
//                                                 <label>English Level</label>
//                                             </div>
//                                             <div class="col-md-6">
//                                                 <p>Expert</p>
//                                             </div>
//                                         </div>
//                                         <div class="row">
//                                             <div class="col-md-6">
//                                                 <label>Availability</label>
//                                             </div>
//                                             <div class="col-md-6">
//                                                 <p>6 months</p>
//                                             </div>
//                                         </div>
//                                 <div class="row">
//                                     <div class="col-md-12">
//                                         <label>Your Bio</label><br/>
//                                         <p>Your detail description</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </form>           
//         </div>
//         </>
//   );
// }



// const UserProfile = ()=>{
//     return(<></>)
// }
// export default UserProfile;