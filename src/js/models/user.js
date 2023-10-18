
import { UsbTwoTone } from '@mui/icons-material';
import UserProfile from './userProfile.js';
import Flashcard from './flashcard.js';
import Quiz from './quiz.js';
import Notification from './notification.js';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import { auth } from '../../firebase.js';
import { userRepository, quizRepository } from '../../firebase.js';


/**
 * Represents a user with functionalities such as login, logout, creating flashcards, and managing friends.
 */


export  default class User {


    /**
     * Creates a new user.
     * 
     * @param {string} email - User's email address.
     * @param {string} password - User's password.
     */
    constructor(email = '', username='', id) {
        this.username = username;
        this.email = email;
        this.bio = 'default bio'
        this.following = []
        this.followers = []
        this.friends = []
        this.imageUrl = 'default.jpg'
        this.ownedQuizzes = []
        this.sharedQuizzes = []
        this.ownedFlashcards = []
        this.sharedFlashcards = []
        this.notifications = []
        this.events = []
        this.profile = new UserProfile();
        this.isLoggedIn = false;
    }

    //Sign users up 
    signup(){
        createUserWithEmailAndPassword(auth,this.email,this.password)
            .then((e)=>{
                // userRepository.signUpUser(new User(this.email, this.password));
                alert('Sucessfully signed up!');
            }).catch((error)=>{
                alert(error);
            });         
    }

    /**
     * Logs the user in.
     */
    login() {
 
        if(this.email == '' && this.password == ''){
            return;
        }
            
        signInWithEmailAndPassword(auth,this.email,this.password)
            .then((e)=>{
                //User is logged in 
                this.isLoggedIn = true;                            
                alert('Logged in!');
            }).catch((error)=>{
                alert(error);
            });


      }

    /**
     * Logs the user out.
     */
    logout() {
        signOut(auth).then(()=>{
            this.isLoggedIn = false;
            alert('Signed out Successful!');
        }).catch((error)=>{
            alert(error);
        })
    }

    /**
     * Creates a new flashcard for the user.
     * 
     * @returns {Flashcard} - The newly created flashcard.
     */
    createFlashcard() {

        const flashcard = new Flashcard(this);
        this.flashcards.push(flashcard);
        return flashcard;
    }

    /**
     * Creates a new quiz for the user.
     * 
     * @returns {Quiz} - The newly created quiz.
     */
    createQuiz() {
        const quiz = new Quiz(this);
        this.quizzes.push(quiz);
        return quiz;
    }

    /**
     * Views the profile of a friend.
     * 
     * @param {User} friend - The friend whose profile is to be viewed.
     * @returns {UserProfile} - The profile of the friend.
     */
    viewFriendProfile(friend) {
        return friend.profile;
    }

    /**
     * Adds a new friend to the user's friend list.
     * 
     * @param {User} friend - The new friend to be added.
     */
    addFriend(friend) {
        this.friends.push(friend);
    }

    /**
     * Removes a friend from the user's friend list.
     * 
     * @param {User} friend - The friend to be removed.
     */
    removeFriend(friend) {
        const index = this.friends.indexOf(friend);
        if (index > -1) {
            this.friends.splice(index, 1);
        }
    }
}
