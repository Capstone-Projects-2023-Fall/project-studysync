import { setDoc, doc, runTransaction } from "firebase/firestore";
import {
  removeItemFromArrayField,
  updateArrayDocumentFields,
  addItemToArrayField,
  getArrayFieldFromCollection,
  getAllItems,
  getItemById,
  removeDocumentFromCollection,
  updateNonArrayDocumentFields,
} from "../utils/sharedRepositoryFunctions";
import { userConverter } from "../converters/userConverter";
import User from "../models/user";
import { Notification } from "../models/notification";
import { EVENT_TYPE, UpcomingEvent } from "../models/event";

/**
 * Utility class to talk to FireStore User Collection [IN PROGRESS]
 */
export class UserRepository {
  constructor(
    database,
    quizRepository,
    notificationRepository,
    flashcardRepository,
    eventRepository
  ) {
    this.database = database;
    this.quizRepository = quizRepository;
    this.notificationRepository = notificationRepository;
    this.flashcardRepository = flashcardRepository;
    this.eventRepository = eventRepository;
  }

  /**Add a user to the database for the first time with id: uuid*/
  async addUser(email, username, firstName, lastName, uuid) {
    try {
      const userRef = doc(this.database, "users", uuid);
      await setDoc(
        userRef,
        new User(email, username, firstName, lastName, uuid).toJSON()
      );
      console.log("Successfully added user to database", username);
    } catch (error) {
      console.log("error adding user", error);
    }
  }

  /**Given a unique uuid, return the user associated with that uuid */
  async getUserById(id) {
    return await getItemById(this.database, id, "users", "user");
  }

  async deleteUser(id) {
    return await removeDocumentFromCollection(
      this.database,
      id,
      "users",
      "user"
    );
  }

  async updateNonArrayUserFields(id, toUpdate) {
    await updateNonArrayDocumentFields(this.database, id, "users", toUpdate);
  }

  async updateArrayUserFields(id, toUpdate) {
    await updateArrayDocumentFields(this.database, id, "users", toUpdate);
  }

  /**Return all users in the user collection */
  async getAllUsers() {
    return await getAllItems(this.database, "users", userConverter);
  }

  /**Get all owned quizzes owned by user with id: {id} */
  async getOwnedQuizzesIds(id) {
    const ownedQuizzes = await getArrayFieldFromCollection(
      this.database,
      "users",
      id,
      "ownedQuizzes"
    );
    return ownedQuizzes;
  }

  async getOwnedQuizzes(userId) {
    const quizIds = await this.getOwnedQuizzesIds(userId);
    const result = [];
    for (const id of quizIds) {
      const quiz = await this.quizRepository.get_QuizById(id);
      const quizAuthor = await this.getUserById(quiz.authorId);

      quiz.author = {
        name: quizAuthor.name,
        imageURL: quizAuthor.imageURL,
        firstName: quizAuthor.firstName,
        lastName: quizAuthor.lastName,
      };
      result.push(quiz);
    }
    return result;
  }

  /**Get all quizzes shared by user with id: {id} */
  async getSharedQuizzesIds(id) {
    const sharedQuizzes = await getArrayFieldFromCollection(
      this.database,
      "users",
      id,
      "sharedQuizzes"
    );
    return sharedQuizzes;
  }

  async getSharedQuizzes(userId) {
    const quizIds = await this.getSharedQuizzesIds(userId);
    const result = [];
    for (const id of quizIds) {
      const quiz = await this.quizRepository.get_QuizById(id);
      const quizAuthor = await this.getUserById(quiz.authorId);

      quiz.author = {
        name: quizAuthor.name,
        imageURL: quizAuthor.imageURL,
        firstName: quizAuthor.firstName,
        lastName: quizAuthor.lastName,
      };
      result.push(quiz);
    }
    return result;
  }

  /**Get all owned flashcards owned by user with id: {id} */
  async getOwnedFlashcardsIds(id) {
    const ownedFlashcardsIds = await getArrayFieldFromCollection(
      this.database,
      "users",
      id,
      "ownedFlashcards"
    );
    return ownedFlashcardsIds;
  }

  async getOwnedFlashcards(userId) {
    const quizIds = await this.getOwnedFlashcardsIds(userId);
    const result = [];
    for (const id of quizIds) {
      const flashcard = await this.flashcardRepository.getFlashcardSetBy_Id(id);
      const flashcardAuthor = await this.getUserById(flashcard.authorId);
      flashcard.author = {
        name: flashcardAuthor.name,
        imageURL: flashcardAuthor.imageURL,
        firstName: flashcardAuthor.firstName,
        lastName: flashcardAuthor.lastName,
      };
      result.push(flashcard);
    }
    return result;
  }

