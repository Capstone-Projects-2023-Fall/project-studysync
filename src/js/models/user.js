import UserProfile from './userProfile.js';

/**
 * Represents a user object.
 */
export  default class User {
    constructor(email = '', username='', firstName='', lastName='', uuid='') {
        this.id = uuid
        this.username = username;
        this.firstName = firstName
        this.lastName = lastName
        this.email = email;
        this.name = ''
        this.phone = ''
        this.profession = ''
        this.bio = 'default bio'
        this.following = []
        this.followers = []
        this.imageUrl = 'default.jpg'
        this.ownedQuizzes = []
        this.sharedQuizzes = []
        this.ownedFlashcards = []
        this.sharedFlashcards = []
        this.notifications = []
        this.events = []
        this.profile = new UserProfile();
    }

    toJSON(){
        const user = this      
        return {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: this.firstName,
        lastName: this.lastName,
        bio: user.bio,
        following: user.following,
        followers: user.followers,
        imageUrl: user.imageUrl,
        ownedQuizzes: user.ownedQuizzes,
        sharedQuizzes: user.sharedQuizzes,
        ownedFlashcards : user.sharedFlashcards,
        sharedFlashcards : user.sharedFlashcards,
        notifications: user.notifications,
        events: user.events
      };
    }
}
