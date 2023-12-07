import Event from "../models/event";
import { EVENT_TYPE } from "../models/event";
import {
  setDoc,
  doc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import {
  getAllItems,
  getItemById,
  removeDocumentFromCollection,
  updateNonArrayDocumentFields,
} from "../utils/sharedRepositoryFunctions";
const { v4: uuidv4 } = require("uuid");
/**
 * @class EventRepository
 * @classdesc EventRepository - Manages event-related data interactions with the database.
 * 
 * @param {Object} database - The database connection used for accessing event data.
 */
export class EventRepository {
  constructor(database) {
    this.database = database;
  }

  /** Create new follwer event */
  /**
   * @memberof EventRepository
   * @function createNewFollowerEvent
   * @description Creates a new follower event in the database.
   * @param {string} followerId - The ID of the follower.
   * @param {string} followingId - The ID of the user being followed.
   * @returns {Promise<string>} The ID of the created event.
   */
  async createNewFollowerEvent(followerId, followingId) {
    const event = new Event(
      `${followerId} followed ${followingId}`,
      EVENT_TYPE.NEW_FOLLOWER,
      uuidv4()
    );
    event.createNewFollowerEvent(followerId, followingId);
    return await this.createEvent(event, EVENT_TYPE.NEW_FOLLOWER);
  }

  /** Create share quiz event */
  /**
   * @memberof EventRepository
   * @function createShareQuizEvent
   * @description Creates a share quiz event in the database.
   * @param {string} sharedBy - The ID of the user sharing the quiz.
   * @param {string} sharedWith - The ID of the user the quiz is shared with.
   * @param {string} itemId - The ID of the quiz being shared.
   * @returns {Promise<string>} The ID of the created event.
   */
  async createShareQuizEvent(sharedBy, sharedWith, itemId) {
    const event = new Event(
      `${sharedBy} shared quiz with ${sharedWith}`,
      EVENT_TYPE.SHARE_QUIZ,
      uuidv4()
    );
    event.createShareQuizEvent(sharedBy, sharedWith, itemId);
    return await this.createEvent(event, EVENT_TYPE.SHARE_QUIZ);
  }

  /** Create share flashcard event */
  /**
   * @memberof EventRepository
   * @function createShareFlashcardEvent
   * @description Creates a share flashcard event in the database.
   * @param {string} sharedBy - The ID of the user sharing the flashcard.
   * @param {string} sharedWith - The ID of the user the flashcard is shared with.
   * @param {string} itemId - The ID of the flashcard being shared.
   * @returns {Promise<string>} The ID of the created event.
   */
  async createShareFlashcardEvent(sharedBy, sharedWith, itemId) {
    const event = new Event(
      `${sharedBy} shared flashcard with ${sharedWith}`,
      EVENT_TYPE.SHARE_FLASHCARD,
      uuidv4()
    );
    event.createShareFlashcardEvent(sharedBy, sharedWith, itemId);
    return await this.createEvent(event, EVENT_TYPE.SHARE_FLASHCARD);
  }

  /**Helper function to create event */
  async createEvent(event, eventType) {
    try {
      const eventsRef = doc(this.database, "events", event.id);
      await setDoc(eventsRef, event.toJSON());
      return event.id;
    } catch (error) {
      console.log(`error adding ${eventType} event: ${error}`);
    }
  }
  /**
     * @memberof EventRepository
     * @function getAllEvents
     * @description Retrieves all events from the database.
     * @returns {Promise<Object[]>} An array of event objects.
     */
  async getAllEvents() {
    return await getAllItems(this.database, "events", null);
  }
  /**
     * @memberof EventRepository
     * @function getEventById
     * @description Retrieves a specific event by its ID.
     * @param {string} id - The ID of the event to retrieve.
     * @returns {Promise<Object>} The event object.
     */
  async getEventById(id) {
    return await getItemById(this.database, id, "events", "event");
  }

  /**Upcoming Events */
  /**
   * @memberof EventRepository
   * @function getAllUpcomingEvents
   * @description Retrieves all upcoming events from the database.
   * @returns {Promise<Object[]>} An array of upcoming event objects.
   */
  async getAllUpcomingEvents() {
    const collectionRef = collection(this.database, "upcomingEvents");
    try {
      const querySnapshot = await getDocs(collectionRef);
      const documents = querySnapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      return documents;
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  }
  /**
     * @memberof EventRepository
     * @function createUpcomingEvent
     * @description Creates a new upcoming event in the database.
     * @param {Object} upcomingEvent - The upcoming event object to create.
     * @returns {Promise<string>} The ID of the created upcoming event.
     */
  async createUpcomingEvent(upcomingEvent) {
    try {
      const eventsCollectionRef = collection(this.database, "upcomingEvents");
      const docRef = await addDoc(eventsCollectionRef, upcomingEvent.toJSON());
      return docRef.id;
    } catch (error) {
      console.log(`error adding event: ${error}`);
      throw error;
    }
  }
  /**
    * @memberof EventRepository
    * @function getUpcomingEventById
    * @description Retrieves a specific upcoming event by its ID.
    * @param {string} upcomingEventId - The ID of the upcoming event to retrieve.
    * @returns {Promise<Object>} The upcoming event object.
    */
  async getUpcomingEventById(upcomingEventId) {
    return await getItemById(
      this.database,
      upcomingEventId,
      "upcomingEvents",
      "upcoming event"
    );
  }
  /**
     * @memberof EventRepository
     * @function deleteUpcomingEvent
     * @description Deletes a specific upcoming event from the database.
     * @param {string} upcomingEventId - The ID of the upcoming event to delete.
     */
  async deleteUpcomingEvent(upcomingEventId) {
    await removeDocumentFromCollection(
      this.database,
      upcomingEventId,
      "upcomingEvents",
      "upcoming event"
    );
    console.log("event deleted successfully");
  }

  /**Pass in an updated object to update */
  /**
   * @memberof EventRepository
   * @function updateUpcomingEvent
   * @description Updates specific fields of an upcoming event in the database.
   * @param {string} upcomingEventId - The ID of the upcoming event to update.
   * @param {Object} updatedUpcomingEvent - The updated fields of the upcoming event.
   */
  async updateUpcomingEvent(upcomingEventId, updatedUpcomingEvent) {
    await updateNonArrayDocumentFields(
      this.database,
      upcomingEventId,
      "upcomingEvents",
      updatedUpcomingEvent
    );
    console.log("event updated to : ", updatedUpcomingEvent);
  }
  /**
   * @memberof EventRepository
   * @function updateUpcomingEventDate
   * @description Updates the date of a specific upcoming event in the database.
   * @param {string} upcomingEventId - The ID of the upcoming event to update.
   * @param {Date} newDate - The new date to set for the event.
   */
  async updateUpcomingEventDate(upcomingEventId, newDate) {
    await this.updateUpcomingEvent(upcomingEventId, { date: newDate });
  }
  /**
 * @memberof EventRepository
 * @function updateUpcomingEventTime
 * @description Updates the time of a specific upcoming event in the database.
 * @param {string} upcomingEventId - The ID of the upcoming event to update.
 * @param {string} newTime - The new time to set for the event.
 */
  async updateUpcomingEventTime(upcomingEventId, newTime) {
    await this.updateUpcomingEvent(upcomingEventId, { date: newTime });
  }
  /**
   * @memberof EventRepository
   * @function updateUpcomingEventName
   * @description Updates the name of a specific upcoming event in the database.
   * @param {string} upcomingEventId - The ID of the upcoming event to update.
   * @param {string} newName - The new name to set for the event.
   */
  async updateUpcomingEventName(upcomingEventId, newName) {
    await this.updateUpcomingEvent(upcomingEventId, { dateTime: newName });
  }
  /**
   * @memberof EventRepository
   * @function markUpcomingEventAsNotified
   * @description Marks a specific upcoming event as having been notified in the database.
   * @param {string} upcomingEventId - The ID of the upcoming event to mark as notified.
   */
  async markUpcomingEventAsNotified(upcomingEventId) {
    const ref = doc(this.database, "upcomingEvents", upcomingEventId);

    await updateDoc(ref, {
      notified: true,
    });

    return true;
  }
}
