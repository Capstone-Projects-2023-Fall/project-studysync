/**
 * Represents a notification that can be of various types, e.g., friend request, flashcard reminder.
 */
export default class Notification {
    /**
     * Creates a new notification.
     * 
     * @param {string} message - The message or content of the notification.
     * @param {int} type - The type of the notification.
     */
    constructor(message = '', type = 0) {
        this.message = message;
        this.type = type;
    }

    /**
     * Displays the notification.
     */
    display() {
        console.log(`[${this.type}] ${this.message}`);
    }
}

