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

function App() {
    const { user } = useUser();

    const handleLogin = () => {};

    const navbarItemsLoggedOut = [
        { label: "Log in", link: "/login", action: handleLogin },
        { label: "Sign Up", link: "/signup" },
    ];

    const navbarItemsLoggedIn = [
        { label: "Dashboard", link: "/" },
        { label: "Flashcard", link: "/flashcard" },
        { label: "Profile", link: `/profile/${user && user.uid}` },
        { label: "Socials", link: `/socials/${user && user.uid}` },
        { label: "My Sets", link: `/mysets/${user && user.uid}` },
        //... add other items
    
    ];

    return (
        <div className="app">
            <Navbar items={user ? navbarItemsLoggedIn : navbarItemsLoggedOut} />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/flashcard" element={<FlashcardComponent />} />
                <Route
                    path="/quizFlash/:setId/quiz/:quizId"
                    element={<Quiz />}
                />
                <Route path="/quizmain/:setId" element={<MainQuizPage />} />
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
                <Route path="/quizmain" element={<MainQuizPage />} />
                <Route path="/socials/:UserId" element={<FriendsPage />} />
                <Route path="/quizmain/:setId" element={<MainQuizPage />} />
                <Route path="/mysets/:UserId" element={<MySets />} />
            </Routes>
        </div>
    );
}

export default App;
