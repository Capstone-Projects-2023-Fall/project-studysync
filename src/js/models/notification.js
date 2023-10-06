/**
 * Represents a notification that can be of various types, e.g., friend request, flashcard reminder.
 */
export class Notification {
    /**
     * Creates a new notification.
     * 
     * @param {string} message - The message or content of the notification.
     * @param {NotificationType} type - The type of the notification.
     */
    constructor(message = '', type = NotificationType.DEFAULT) {
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

