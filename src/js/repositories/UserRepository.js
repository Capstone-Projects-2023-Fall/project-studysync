import { setDoc, doc } from 'firebase/firestore';
import { removeItemFromArrayField, updateArrayDocumentFields, addItemToArrayField, getArrayFieldFromCollection, getAllItems, getItemById, removeDocumentFromCollection, updateNonArrayDocumentFields } from '../utils/sharedRepositoryFunctions';
import { userConverter } from "../converters/userConverter"
import User from "../models/user"
import { Notification } from '../models/notification';

/**
 * Utility class to talk to FireStore User Collection [IN PROGRESS]
 */
export class UserRepository {
  constructor(database, quizRepository, notificationRepository, flashcardRepository, eventRepository) {
    this.database = database
    this.quizRepository = quizRepository
    this.notificationRepository = notificationRepository
    this.flashcardRepository = flashcardRepository
    this.eventRepository = eventRepository
  }

  /**Add a user to the database for the first time with id: uuid*/
  async addUser(email, username, firstName, lastName, uuid) {
    try {
      const userRef = doc(this.database, "users", uuid)
      await setDoc(userRef, new User(email, username, firstName, lastName, uuid).toJSON())
      console.log('Successfully added user to database', username);
    } catch (error) {
      console.log("error adding user", error)
    }
  }

  /**Given a unique uuid, return the user associated with that uuid */
  async getUserById(id) {
    return await getItemById(this.database, id, "users", "user")
  }

  async deleteUser(id) {
    return await removeDocumentFromCollection(this.database, id, "users", "user")
  }

  async updateNonArrayUserFields(id, toUpdate) {
    await updateNonArrayDocumentFields(this.database, id, "users", toUpdate)
  }

  async updateArrayUserFields(id, toUpdate) {
    await updateArrayDocumentFields(this.database, id, "users", toUpdate)
  }

  /**Return all users in the user collection */
  async getAllUsers() {
    return await getAllItems(this.database, "users", userConverter)
  }

  /**Get all owned quizzes owned by user with id: {id} */
  async getOwnedQuizzes(id) {
    const ownedQuizzes = await getArrayFieldFromCollection(this.database, "users", id, "ownedQuizzes")
    return ownedQuizzes
  }

  /**Get all quizzes shared by user with id: {id} */
  async getSharedQuizzes(id) {
    const sharedQuizzes = await getArrayFieldFromCollection(this.database, "users", id, "sharedQuizzes")
    return sharedQuizzes
  }

  /**Get all owned flashcards owned by user with id: {id} */
  async getOwnedFlashcards(id) {
    const ownedFlashcards = await getArrayFieldFromCollection(this.database, "users", id, "ownedFlashcards")
    return await this.flashcardRepository.getFlashcards(ownedFlashcards)
  }

  /**Get all flashcards shared by user with id: {id} */
  async getSharedFlashcards(id) {
    const sharedFlashcards = await getArrayFieldFromCollection(this.database, "users", id, "sharedFlashcards")
    return await this.flashcardRepository.getFlashcards(sharedFlashcards)
  }

  /**Get all followers of user with id: {id} */
  async getFollowers(id) {
    const followers = await getArrayFieldFromCollection(this.database, "users", id, "followers")
    return this.getUsers(followers)
  }

  /**Get all following of user with id: {id} */
  async getFollowing(id) {
    const following = await getArrayFieldFromCollection(this.database, "users", id, "following")
    return this.getUsers(following)
  }

  /** async get user friends: friends are people who are followers and are also in users following list*/
  async getFriends(id) {
    const followers = await this.getFollowers(id)
    const following = await this.getFollowing(id)

    return followers.filter((user1) => {
      following.some((user2) => user1.id === user2.id)
    })
  }

