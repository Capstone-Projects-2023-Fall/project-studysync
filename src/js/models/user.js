import UserProfile from './userProfile.js';

/**
 * Represents a user object.
 */
export  default class User {
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
    }
}
