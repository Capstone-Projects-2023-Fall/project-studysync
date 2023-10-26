import {setDoc, doc} from 'firebase/firestore';
import { removeItemFromArrayField, updateArrayDocumentFields, addItemToArrayField, getArrayFieldFromCollection, getAllItems, getItemById, removeDocumentFromCollection, updateNonArrayDocumentFields } from '../utils/sharedRepositoryFunctions';
import {userConverter} from "../converters/userConverter"
import User from "../models/user"

/**
 * Utility class to talk to FireStore User Collection [IN PROGRESS]
 */
export class UserRepository{
    constructor(database, quizRepository, notificationRepository, flashcardRepository){
      this.database = database
      this.quizRepository = quizRepository
      this.notificationRepository = notificationRepository
      this.flashcardRepository = flashcardRepository
    }

    /**Add a user to the database for the first time with id: uuid*/
    async addUser(email, username, uuid){
      try{
        const userRef = doc(this.database, "users", uuid)
        await setDoc(userRef, new User(email, username, uuid).toJSON())
        console.log('Successfully added user to database',username);
      }catch(error){
        console.log("error adding user", error)
      }
    }

    /**Given a unique uuid, return the user associated with that uuid */
    async getUserById(id){
      return await getItemById(this.database, id, "users", "user")
    }

    async deleteUser(id){
      return await removeDocumentFromCollection(this.database, id, "users", "user")
    }

    async updateNonArrayUserFields(id, toUpdate){
      await updateNonArrayDocumentFields(this.database, id, "users", toUpdate)
    }

    async updateArrayUserFields(id, toUpdate){
      await updateArrayDocumentFields(this.database, id, "users", toUpdate)
    }
    
    /**Return all users in the user collection */
    async getAllUsers(){
      return await getAllItems(this.database, "users",userConverter)
    }
    
    /**Get all owned quizzes owned by user with id: {id} */
    async getOwnedQuizzes(id){
      const ownedQuizzes = await getArrayFieldFromCollection(this.database, "users", id, "ownedQuizzes")
      return ownedQuizzes
    }

    /**Get all quizzes shared by user with id: {id} */
    async getSharedQuizzes(id){
      const sharedQuizzes = await getArrayFieldFromCollection(this.database, "users", id, "sharedQuizzes")
      return sharedQuizzes
    }

    /**Get all owned flashcards owned by user with id: {id} */
    async getOwnedFlashcards(id){
      const ownedFlashcards = await getArrayFieldFromCollection(this.database, "users", id, "ownedFlashcards")
      return ownedFlashcards
    }

    /**Get all flashcards shared by user with id: {id} */
    async getSharedFlashcards(id){
      const sharedFlashcards = await getArrayFieldFromCollection(this.database, "users", id, "sharedFlashcards")
      return sharedFlashcards
    }

    /**Get all followers of user with id: {id} */
    async getFollowers(id){
      const followers = await getArrayFieldFromCollection(this.database, "users", id, "followers")
      return followers
    }

    /**Get all following of user with id: {id} */
    async getFollowing(id){
      const following = await getArrayFieldFromCollection(this.database, "users", id, "following")
      return following
    }

    /**Get all notifications of user with id: {id}, returns the ids */
    async getNotifications(id){
      const notificationIds = await getArrayFieldFromCollection(this.database, "users", id, "notifications")
      return notificationIds
    }

    async getEvents(id){
      const events = await getArrayFieldFromCollection(this.database, "users", id, "events")
      return events
    }
    
    async addSharedQuiz(userId, quizId){
      await addItemToArrayField(this.database, userId, quizId, "users", "sharedQuizzes", "quiz")
    }
    
    async addSharedFlashcard(userId, flashcardId){
      await addItemToArrayField(this.database, userId, flashcardId, "users", "flashcards", "flashcard")
    }

    async addOwnedQuiz(userId, quizId){
      await addItemToArrayField(this.database, userId, quizId, "users",  "ownedQuizzes", "quiz")
    }

    async addOwnedFlashcard(userId, flashcardId) {
      await addItemToArrayField(this.database, userId, flashcardId, "users", "flashcards", "flashcard")
    }

    async addEvent(userId, eventId){
      await addItemToArrayField(this.database, userId, eventId, "users", "events", "event")
    }

    async addNotification(userId, notificationId){
      await addItemToArrayField(this.database, userId, notificationId, "users", "notifications", "notification")
    }

    async addSubject(userId, subjectId) {
      await addItemToArrayField(this.database, userId, subjectId, "users", "subjects", "subject")
    }

    async addFollower(userId, followerId){
      await addItemToArrayField(this.database, userId, followerId, "users", "followers", "follower")
    }

    async addFollowing(userId, followingId){
      await addItemToArrayField(this.database, userId, followingId, "users", "following", "following")
    }

    async removeFollower(userId, followerId){
      await removeItemFromArrayField(this.database, userId, followerId, "users", "followers", "follower")
    }

    async removeFollowing(userId, followingId){
      await removeItemFromArrayField(this.database, userId, followingId, "users", "following", "following")
    }
}

