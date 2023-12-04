import "./App.css";
import Navbar from "./js/react/Navbar.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashboardCom from "./js/react/DashboardCom.js";
import FlashcardComponent from "./js/react/flashcardCom.js";
import LoginPage from "./js/react/LoginPage";
import SignUpForm from "./js/react/SignUpForm";
import useUser from "./js/react/useUser";
import FlashcardApp from "./js/react/flashcardUICom";
import PasswordReset from "./js/react/PasswordReset";
import UserProfile from "./js/react/UserProfilePage";
import FriendsPage from "./js/react/FriendsPage";
import MainQuizPage from "./js/react/MainQuizPage";
import Quiz from "./js/react/Quiz.js";
import MySets from "./js/react/MySets.js";
import FlashcardShare from "./js/react/flashcardShare";

import React, { useEffect, useState } from "react";
import Lottie from "react-lottie-player";
import UpcomingEvents from "./js/react/UpcomingEvents.js";
import { checkUpcomingEvents } from "./js/react/useNotificationCount.js";

function App() {
  const [lottieAnimation, setLottieAnimation] = useState(null);

  useEffect(() => {
    fetch(
      "https://lottie.host/59e288fc-b4d7-4027-a1ed-cd428b77054d/QG5mWA6bIU.json"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Animation data:", data);
        setLottieAnimation(data);
      });

    const intervalId = setInterval(() => {
      checkUpcomingEvents();
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const { user } = useUser();

  const handleLogin = () => { };

  const navbarItemsLoggedOut = [
    { label: "Log in", link: "/login", action: handleLogin },
    { label: "Sign Up", link: "/signup" },
  ];

  const navbarItemsLoggedIn = [
    { label: "Dashboard", link: `/dashboard/${user && user.uid}` },
    { label: "Study Tool", link: "/flashcard" },
    { label: "My Sets", link: `/mysets/${user && user.uid}` },
    { label: "Socials", link: `/socials/${user && user.uid}` },
    { label: "Profile", link: `/profile/${user && user.uid}` },
    { label: "Events", link: `/events/${user && user.uid}` },
    //... add other items
  ];

  return (
    <div className="app">
      <Navbar items={user ? navbarItemsLoggedIn : navbarItemsLoggedOut} />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/flashcard" element={<FlashcardComponent />} />
        <Route path="/quizFlash/:setId/quiz/:quizId" element={<Quiz />} />
        <Route path="/quizmain/:setId" element={<MainQuizPage />} />
        <Route path="/flashcard-ui/:setId" element={<FlashcardApp />} />
        <Route
          path="/"
          element={
            user ? (
              <DashboardCom />
            ) : (
              <div className="welcome-container">
                <div id="welcome-animation" className="welcome-animation" style={containerStyle}>
                  <Lottie
                    loop
                    animationData={lottieAnimation}
                    play
                    speed={1}
                    onComplete={() => console.log("Animation completed")}
                    style={{ width: 300, height: 300 }}
                  />

                </div>
                <div className="welcome-message">
                  <h1>Unlock Knowledge with AI</h1>
                  <p>Discover a new way of learning with AI-generated flashcards and quizzes. Dive into an interactive learning experience tailored just for you.</p>
                  <p>Log in or sign up to start your personalized educational journey today.</p>
                </div>
              </div>


            )
          }
        />
        <Route path="/passwordreset" element={<PasswordReset />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/profile/:UserId" element={<UserProfile />} />
        <Route path="/quizmain" element={<MainQuizPage />} />
        <Route path="/socials/:UserId" element={<FriendsPage />} />
        <Route path="/quizmain/:setId" element={<MainQuizPage />} />
        <Route path="/mysets/:UserId" element={<MySets />} />
        <Route path="/events/:UserId" element={<UpcomingEvents />} />
        <Route path="/dashboard/:UserId" element={<DashboardCom />} />
        <Route
          path="/flashcardshare/:flashcardId"
          element={<FlashcardShare />}
          component={FlashcardShare}
        />
      </Routes>
    </div>
  );
}

export default App;
