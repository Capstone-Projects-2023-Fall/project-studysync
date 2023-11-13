export const EVENT_TYPE = {
  SHARE_QUIZ: "SHARE QUIZ",
  NEW_FOLLOWER: "NEW FOLLOWER",
  UPCOMING_QUIZ: "UPCOMING_QUIZ",
  SHARE_FLASHCARD: "SHARED_FLASHCARD",
};

export default class Event {
  constructor(name, eventType, id) {
    this.createdAt = new Date().getTime();
    this.name = name;
    this.eventType = eventType;
    this.id = id;

    switch (EVENT_TYPE) {
      case EVENT_TYPE.NEW_FOLLOWER:
        this.newFollowerEvent = null;
        break;
      case EVENT_TYPE.SHARE_QUIZ:
        this.shareQuizEvent = null;
        break;
      case EVENT_TYPE.SHARE_FLASHCARD:
        this.shareFlashcardEvent = null;
        break;
    }
  }

  //This can only be called when the event is a new follower event
  createNewFollowerEvent(follwerId, followingId) {
    this.newFollowerEvent = new NewFollowerEvent(
      follwerId,
      followingId
    ).toJSON();
    return this.newFollowerEvent;
  }

  //This can only be called when the event is a share quiz event
  createShareQuizEvent(sharedBy, sharedWith) {
    this.shareQuizEvent = new ShareEvent(sharedBy, sharedWith).toJSON();
    return this.shareQuizEvent;
  }

  //This can only be called when the event is a share flashcard event
  createShareFlashcardEvent(sharedBy, sharedWith) {
    this.shareQuizEvent = new ShareEvent(sharedBy, sharedWith).toJSON();
    return this.shareFlashcardEvent;
  }

  toJSON() {
    const jsonOutput = {
      createdAt: this.createdAt,
      name: this.name,
      eventType: this.eventType,
      id: this.id,
    };

    //only add one of these fields when they are the event type being used
    switch (this.eventType) {
      case EVENT_TYPE.NEW_FOLLOWER:
        jsonOutput.newFollowerEvent = this.newFollowerEvent;
        break;
      case EVENT_TYPE.SHARE_QUIZ:
        jsonOutput.shareQuizEvent = this.shareQuizEvent;
        break;
      case EVENT_TYPE.SHARE_FLASHCARD:
        jsonOutput.shareFlashcardEvent = this.shareFlashcardEvent;
        break;
    }
    return jsonOutput;
  }
}

export class NewFollowerEvent {
  constructor(followerId, followingId) {
    this.followerId = followerId;
    this.followingId = followingId;
  }

  toJSON() {
    return {
      followerId: this.followerId,
      followingId: this.followingId,
    };
  }
}

export class ShareEvent {
  constructor(sharedBy, sharedWith) {
    this.shared = sharedBy;
    this.sharedWith = sharedWith;
  }

  toJSON() {
    return {
      sharedBy: this.sharedBy,
      sharedWith: this.sharedWith,
    };
  }
}
