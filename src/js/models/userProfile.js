/**
 * Represents a user's profile with associated details such as name, bio, and profile image URL.
 */
export class UserProfile {
    /**
     * Creates a new UserProfile instance.
     * 
     * @param {String} name - The name of the user.
     * @param {String} bio - A brief biography or description of the user.
     * @param {String} profileImageURL - The URL pointing to the user's profile image.
     */
    constructor(name, bio, profileImageURL) {
        this.name = name;
        this.bio = bio;
        this.profileImageURL = profileImageURL;
    }

    /**
     * Allows the user to update their profile details.
     */
    updateProfile() {
        // Logic to update the user's profile details
        console.log('Profile updated successfully.');
    }
}
