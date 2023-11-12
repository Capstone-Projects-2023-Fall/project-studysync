   /**Notification Object */
export class Notification {
    constructor(eventId, id='') {
        this.eventId = eventId
        this.createdAt = new Date().getTime()
        this.id = id
    }

    toJSON() {
        return {
          eventId: this.eventId,
          createdAt: this.createdAt,
          id: this.id,
        };
      }
}

