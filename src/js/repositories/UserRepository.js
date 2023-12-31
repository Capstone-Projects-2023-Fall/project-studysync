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
/**
 * @class UserRepository
 * @classdesc UserRepository - Manages user-related data interactions with the database.
 * 
 * @param {Object} database - The database connection used for accessing user data.
 * @param {QuizRepository} quizRepository - Repository for handling quiz data.
 * @param {NotificationRepository} notificationRepository - Repository for handling notification data.
 * @param {FlashcardRepository} flashcardRepository - Repository for handling flashcard data.
 * @param {EventRepository} eventRepository - Repository for handling event data.
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
  /**
  * @memberof UserRepository
  * @function addUser
  * @description Adds a new user to the database.
  * @param {string} email - User's email.
  * @param {string} username - User's username.
  * @param {string} firstName - User's first name.
  * @param {string} lastName - User's last name.
  * @param {string} uuid - User's unique identifier.
  */
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
  /**
   * @memberof UserRepository
   * @function getUserById
   * @description Retrieves a user by their ID.
   * @param {string} id - The ID of the user to retrieve.
   * @returns {Promise<Object>} A promise that resolves to the user object.
   */
  async getUserById(id) {
    return await getItemById(this.database, id, "users", "user");
  }
  /**
     * @memberof UserRepository
     * @function deleteUser
     * @description Deletes a user by their ID.
     * @param {string} id - The ID of the user to delete.
     * @returns {Promise<void>}
     */
  async deleteUser(id) {
    return await removeDocumentFromCollection(
      this.database,
      id,
      "users",
      "user"
    );
  }
  /**
     * @memberof UserRepository
     * @function updateNonArrayUserFields
     * @description Updates non-array fields of a user document.
     * @param {string} id - The ID of the user to update.
     * @param {Object} toUpdate - Object containing the fields to update.
     */
  async updateNonArrayUserFields(id, toUpdate) {
    await updateNonArrayDocumentFields(this.database, id, "users", toUpdate);
  }
  /**
     * @memberof UserRepository
     * @function updateArrayUserFields
     * @description Updates array fields of a user document.
     * @param {string} id - The ID of the user to update.
     * @param {Object} toUpdate - Object containing the array fields to update.
     */
  async updateArrayUserFields(id, toUpdate) {
    await updateArrayDocumentFields(this.database, id, "users", toUpdate);
  }

  /**Return all users in the user collection */
  /**
   * @memberof UserRepository
   * @function getAllUsers
   * @description Retrieves all users from the database.
   * @returns {Promise<Array>} A promise that resolves to an array of user objects.
   */
  async getAllUsers() {
    return await getAllItems(this.database, "users", userConverter);
  }

  /**Get all owned quizzes owned by user with id: {id} */
  /**
   * @memberof UserRepository
   * @function getOwnedQuizzesIds
   * @description Retrieves IDs of all quizzes owned by a specific user.
   * @param {string} id - The ID of the user.
   * @returns {Promise<Array>} A promise that resolves to an array of quiz IDs.
   */
  async getOwnedQuizzesIds(id) {
    const ownedQuizzes = await getArrayFieldFromCollection(
      this.database,
      "users",
      id,
      "ownedQuizzes"
    );
    return ownedQuizzes;
  }
  /**
     * @memberof UserRepository
     * @function getOwnedQuizzes
     * @description Retrieves all quizzes owned by a specific user.
     * @param {string} userId - The ID of the user.
     * @returns {Promise<Array>} A promise that resolves to an array of quiz objects.
     */
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
  /**
  * @memberof UserRepository
  * @function getSharedQuizzesIds
  * @description Retrieves IDs of all quizzes shared by a specific user.
  * @param {string} id - The ID of the user.
  * @returns {Promise<Array>} A promise that resolves to an array of shared quiz IDs.
  */
  async getSharedQuizzesIds(id) {
    const sharedQuizzes = await getArrayFieldFromCollection(
      this.database,
      "users",
      id,
      "sharedQuizzes"
    );
    return sharedQuizzes;
  }
  /**
     * @memberof UserRepository
     * @function getSharedQuizzes
     * @description Retrieves all quizzes shared by a specific user.
     * @param {string} userId - The ID of the user.
     * @returns {Promise<Array>} A promise that resolves to an array of shared quiz objects.
     */
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
  /**
   * @memberof UserRepository
   * @function getOwnedFlashcardsIds
   * @description Retrieves IDs of all flashcards owned by a specific user.
   * @param {string} id - The ID of the user.
   * @returns {Promise<Array>} A promise that resolves to an array of flashcard IDs.
   */
  async getOwnedFlashcardsIds(id) {
    const ownedFlashcardsIds = await getArrayFieldFromCollection(
      this.database,
      "users",
      id,
      "ownedFlashcards"
    );
    return ownedFlashcardsIds;
  }
  /**
     * @memberof UserRepository
     * @function getOwnedFlashcards
     * @description Retrieves all flashcards owned by a specific user.
     * @param {string} userId - The ID of the user.
     * @returns {Promise<Array>} A promise that resolves to an array of flashcard objects.
     */
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
  /**
   * @memberof UserRepository
   * @function getSharedFlashcardIds
   * @description Retrieves the IDs of all flashcards shared by a specific user.
   * @param {string} id - The ID of the user.
   * @returns {Promise<Array>} A promise that resolves to an array of shared flashcard IDs.
   */
  async getSharedFlashcardIds(id) {
    const sharedFlashcardsIds = await getArrayFieldFromCollection(
      this.database,
      "users",
      id,
      "sharedFlashcards"
    );
    return sharedFlashcardsIds;
  }
  /**
     * @memberof UserRepository
     * @function getSharedFlashcards
     * @description Retrieves all flashcards shared by a specific user.
     * @param {string} userId - The ID of the user.
     * @returns {Promise<Array>} A promise that resolves to an array of shared flashcard objects.
     */
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
  /**
   * @memberof UserRepository
   * @function getFollowers
   * @description Retrieves all followers of a specific user.
   * @param {string} id - The ID of the user.
   * @returns {Promise<Array>} A promise that resolves to an array of follower user objects.
   */
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
  /**
   * @memberof UserRepository
   * @function getFollowing
   * @description Retrieves all users that a specific user is following.
   * @param {string} id - The ID of the user.
   * @returns {Promise<Array>} A promise that resolves to an array of following user objects.
   */
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
  /**
   * @memberof UserRepository
   * @function getFriends
   * @description Retrieves all friends (mutual followers) of a specific user.
   * @param {string} id - The ID of the user.
   * @returns {Promise<Array>} A promise that resolves to an array of friend user objects.
   */
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
  /**
     * @memberof UserRepository
     * @function getFollowingIds
     * @description Retrieves the IDs of all users that a specific user is following.
     * @param {string} id - The ID of the user.
     * @returns {Promise<Array>} A promise that resolves to an array of following user IDs.
     */
  async getFollowingIds(id) {
    return await getArrayFieldFromCollection(
      this.database,
      "users",
      id,
      "following"
    );
  }
  /**
     * @memberof UserRepository
     * @function getFollowersIds
     * @description Retrieves the IDs of all followers of a specific user.
     * @param {string} id - The ID of the user.
     * @returns {Promise<Array>} A promise that resolves to an array of follower user IDs.
     */
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
  /**
  * @memberof UserRepository
  * @function getProfile
  * @description Retrieves the profile of a specific user, including personal details and owned/shared content.
  * @param {string} userId - The ID of the user.
  * @returns {Promise<Object>} A promise that resolves to an object containing the user's profile information.
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
  /**
   * @memberof UserRepository
   * @function getNotificationIds
   * @description Retrieves the IDs of all notifications for a specific user.
   * @param {string} id - The ID of the user.
   * @returns {Promise<Array>} A promise that resolves to an array of notification IDs.
   */
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
  /**
   * @memberof UserRepository
   * @function getNotifications
   * @description Retrieves all notifications for a specific user.
   * @param {string} id - The ID of the user.
   * @returns {Promise<Array>} A promise that resolves to an array of notification objects.
   */
  async getNotifications(id) {
    const notificationIds = await this.getNotificationIds(id);

    const listOfNotifications =
      await this.notificationRepository.getListOfNotifications(notificationIds);
    listOfNotifications.reverse();
    return listOfNotifications;
  }

  /**get all user events */
  /**
   * @memberof UserRepository
   * @function getEvents
   * @description Retrieves all events associated with a specific user.
   * @param {string} id - The ID of the user.
   * @returns {Promise<Array>} A promise that resolves to an array of event objects.
   */
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
  /**
   * @memberof UserRepository
   * @function addSharedQuiz
   * @description Adds a quiz to the shared quizzes list of a user.
   * @param {string} userId - The ID of the user.
   * @param {string} quizId - The ID of the quiz to share.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
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
  /**
   * @memberof UserRepository
   * @function shareQuiz
   * @description Shares a quiz with another user and generates the associated notifications and events.
   * @param {string} userId - The ID of the user sharing the quiz.
   * @param {string} sharedWithId - The ID of the user with whom the quiz is shared.
   * @param {string} quizId - The ID of the quiz being shared.
   * @returns {Promise<boolean>} A promise that resolves to true if the sharing is successful.
   */
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
  /**
   * @memberof UserRepository
   * @function addSharedFlashcard
   * @description Adds a flashcard to the shared flashcards list of a user.
   * @param {string} userId - The ID of the user.
   * @param {string} flashcardId - The ID of the flashcard to share.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
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
  /**
   * @memberof UserRepository
   * @function shareFlashcard
   * @description Shares a flashcard with another user and creates the necessary notifications and events.
   * @param {string} userId - The ID of the user sharing the flashcard.
   * @param {string} sharedWithId - The ID of the user with whom the flashcard is shared.
   * @param {string} flashcardId - The ID of the flashcard being shared.
   * @returns {Promise<boolean>} A promise that resolves to true if the sharing is successful.
   */
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
  /**
     * @memberof UserRepository
     * @function addOwnedQuiz
     * @description Adds a quiz to the owned quizzes list of a user.
     * @param {string} userId - The ID of the user.
     * @param {string} quizId - The ID of the quiz to add.
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     */
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
  /**
     * @memberof UserRepository
     * @function addOwnedFlashcard
     * @description Adds a flashcard to the owned flashcards list of a user.
     * @param {string} userId - The ID of the user.
     * @param {string} flashcardId - The ID of the flashcard to add.
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     */
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
  /**
     * @memberof UserRepository
     * @function addEvent
     * @description Adds an event to the events list of a user.
     * @param {string} userId - The ID of the user.
     * @param {string} eventId - The ID of the event to add.
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     */
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
  /**
     * @memberof UserRepository
     * @function addNotification
     * @description Adds a notification to the notifications list of a user.
     * @param {string} userId - The ID of the user.
     * @param {string} notificationId - The ID of the notification to add.
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     */
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
  /**
     * @memberof UserRepository
     * @function addSubject
     * @description Adds a subject to the subjects list of a user.
     * @param {string} userId - The ID of the user.
     * @param {string} subjectId - The ID of the subject to add.
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     */
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
  /**
    * @memberof UserRepository
    * @function addFollower
    * @description Adds a follower to the followers list of a user.
    * @param {string} userId - The ID of the user.
    * @param {string} followerId - The ID of the follower to add.
    * @returns {Promise<void>} A promise that resolves when the operation is complete.
    */
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
  /**
   * @memberof UserRepository
   * @function addFollowing
   * @description Adds a user to the following list of another user.
   * @param {string} userId - The ID of the user who is following.
   * @param {string} followingId - The ID of the user being followed.
   * @returns {Promise<boolean>} A promise that resolves to true if the operation is successful.
   */
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
  /**
     * @memberof UserRepository
     * @function removeFollower
     * @description Removes a follower from the followers list of a user.
     * @param {string} userId - The ID of the user whose follower is being removed.
     * @param {string} followerId - The ID of the follower to remove.
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     */
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
  /**
     * @memberof UserRepository
     * @function removeFollowing
     * @description Removes a user from the following list of another user.
     * @param {string} userId - The ID of the user who is unfollowing.
     * @param {string} followingId - The ID of the user being unfollowed.
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     */
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
  /**
     * @memberof UserRepository
     * @function removeNotificationById
     * @description Removes a notification from a user's notification list.
     * @param {string} userId - The ID of the user.
     * @param {string} notificationId - The ID of the notification to remove.
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     */
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
  /**
   * @memberof UserRepository
   * @function startFollowing
   * @description Initiates the process of one user starting to follow another user.
   * @param {string} userId - The ID of the user who starts following.
   * @param {string} followingId - The ID of the user being followed.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
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
  /**
   * @memberof UserRepository
   * @function stopFollowing
   * @description Stops one user from following another and updates the database accordingly.
   * @param {string} userId - The ID of the user who stops following.
   * @param {string} followingId - The ID of the user being unfollowed.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  async stopFollowing(userId, followingId) {
    await this.removeFollowing(userId, followingId);
    await this.removeFollower(followingId, userId);

    //Delete follow notification if a user unfollows another user
    const notifications = await this.getNotifications(followingId);
    for (const notificartion of notifications) {
      if (!notificartion.event) continue;
      if (
        notificartion.event.eventType === EVENT_TYPE.NEW_FOLLOWER &&
        notificartion.userFrom.id === userId
      ) {
        await this.removeNotificationById(followingId, notificartion.id);
      }
    }
  }

  //Given a list of user ids, get the actual user representation objects
  /**
   * @memberof UserRepository
   * @function getUsers
   * @description Retrieves user objects based on a list of user IDs.
   * @param {string[]} userIds - An array of user IDs.
   * @returns {Promise<User[]>} A promise that resolves to an array of User objects.
   */
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
  /**
   * @memberof UserRepository
   * @function saveUserProfile
   * @description Saves updated profile information for a user.
   * @param {string} userId - The ID of the user.
   * @param {Object} updatedProfile - The object containing the updated profile fields.
   * @returns {Promise<void>} A promise that resolves when the profile update is complete.
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
  /**
     * @memberof UserRepository
     * @function incrementNewNotifications
     * @description Increments the count of new notifications for a user.
     * @param {string} userId - The ID of the user whose notification count is to be incremented.
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     */
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
  /**
     * @memberof UserRepository
     * @function getNotificationCount
     * @description Retrieves the current count of new notifications for a user.
     * @param {string} userId - The ID of the user.
     * @returns {Promise<number>} A promise that resolves to the number of new notifications.
     */
  async getNotificationCount(userId) {
    const user = await this.getUserById(userId);
    return user.newNotifications;
  }
  /**
     * @memberof UserRepository
     * @function setNotificationCountToZero
     * @description Resets the new notifications count to zero for a user.
     * @param {string} userId - The ID of the user.
     * @returns {Promise<number>} A promise that resolves to zero, indicating no new notifications.
     */
  async setNotificationCountoZero(userId) {
    await this.updateNonArrayUserFields(userId, {
      newNotifications: 0,
    });
    return 0;
  }

  /**Upcoming events */
  /**
   * @memberof UserRepository
   * @function addUpcomingEvent
   * @description Adds an upcoming event to a user's event list.
   * @param {string} userId - The ID of the user.
   * @param {Object} eventDetails - The details of the upcoming event.
   * @returns {Promise<boolean>} A promise that resolves to true if the operation is successful.
   */
  async addUpcomingEvent(userId, name, date, time, type, itemId, itemName) {
    const [year, month, day] = date.split("-");

    const y = parseInt(year, 10);
    const m = parseInt(month, 10) - 1;
    const d = parseInt(day, 10);
    const splitTime = time.split(":");
    const scheduledDate = new Date(
      y,
      m,
      d,
      parseInt(splitTime[0]),
      parseInt(splitTime[1]),
      0
    );

    const utcStamp = scheduledDate.getTime();
    const dd = new Date(date);

    const dateToStore =
      this.getDayOfWeekShort(dd) +
      " " +
      this.getMonthAbbreviation(dd) +
      " " +
      day +
      " " +
      year;

    const upcomingEventId = await this.eventRepository.createUpcomingEvent(
      new UpcomingEvent(
        name,
        dateToStore,
        this.convertTo12HourFormat(time),
        type,
        itemId,
        utcStamp,
        userId,
        itemName
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
  /**
     * @memberof UserRepository
     * @function addUpcomingEventNotification
     * @description Adds a notification for an upcoming event to a user's notification list.
     * @param {string} userId - The ID of the user.
     * @param {UpcomingEvent} upcomingEvent - The upcoming event for which the notification is created.
     * @returns {Promise<boolean>} A promise that resolves to true if the operation is successful.
     */
  async addUpcomingEventNotification(userId, upcomingEvent) {
    const notification = new Notification(null, true, upcomingEvent);
    const notificationId = await this.notificationRepository.addNotification(
      notification
    );
    await this.addNotification(userId, notificationId);
    this.incrementNewNotifications(userId);
    return true;
  }
  /**
     * @memberof UserRepository
     * @function removeUpcomingEvent
     * @description Removes an upcoming event from a user's event list.
     * @param {string} userId - The ID of the user.
     * @param {string} eventId - The ID of the event to be removed.
     * @returns {Promise<boolean>} A promise that resolves to true if the operation is successful.
     */
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
  /**
     * @memberof UserRepository
     * @function getUpcomingEventIds
     * @description Retrieves IDs of all upcoming events for a user.
     * @param {string} userId - The ID of the user.
     * @returns {Promise<string[]>} A promise that resolves to an array of upcoming event IDs.
     */
  async getUpcomingEventIds(userId) {
    const upcomingEventIds = await getArrayFieldFromCollection(
      this.database,
      "users",
      userId,
      "upcomingEvents"
    );
    return upcomingEventIds;
  }
  /**
     * @memberof UserRepository
     * @function getAllUpcomingEvents
     * @description Retrieves all upcoming events for a user.
     * @param {string} userId - The ID of the user.
     * @returns {Promise<UpcomingEvent[]>} A promise that resolves to an array of UpcomingEvent objects.
     */
  async getAllUpcomingEvents(userId) {
    const upcomingEventIds = await this.getUpcomingEventIds(userId);
    const result = [];
    for (const id of upcomingEventIds) {
      result.push({
        ...(await this.eventRepository.getUpcomingEventById(id)),
        id: id,
      });
    }
    return result;
  }
  /**
     * @memberof UserRepository
     * @function getUpcomingEvents
     * @description Retrieves upcoming events for a user that are scheduled for the future.
     * @param {string} userId - The ID of the user.
     * @returns {Promise<UpcomingEvent[]>} A promise that resolves to an array of future UpcomingEvent objects.
     */
  async getUpcomingEvents(userId) {
    const upcomingEvents = await this.getAllUpcomingEvents(userId);

    return upcomingEvents.filter((item) => {
      return this.isTimestampInFuture(item.timestamp);
    });
  }
  /**
     * @memberof UserRepository
     * @function getPastEvents
     * @description Retrieves past events for a user.
     * @param {string} userId - The ID of the user.
     * @returns {Promise<UpcomingEvent[]>} A promise that resolves to an array of past UpcomingEvent objects.
     */
  async getPastEvents(userId) {
    const upcomingEvents = await this.getAllUpcomingEvents(userId);

    return upcomingEvents.filter((item) => {
      return !this.isTimestampInFuture(item.timestamp);
    });
  }
  /**
     * @memberof UserRepository
     * @function isTimestampInFuture
     * @description Checks whether a given timestamp is in the future.
     * @param {number} timestamp - The timestamp to be checked.
     * @returns {boolean} Returns true if the timestamp is in the future.
     */
  isTimestampInFuture(timestamp) {
    const currentTime = Date.now();
    return timestamp > currentTime;
  }
  /**
     * @memberof UserRepository
     * @function getMonthIndex
     * @description Retrieves the index of a month given its name.
     * @param {string} monthName - The name of the month.
     * @returns {number} The index of the month.
     */
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
  /**
     * @memberof UserRepository
     * @function convertTo12HourFormat
     * @description Converts a time string from 24-hour format to 12-hour format.
     * @param {string} timeString - The time string in 24-hour format.
     * @returns {string} The time string in 12-hour format.
     */
  convertTo12HourFormat(timeString) {
    let [hours, minutes] = timeString.split(":").map(Number);

    // Determine AM or PM suffix
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert hour from 24-hour to 12-hour format
    hours = hours % 12 || 12; // Converts '0' to '12'

    // Format the hour and minutes to ensure they always have two digits
    const formattedHour = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");

    // Return the formatted time string
    return `${formattedHour}:${formattedMinutes} ${ampm}`;
  }
  /**
     * @memberof UserRepository
     * @function getDayOfWeekShort
     * @description Returns a short form of the day of the week for a given date.
     * @param {string} dateString - The date string.
     * @returns {string} A short form of the day of the week.
     */
  getDayOfWeekShort(dateString) {
    const daysShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const date = new Date(dateString);
    return daysShort[date.getDay()];
  }
  /**
   * @memberof UserRepository
   * @function getMonthAbbreviation
   * @description Returns the abbreviated form of the month for a given date.
   * @param {string} dateString - The date string.
   * @returns {string} The abbreviated month name.
   */
  getMonthAbbreviation(dateString) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const date = new Date(dateString);
    return months[date.getMonth()];
  }
}