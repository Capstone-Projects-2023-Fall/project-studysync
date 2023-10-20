import {collection, getDocs, query, where,setDoc, doc, updateDoc, arrayRemove, arrayUnion} from 'firebase/firestore';
import { addItemToArrayField, getArrayFieldFromCollection } from '../utils/sharedRepositoryFunctions';
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

    /**Add a user to the database for the first time */
    async addUser(email, username, uuid){
      try{
        const userRef = doc(this.database, "users", uuid).withConverter(userConverter)
        await setDoc(userRef, new User(email, username, uuid))

        console.log('Successfully added user to database',username);
      }catch(error){
        console.log("error adding user", error)
      }
    }
    
    /**Return all users in the user collection */
    async getAllUsers(){
      const usersRef = collection(this.database, "users").withConverter(userConverter)
      const snapshot = await getDocs(usersRef, "users");
      const users = []
      snapshot.docs.forEach((doc)=>{
        const user = doc.data()
        users.push(user)
      })
      return users
    }
    
    /**Given a unique uuid, return the user associated with that uuid */
    async getUserById(id){
      const result = query(collection(this.database, "users"), where("email", "==", id));
      const snapshot = await getDocs(result);

      if(snapshot.size > 1) return "Cannot have two users with the same id"
      else if(snapshot.size === 0) return `User with id ${id} does not exist`
      console.log("user is: ", snapshot.docs.at(0).data())
      return snapshot.docs.at(0).data()
    }

    async getOwnedQuizzes(id){
      const ownedQuizzes = await getArrayFieldFromCollection(this.database, "users", id, "ownedQuizzes")
      return ownedQuizzes
    }

    async getSharedQuizzes(id){
      const sharedQuizzes = await getArrayFieldFromCollection(this.database, "users", id, "sharedQuizzes")
      return sharedQuizzes
    }

    async getOwnedFlashcards(id){
      const ownedFlashcards = await getArrayFieldFromCollection(this.database, "users", id, "ownedFlashcards")
      return ownedFlashcards
    }

    async getSharedFlashcards(id){
      const sharedFlashcards = await getArrayFieldFromCollection(this.database, "users", id, "sharedFlashcards")
      return sharedFlashcards
    }

    async getFollowers(id){
      const followers = await getArrayFieldFromCollection(this.database, "users", id, "followers")
      return followers
    }

    async getFollowing(id){
      const following = await getArrayFieldFromCollection(this.database, "users", id, "following")
      return following
    }

    async getNotifications(id){
      const notificationIds = await getArrayFieldFromCollection(this.database, "users", id, "notifications")
      const notifications = []
      for(let i = 0; i < notificationIds.length; i++){
        const id = notificationIds[i]
        notifications.push(await this.notificationRepository.getNotification(id))
      }
      return notifications
    }

    async getEvents(id){
      const events = await getArrayFieldFromCollection(this.database, "users", id, "events")
      return events
    }

    async getBio(id){}
    
    async addFlashcard(userId, flashcardId){
      await addItemToArrayField(this.database, userId, flashcardId, "users", "flashcards", "flashcard")
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

    async addFollower(){}
}

const userConverter = {
  toFirestore: (user) => {
      return {
        username: user.username,
        email: user.email,
        bio: user.bio,
        following: user.following,
        followers: user.followers,
        imageUrl: user.imageUrl,
        ownedQuizzes: user.ownedQuizzes,
        sharedQuizzes: user.sharedQuizzes,
        ownedFlashcards : user.sharedFlashcards,
        sharedFlashcards : user.sharedFlashcards,
        notifications: user.notifications,
        events: user.events
      };
  },
  fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options);
      return setUser(data);
  }
};

function setUser(data){
  const user = new User()
    user.username = data.username;
    user.email = data.email;
      user.bio = data.bio;
      user.following = data.following;
      user.followers = data.followers;
      user.imageUrl = data.imageUrl;
      user.ownedQuizzes = data.ownedQuizzes
      user.sharedQuizzes = data.sharedQuizzes
      user.ownedFlashcards = data.ownedFlashcards
      user.sharedFlashcards = data.sharedFlashcards
      user.notifications = data.notifications
      user.events = data.events
}

