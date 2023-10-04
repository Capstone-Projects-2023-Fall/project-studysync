export default class UserProfile {
    /**
     * @param {string} name 
     * @param {string} bio 
     * @param {string} profileImageURL 
     */
    constructor(name, bio, profileImageURL) {
        this.name = name;
        this.bio = bio;
        this.profileImageURL = profileImageURL;
    }

    updateProfile() {
        // Update profile logic
    }
}