  /**Get all flashcards shared by user with id: {id} */
  async getSharedFlashcardIds(id) {
    const sharedFlashcardsIds = await getArrayFieldFromCollection(
      this.database,
      "users",
      id,
      "sharedFlashcards"
    );
    return sharedFlashcardsIds;
  }

  async getSharedFlashcards(userId) {
    const quizIds = await this.getSharedFlashcardIds(userId);
    const result = [];
    for (const id of quizIds) {
      const flashcard = await this.flashcardRepository.getFlashcardSetBy_Id(id);

      const flashcardAuthor = await this.getUserById(flashcard.authorId);

      flashcard.author = {
        name: flashcardAuthor.name,
        imageURL: flashcardAuthor.imageURL,
        firstName: flashcardAuthor.firstName,
        lastName: flashcardAuthor.lastName,
      };
      result.push(flashcard);
    }
    return result;
  }

  /**Get all followers of user with id: {id} */
  async getFollowers(id) {
    const followers = await getArrayFieldFromCollection(
      this.database,
      "users",
      id,
      "followers"
    );
    return this.getUsers(followers);
  }

  /**Get all following of user with id: {id} */
  async getFollowing(id) {
    const following = await getArrayFieldFromCollection(
      this.database,
      "users",
      id,
      "following"
    );
    return this.getUsers(following);
  }

  /** async get user friends: friends are people who are followers and are also in users following list*/
  async getFriends(id) {
    const followers = await this.getFollowersIds(id);
    const following = await this.getFollowingIds(id);

    const friendIds = [];
    for (const item of followers) {
      if (following.includes(item)) {
        friendIds.push(item);
      }
    }
    return this.getUsers(friendIds);
  }

  async getFollowingIds(id) {
    return await getArrayFieldFromCollection(
      this.database,
      "users",
      id,
      "following"
    );
  }

  async getFollowersIds(id) {
    return await getArrayFieldFromCollection(
      this.database,
      "users",
      id,
      "followers"
    );
  }

  /**
   *
   * Get user profile. User profile is made up of
   * User name, Bio, email, flashcards, friends, quizzes, profession, etc
   */
  async getProfile(userId) {
    const user = await this.getUserById(userId);
    const {
      id,
      bio,
      email,
      imageURL,
      username,
      name,
      profession,
      phone,
      firstName,
      lastName,
    } = user;

    const flashcards = await this.getOwnedFlashcards(id);
    const sharedFlashcards = await this.getSharedFlashcards(id);
    const friends = await this.getFriends(id);
    const followers = await this.getFollowers(id);
    const following = await this.getFollowing(id);

    return {
      id: id,
      bio: bio,
      email: email,
      imageURL: imageURL,
      username: username,
      friends: friends,
      followers: followers,
      following: following,
      name: firstName + " " + lastName,
      flashcards: flashcards,
      sharedFlashcards: sharedFlashcards,
      profession: profession,
      phone: phone,
      name: name,
      firstName: firstName,
      lastName: lastName,
    };
  }

  /**Get all notifications of user with id: {id}, returns the ids */
  async getNotificationIds(id) {
    const notificationIds = await getArrayFieldFromCollection(
      this.database,
      "users",
      id,
      "notifications"
    );
    return notificationIds;
  }

  /**Get raw notifications and not just the ids */
  async getNotifications(id) {
    const notificationIds = await this.getNotificationIds(id);

    const listOfNotifications =
      await this.notificationRepository.getListOfNotifications(notificationIds);
    listOfNotifications.reverse();
    return listOfNotifications;
  }

  /**get all user events */
  async getEvents(id) {
    const events = await getArrayFieldFromCollection(
      this.database,
      "users",
      id,
      "events"
    );
    return events;
  }

  /**add quiz with quizId to list of quizzes for user with userId */
  async addSharedQuiz(userId, quizId) {
    await addItemToArrayField(
      this.database,
      userId,
      quizId,
      "users",
      "sharedQuizzes",
      "quiz"
    );
  }

  /**user with userId shares quiz with user with id sharedWithId */
  async shareQuiz(userId, sharedWithId, quizId) {
    await this.addSharedQuiz(sharedWithId, quizId);
    const eventId = await this.eventRepository.createShareQuizEvent(
      userId,
      sharedWithId,
      quizId
    );
    const notificationId = await this.notificationRepository.addNotification(
      new Notification(eventId)
    );
    this.addEvent(sharedWithId, eventId);
    this.addNotification(sharedWithId, notificationId);
    this.incrementNewNotifications(sharedWithId);
    await this.notificationRepository.update(notificationId);
    return true;
  }

