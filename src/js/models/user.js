import {UserProfile} from './userProfile.js';
import {Flashcard} from './flashcard.js';
import {Quiz} from './quiz.js';
import { UsbTwoTone } from '@mui/icons-material';


/**
 * Represents a user with functionalities such as login, logout, creating flashcards, and managing friends.
 */
export class User {
    /**
     * Creates a new user.
     * 
     * @param {string} email - User's email address.
     * @param {string} password - User's password.
     */
    constructor(email = '', password = '') {
        this.email = email;
        this.password = password;
        this.flashcards = [];
        this.quizzes = [];
        this.friends = [];
        this.followers = []
        this.following = []
        this.profile = new UserProfile();
        this.notifications = [];
        this.events = []
        this.isLoggedIn = false;
    }

    /**
     * Logs the user in.
     */
    login() {
        // Actual login logic
        this.isLoggedIn = true;
        console.log('User logged in');
      }

    /**
     * Logs the user out.
     */
    logout() {
        // Logout logic
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