  /**
   * 
   * Get user profile. User profile is made up of
   * User name, Bio, email, flashcards, friends, quizzes, profession, etc
   */
  async getProfile(userId) {
    const user = await this.getUserById(userId)
    const { id, bio, email, imageURL, username, name, profession, phone, firstName, lastName} = user

    const flashcards = await this.getOwnedFlashcards(id)
    const sharedFlashcards = await this.getSharedFlashcards(id)
    const friends = await this.getFriends(id)
    const followers = await this.getFollowers(id)
    const following = await this.getFollowing(id)

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
      name: name
    }
  }

  /**Get all notifications of user with id: {id}, returns the ids */
  async getNotifications(id) {
    const notificationIds = await getArrayFieldFromCollection(this.database, "users", id, "notifications")
    return notificationIds
  }

  /**Get raw notifications and not just the ids */
  async getRawNotifications(id){
    const notificationIds = await this.getNotifications(id)
    const result = []

    for(const notifId of notificationIds){
      result.push(await this.notificationRepository.getRawNotification(notifId))
    }
    return result
  }

  /**get all user events */
  async getEvents(id) {
    const events = await getArrayFieldFromCollection(this.database, "users", id, "events")
    return events
  }

  /**add quiz with quizId to list of quizzes for user with userId */
  async addSharedQuiz(userId, quizId) {
    await addItemToArrayField(this.database, userId, quizId, "users", "sharedQuizzes", "quiz")
  }

  /**user with userId shares quiz with user with id sharedWithId */
  async shareQuiz(userId, sharedWithId, quizId){
    await this.addSharedQuiz(sharedWithId, quizId)
    const eventId = await this.eventRepository.createShareQuizEvent(userId, sharedWithId)
    const notificationId = await this.notificationRepository.addNotification(new Notification(eventId))
    this.addEvent(eventId)
    this.addNotification(sharedWithId, notificationId)
  }

  /**add flashcard with flashcardId to list of flashcards for user with userId */
  async addSharedFlashcard(userId, flashcardId) {
    await addItemToArrayField(this.database, userId, flashcardId, "users", "flashcards", "flashcard")
  }

  /**user with userId shares flashcard with user with id sharedWithId */
  async shareFlashcard(userId, sharedWithId, flashcardId){
    await this.addSharedQuiz(sharedWithId, flashcardId)
    const eventId = await this.eventRepository.createShareFlashcardEvent(userId, sharedWithId)
    const notificationId = await this.notificationRepository.addNotification(new Notification(eventId))
    this.addEvent(eventId)
    this.addNotification(sharedWithId, notificationId)
  }

  async addOwnedQuiz(userId, quizId) {
    await addItemToArrayField(this.database, userId, quizId, "users", "ownedQuizzes", "quiz")
  }

  async addOwnedFlashcard(userId, flashcardId) {
    await addItemToArrayField(this.database, userId, flashcardId, "users", "flashcards", "flashcard")
  }

  async addEvent(userId, eventId) {
    await addItemToArrayField(this.database, userId, eventId, "users", "events", "event")
  }

  async addNotification(userId, notificationId) {
    await addItemToArrayField(this.database, userId, notificationId, "users", "notifications", "notification")
  }

  async addSubject(userId, subjectId) {
    await addItemToArrayField(this.database, userId, subjectId, "users", "subjects", "subject")
  }

  async addFollower(userId, followerId) {
    await addItemToArrayField(this.database, userId, followerId, "users", "followers", "follower")
  }

  async addFollowing(userId, followingId) {
    await addItemToArrayField(this.database, userId, followingId, "users", "following", "following")
    await this.addFollower(followingId, userId)
    //create a new event in followingId to indicate that someone followed them. add the event to their notifications
    const eventId = await this.eventRepository.createNewFollowerEvent(userId, followingId)
    // //create a new notification with this event
    console.log("eventId from banche is: ", eventId)
    const notificationId = await this.notificationRepository.addNotification(new Notification(eventId, "New Follower"))
    // //add this notification to users list of notifications
    this.addNotification(followingId, notificationId)
    //add event to user events
    this.addEvent(userId, eventId)
  }

  async removeFollower(userId, followerId) {
    await removeItemFromArrayField(this.database, userId, followerId, "users", "followers", "follower")
  }

  async removeFollowing(userId, followingId) {
    await removeItemFromArrayField(this.database, userId, followingId, "users", "following", "following")
  }

  //Given a list of user ids, get the actual user representation objects
  async getUsers(userIds) {
    const users = []
    for (const userId of userIds) {
      users.push(await this.getUserById(userId))
    }
    return users
  }


}

