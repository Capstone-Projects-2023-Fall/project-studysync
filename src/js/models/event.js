import User from './user.js';
import Dashboard from './dashboard.js';

/**
 * Represents an event, capturing essential details like date and title.
 * can also edit event deatailEvent
 
 */
export class Event extends Dashboard {
    /**
     * Creates a new Event instance.
     * 
     * @param {Date} date - The date of the event.
     * @param {string} title - The title of the event.
     */
    
    constructor(date, title) {
        this.date = date;
        this.title = title;
    }

    /**
     * Allows for editing the details of the event.
     */
    editEvent() {
        // Logic to edit the event's details
        console.log('Event details editing interface activated');
    }
}
