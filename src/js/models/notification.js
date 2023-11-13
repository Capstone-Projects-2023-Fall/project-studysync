/**Notification Object */
export class Notification {
  constructor(eventId, message, id = "") {
    this.eventId = eventId;
    this.createdAt = new Date().getTime();
    this.message = message;
    this.id = id;
  }

  toJSON() {
    return {
      eventId: this.eventId,
      createdAt: this.createdAt,
      id: this.id,
      message: this.message,
    };
  }
}