  /**add flashcard with flashcardId to list of flashcards for user with userId */
  async addSharedFlashcard(userId, flashcardId) {
    await addItemToArrayField(
      this.database,
      userId,
      flashcardId,
      "users",
      "sharedFlashcards",
      "flashcard"
    );
  }

  /**user with userId shares flashcard with user with id sharedWithId */
  async shareFlashcard(userId, sharedWithId, flashcardId) {
    await this.addSharedFlashcard(sharedWithId, flashcardId);
    const eventId = await this.eventRepository.createShareFlashcardEvent(
      userId,
      sharedWithId,
      flashcardId
    );
    const notificationId = await this.notificationRepository.addNotification(
      new Notification(eventId)
    );
    this.addEvent(sharedWithId, eventId);
    this.addNotification(sharedWithId, notificationId);
    this.incrementNewNotifications(sharedWithId);
    await this.notificationRepository.update(notificationId);
    return true;
  }

  async addOwnedQuiz(userId, quizId) {
    await addItemToArrayField(
      this.database,
      userId,
      quizId,
      "users",
      "ownedQuizzes",
      "quiz"
    );
  }

  async addOwnedFlashcard(userId, flashcardId) {
    await addItemToArrayField(
      this.database,
      userId,
      flashcardId,
      "users",
      "ownedFlashcards",
      "flashcard"
    );
  }

  async addEvent(userId, eventId) {
    await addItemToArrayField(
      this.database,
      userId,
      eventId,
      "users",
      "events",
      "event"
    );
  }

  async addNotification(userId, notificationId) {
    await addItemToArrayField(
      this.database,
      userId,
      notificationId,
      "users",
      "notifications",
      "notification"
    );
  }

  async addSubject(userId, subjectId) {
    await addItemToArrayField(
      this.database,
      userId,
      subjectId,
      "users",
      "subjects",
      "subject"
    );
  }

  async addFollower(userId, followerId) {
    await addItemToArrayField(
      this.database,
      userId,
      followerId,
      "users",
      "followers",
      "follower"
    );
  }

  /**Whenever userId follows followingId, followingId gains a new follower which is userId */
  async addFollowing(userId, followingId) {
    try {
      await addItemToArrayField(
        this.database,
        userId,
        followingId,
        "users",
        "following",
        "following"
      );
      await this.addFollower(followingId, userId);
    } catch (error) {
      console.error(`error while adding following is: ${error}`);
      return false;
    }

    return true;
  }

  async removeFollower(userId, followerId) {
    await removeItemFromArrayField(
      this.database,
      userId,
      followerId,
      "users",
      "followers",
      "follower"
    );
    console.log(
      `successfully removed ${followerId} from the list of followers of ${userId}`
    );
  }

  async removeFollowing(userId, followingId) {
    await removeItemFromArrayField(
      this.database,
      userId,
      followingId,
      "users",
      "following",
      "following"
    );
  }

  async removeNotificationById(userId, notificationId) {
    await removeItemFromArrayField(
      this.database,
      userId,
      notificationId,
      "users",
      "notifications",
      "notification"
    );
  }

  /**
   * userId starts folloing followingId
   * followingId gains userId as a follower
   */
  async startFollowing(userId, followingId) {
    await this.addFollowing(userId, followingId);
    await this.addFollower(followingId, userId);
    const eventId = await this.eventRepository.createNewFollowerEvent(
      userId,
      followingId
    );
    const notificationId = await this.notificationRepository.addNotification(
      new Notification(eventId)
    );
    this.addNotification(followingId, notificationId);
    this.incrementNewNotifications(followingId);
    await this.notificationRepository.update(notificationId);
  }

  /**
   * userId stops folloing followingId
   * followingId losses userId as a follower
   */
  async stopFollowing(userId, followingId) {
    await this.removeFollowing(userId, followingId);
    await this.removeFollower(followingId, userId);

    //Delete follow notification if a user unfollows another user
    const notifications = await this.getNotifications(followingId);
    for (const notificartion of notifications) {
      if (!notificartion.event) continue;
      if (
        notificartion.event.eventType == EVENT_TYPE.NEW_FOLLOWER &&
        notificartion.userFrom.id == userId
      ) {
        await this.removeNotificationById(followingId, notificartion.id);
      }
    }
  }

  //Given a list of user ids, get the actual user representation objects
  async getUsers(userIds) {
    const users = [];
    for (const userId of userIds) {
      users.push(await this.getUserById(userId));
    }
    return users;
  }

