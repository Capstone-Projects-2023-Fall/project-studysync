   /**Notification Object */
export class Notification {
    constructor(event, message = '', id='') {
        this.event = event
        this.message = message;
        this.createdAt = new Date().getTime()
        this.id = id
    }

    toJSON() {
        return {
          event: this.event,
          message: this.message,
          createdAt: this.createdAt,
          id: this.id,
        };
      }
}

