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
import QuizList from "./js/react/quizCom";
import UserProfile from "./js/react/UserProfilePage";
import EditUserProfile from "./js/react/EditUserProfile";
import FriendsPage from "./js/react/FriendsPage";
import MainQuizPage from "./js/react/MainQuizPage";



import Quiz from "./js/react/Quiz.js";
import Notification from "./js/react/Notification";


function App() {
  const { user } = useUser();

  const handleLogin = () => {};

  const navbarItemsLoggedOut = [
    { label: "Log in", link: "/login", action: handleLogin },
    { label: "Sign Up", link: "/signup" },
  ];

  const navbarItemsLoggedIn = [
    { label: "Dashboard", link: "/dashboard" },
    { label: "Flashcard", link: "/flashcard" },
    { label: "Quiz", link: "/quizmain" },
    { label: "Message", icon: "message-icon", link: "/messages" },
    { label: "Profile", link: `/profile/${user && user.uid}` },
    { label: "Friends", link: `/friends/${user && user.uid}` },
    //... add other items
  ];

  return (
    <div className="app">

      <Navbar items={user ? navbarItemsLoggedIn : navbarItemsLoggedOut} />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/flashcard" element={<FlashcardComponent />} />
        <Route path="/quiz/:setId" element={<Quiz />} />
        <Route path="/flashcard-ui/:setId" element={<FlashcardApp />} />
        <Route
          path="/"
          element={
            user ? (
              <DashboardCom />
            ) : (
              <div className="login-center">
                Please log in or sign up to continue
              </div>
            )
          }
        />
        <Route path="/passwordreset" element={<PasswordReset />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/profile/:UserId" element={<UserProfile />} />
        <Route path="/profile/:data/edit" element={<EditUserProfile />} />
        <Route path="/quizmain" element={<MainQuizPage />} />
        <Route path="/friends/:UserId" element={<FriendsPage />} />
      </Routes>
    </div>
  );
}

export default App;
