// import Event from './Event';

/**
 * Represents a scheduling system that manages scheduled events.
 */
export  default class SchedulingSystem {
    /**
     * Creates a new SchedulingSystem instance.
     */
    constructor() {
        this.scheduledEvents = []; // List<Event>
        this.eventHistory = [];   // List of removed or past events (assuming it just retains the Event objects)
    }

    /**
     * Schedules a new event based on a given date and title.
     * 
     * @param {Date} date - The date of the event.
     * @param {string} title - The title of the event.
     * @returns {Event} - The newly scheduled event.
     */
    scheduleEvent(date, title) {
        const event = new Event(date, title);
        this.scheduledEvents.push(event);
        console.log(`Event "${title}" scheduled for ${date.toLocaleDateString()}.`);
        return event;
    }

    /**
     * Removes an event from the scheduled events based on its ID.
     * 
     * @param {Integer} eventID - The ID of the event to be removed.
     */
    removeEvent(eventID) {
        const index = this.scheduledEvents.findIndex(event => event.id === eventID);
        if (index > -1) {
            const removedEvent = this.scheduledEvents.splice(index, 1)[0];
            this.eventHistory.push(removedEvent); // Storing removed events in eventHistory
            console.log(`Event "${removedEvent.title}" removed from schedule.`);
        } else {
            console.log(`Event with ID ${eventID} not found.`);
        }
    }

    /**
     * Sends reminders to users about upcoming events.
     */
    remindUser() {
        // Logic to remind users about upcoming events
        console.log('Reminders sent for upcoming events.');
    }
}
