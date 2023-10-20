import {collection, getDocs, query, where,setDoc, doc, updateDoc, arrayRemove, arrayUnion} from 'firebase/firestore';
import User from "../models/user"

/**
 * Utility class to talk to FireStore User Collection [IN PROGRESS]
 */
export class UserRepository{
    constructor(database, quizRepository){
      this.database = database
      this.quizRepository = quizRepository
    }

    /**Add a user to the database for the first time */
    async signUpUser(email, username){
      try{
        const userRef = doc(this.database, "users", email).withConverter(userConverter)
        await setDoc(userRef, new User(email, username))

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

    async getUserOwnedQuizzes(id){
      try{

      }catch(error){

      }
    }

    async getUserSharedQuizzes(id){
      try{

      }catch(error){

      }
    }

    async getUserOwnedFlashcards(id){
      try{

      }catch(error){

      }
    }

    async getUserSharedFlashcards(id){
      try{

      }catch(error){

      }
    }

    async getUserFollowers(id){
      try{

      }catch(error){

      }
    }

    async getUserFollowing(id){
      try{

      }catch(error){

      }
    }

    async getUserFriends(id){
      try{

      }catch(error){

      }
    }

    async getUserNotifications(id){}

    async getUserEvents(id){}

    async getUserBio(id){}
    
    async addFlashcard(id){}

    async addFriend(id){}



    async removeFollower(db, userId, followerId) {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
          followers: arrayRemove(followerId)
      });
    }

    async addSharedQuiz(id){}
    
    async addSharedFlashcard(id){}

    async addOwnedQuiz(id){}

    async addOwnedFlashcard(id) {}

    async addEvent(id){}

    async addNotification(id){}

    async addSubject(uid, newSubject) {  
      try {
        const userRef = doc(this.database, 'users', uid);
        await updateDoc(userRef, {
          subject: arrayUnion(newSubject)
        });
        console.log("Subject added successfully.");
      } catch (error) {
        console.error("Error adding subject:", error);
        throw error;
      }
    }


    /**Given an email, return the user associated with that email */
    async getUserByEmail(email){
      const result = query(collection(this.database, "users"), where("email", "==", email));
      const snapshot = await getDocs(result);

      if(snapshot.size > 1) return "Cannot have two users with the same email"
      else if(snapshot.size === 0) return `User with email ${email} does not exist`

      return snapshot.docs.at(0).data()
    }
  
}


// Firestore data converter[IN PROGRESS]
const userConverter = {
  toFirestore: (user) => {
      return {
        username: user.username,
        email: user.email,
        bio: user.bio,
        following: user.following,
        followers: user.followers,
        friends: user.friends,
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
      user.friends = data.friends;
      user.imageUrl = data.imageUrl;
      user.ownedQuizzes = data.ownedQuizzes
      user.sharedQuizzes = data.sharedQuizzes
      user.ownedFlashcards = data.ownedFlashcards
      user.sharedFlashcards = data.sharedFlashcards
      user.notifications = data.notifications
      user.events = data.events
}

