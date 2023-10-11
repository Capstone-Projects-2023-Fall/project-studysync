import User from './user.js';
import Leaderboard from './leaderboard.js';


/**
 * Represents the social features of a system, allowing users to view friends, 
 * access a leaderboard, and initiate a chat.
 */
export default  class Social {
    /**
    * Creates a new Social instance.
    * 
    * @param {User[]} friends - An array of friends associated with the user.
    * @param {Leaderboard} leaderboard - The leaderboard associated with the user's social features.
    */
    constructor(friends, leaderboard) {
        this.friends = friends || [];       // If friends is not provided, default to empty array
        this.leaderboard = leaderboard || new Leaderboard(); // If leaderboard is not provided, default to a new instance
    }

    /**
     * Views the list of friends associated with a user.
     * 
     * @returns {string} - A string representation of the user's friends list.
     */
    view() {
        const friendNames = this.friends.map(friend => friend.name);
        return `Friends: ${friendNames.join(', ')}`;
    }

    /**
     * Initiates a chat session.
     */
    chat() {
        // Logic to initiate chat
        console.log('Chat session started.');
    }
}