  //Given a user id, pass in an object to save profile
  /**
   *
   * Eg saveProfile(123, {friends:['mike', 'john'], firstName:"Joe", bio: "SWE at Amaxzon"})
   * In this example, we add mike and john to user(123) list of firends and edit their bio and firstName
   * Awlays make sure the keys you are passing into the updatedProfile match the keys in the database
   */
  async saveUserProfile(userId, updatedProfile) {
    let arrayFields = {};
    let nonArrayFields = {};

    for (const key in updatedProfile) {
      if (Array.isArray(updatedProfile[key])) {
        arrayFields[key] = updatedProfile[key];
      } else {
        nonArrayFields[key] = updatedProfile[key];
      }
    }

    await this.updateArrayUserFields(userId, arrayFields);
    await this.updateNonArrayUserFields(userId, nonArrayFields);
  }

  async incrementNewNotifications(userId) {
    const userRef = doc(this.database, "users", userId);
    try {
      await runTransaction(this.database, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) {
          throw new Error("User document not found.");
        }
        const currentNotifications = userDoc.data().newNotifications || 0;
        const newNotifications = currentNotifications + 1;
        transaction.update(userRef, { newNotifications });

        return newNotifications;
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async getNotificationCount(userId) {
    const user = await this.getUserById(userId);
    return user.newNotifications;
  }

  async setNotificationCountoZero(userId) {
    await this.updateNonArrayUserFields(userId, {
      newNotifications: 0,
    });
    return 0;
  }

  /**Upcoming events */
  async addUpcomingEvent(userId, name, date, time, type, itemId) {
    console.log("incoming: ", name, date, time);
    const splitDate = date.split(" ");
    const splitTime = time.split(":");
    console.log("split time is: ", splitDate);
    const scheduledDate = new Date(
      parseInt(splitDate[3]),
      this.getMonthIndex(splitDate[1]),
      parseInt(splitDate[2]),
      parseInt(splitTime[0]),
      parseInt(splitTime[1]),
      0
    );

    const utcStamp = scheduledDate.getTime();

    const dateToStore =
      splitDate[0] +
      " " +
      splitDate[1] +
      " " +
      splitDate[2] +
      " " +
      splitDate[3];
    console.log("date to store is: ", dateToStore);

    console.log("scheduled date is : ", scheduledDate);
    const upcomingEventId = await this.eventRepository.createUpcomingEvent(
      new UpcomingEvent(
        name,
        dateToStore,
        this.convertTo12HourFormat(time),
        type,
        itemId,
        utcStamp
      )
    );
    await addItemToArrayField(
      this.database,
      userId,
      upcomingEventId,
      "users",
      "upcomingEvents",
      "upcoming event"
    );
    return true;
  }

  async removeUpcomingEvent(userId, eventId) {
    await this.eventRepository.deleteUpcomingEvent(eventId);
    await removeItemFromArrayField(
      this.database,
      userId,
      eventId,
      "users",
      "upcomingEvents",
      "upcoming event"
    );
    return true;
  }

  async getUpcomingEventIds(userId) {
    const upcomingEventIds = await getArrayFieldFromCollection(
      this.database,
      "users",
      userId,
      "upcomingEvents"
    );
    return upcomingEventIds;
  }

  async getAllUpcomingEvents(userId) {
    const upcomingEventIds = await this.getUpcomingEventIds(userId);
    console.log("upcoming event ids are: ", upcomingEventIds);
    const result = [];
    for (const id of upcomingEventIds) {
      result.push({
        ...(await this.eventRepository.getUpcomingEventById(id)),
        id: id,
      });
    }
    return result;
  }

  async getUpcomingEvents(userId) {
    const upcomingEvents = await this.getAllUpcomingEvents(userId);

    return upcomingEvents.filter((item) => {
      return this.isTimestampInFuture(item.timestamp);
    });
  }

  async getPastEvents(userId) {
    const upcomingEvents = await this.getAllUpcomingEvents(userId);

    return upcomingEvents.filter((item) => {
      return !this.isTimestampInFuture(item.timestamp);
    });
  }

  isFutureDate(dateString) {
    var givenDate = new Date(dateString);
    var currentDate = new Date();

    return givenDate > currentDate;
  }

  isTimestampInFuture(timestamp) {
    const currentTime = Date.now();

    console.log("current and given", currentTime, timestamp);
    return timestamp > currentTime;
  }

  getMonthIndex(monthName) {
    const months = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };

    return months[monthName];
  }

  convertTo12HourFormat(timeString) {
    // Split the time string into hours and minutes
    let [hours, minutes] = timeString.split(":").map(Number);

    // Determine AM or PM suffix
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert hour from 24-hour to 12-hour format
    hours = hours % 12 || 12; // Converts '0' to '12'

    // Format the hour to ensure it always has two digits
    const formattedHour = hours.toString().padStart(2, "0");

    // Return the formatted time string
    return `${formattedHour}:${minutes} ${ampm}`;
  }
}
