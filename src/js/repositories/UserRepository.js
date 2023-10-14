import {collection, getDocs} from 'firebase/firestore';
import {User} from "../models/user"
export class UserRepository{
    constructor(database, quizRepository){
      this.database = database
      this.ref = collection(this.database, "users")
      this.snapshot = null;
      this.initializationPromise = this.initializeSnapshot();
      this.quizRepository = quizRepository
    }
  
    async initializeSnapshot() {
      try {
          this.snapshot = await this.getSnapshot();
      } catch (error) {
          console.error("Error while initializing snapshot: ", error);
          throw error;
      }
    }
  
    async getSnapshot() {
        return await getDocs(this.ref, "users");
    }
  
    async getAllUsers(){
      const usersMap = await this.getUserMap()
      return Object.values(usersMap)
    }
  
    async getUserMap(){
      await this.initializationPromise;
      const users = {}
      this.snapshot.docs.forEach((doc)=>{
        const user = doc.data()
        users[doc.id] = new User(user.email, user.password, doc.id)
      })
      return users
    }
  
    async getUserById(id){
      await this.initializationPromise;
      const users = await this.getUserMap()
      if(users[id] !== null && users[id] !== undefined) return users[id]
      return "DOES NOT EXIST"
    }
  
  
    async getUserQuizes(id){
      const quizes = await this.quizRepository.getAllQuizes()
      const userQuizes = []
      quizes.forEach((quiz)=>{
        if(quiz.author === id){
          userQuizes.push(quiz)
        }
      })
      return userQuizes
    }
}