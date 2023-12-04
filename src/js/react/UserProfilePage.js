import React, { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MainFeaturedPost from './ProfileComponents/MainFeaturePost';
import FeaturedPost from './ProfileComponents/FeaturedPost';
import Main from './ProfileComponents/Main';
import Sidebar from './ProfileComponents/Sidebar';
import Footer from './ProfileComponents/Footer';
import { userRepository } from '../../firebase';
import { useParams } from 'react-router-dom';

const defaultTheme = createTheme();

export default function UserProfile() {
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { UserId } = useParams();
  const [friends, setFriends] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    userRepository.getProfile(UserId).then((fetchedProfile) => {
      setProfile(fetchedProfile || {});
      setIsLoading(false);
    }).catch((error) => {
      setError(error);
      setIsLoading(false);
    });

    userRepository.getFriends(UserId).then((fetchedFriends) => {
      setFriends(fetchedFriends);
    }).catch((e) => {
      setError(e);
    });

    userRepository.getFollowing(UserId).then((fetchedFollowing) => {
      setFollowing(fetchedFollowing);
    }).catch((e) => {
      setError(e);
    });

    userRepository.getFollowers(UserId).then((fetchedFollowers) => {
      setFollowers(fetchedFollowers);
    }).catch((e) => {
      setError(e);
    });

    setEdit(false);
  }, [UserId]);

  if (isLoading) {
    return <div className="container emp-profile"><h2>LOADING PROFILE...</h2></div>;
  }

  if (error) {
    return <div className="container emp-profile"><h2>ERROR LOADING PROFILE...</h2></div>;
  }

  const mainFeaturedPostProps = {
    title: 'Title of a longer featured blog post',
    description: "Multiple lines of text that form the lede, informing new readers quickly and efficiently about what's most interesting in this post's contents.",
    image: 'https://source.unsplash.com/random?wallpapers',
    imageText: 'main image description',
    linkText: 'View flashcards',
    date: new Date().toLocaleDateString(), // Add a default date or fetch from profile
    ...profile
  };

  const featuredPostsProps = [
    {
      title: 'FlashCards',
      description: `Check out ${profile.name || 'user'} flash cards`,
      image: 'https://source.unsplash.com/random?wallpapers',
      imageLabel: 'Image Text',
      date: new Date().toLocaleDateString(), // Add a default date
    }
  ];

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
          <MainFeaturedPost post={mainFeaturedPostProps} edit={edit} setEdit={setEdit} />
          <Grid container spacing={4}>
            {featuredPostsProps.map((post, index) => (
              <FeaturedPost key={index} post={post} UserId={UserId} />
            ))}
          </Grid>
          <Grid container spacing={5} sx={{ mt: 3 }}>
            <Main title="About" edit={edit} setEdit={setEdit} userDescription={userDescription} />
            <Sidebar
              title="About"
              description={profile.bio || 'No bio available'}
              archives={[]}
              social={[{ name: 'GitHub', icon: GitHubIcon }, { name: 'Twitter', icon: TwitterIcon }, { name: 'Facebook', icon: FacebookIcon }]}
              imageURL={profile.imageURL || 'defaultImageURL'}
              friends={friends}
              followers={followers}
              following={following}
              bio={profile.bio}
              phone={profile.phone}
              email={profile.email}
            />
          </Grid>
        </main>
      </Container>
      <Footer title="" description="" />
    </ThemeProvider>
  );
}
