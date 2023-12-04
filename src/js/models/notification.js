/**Notification Object */
export class Notification {
  constructor(eventId, isUpcomingEvent = false, upcomingEvent = null, id = "") {
    this.eventId = eventId;
    this.createdAt = new Date().getTime();
    this.id = id;
    this.isUpcomingEvent = isUpcomingEvent;
    this.upcomingEvent = upcomingEvent;
  }

  toJSON() {
    return {
      eventId: this.eventId,
      createdAt: this.createdAt,
      id: this.id,
      isUpcomingEvent: this.isUpcomingEvent,
      upcomingEvent: this.upcomingEvent,
    };
  }
}
