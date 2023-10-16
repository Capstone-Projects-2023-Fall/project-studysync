import {collection, getDocs, query, where,setDoc, doc} from 'firebase/firestore';
import User from "../models/user"

/**
 * Utility class to talk to FireStore User Collection [IN PROGRESS]
 */
export class UserRepository{
    constructor(database, quizRepository){
      this.database = database
      this.quizRepository = quizRepository
    }

    async signUpUser(user){
      try{
        await setDoc(doc(this.database, "users", user.email), {
          email: user.email,
          password: user.password,
          quizes: user.quizzes
        });
        console.log('Successfully added user to database',user.email);
      }catch(error){
        console.log("error adding user", error)
      }
    }
  
    async getAllUsers(){
      const usersMap = await this.getUserMap()
      return Object.values(usersMap)
    }
  
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
  
    async getUserById(id){
      const result = query(collection(this.database, "users"), where("id", "==", id));
      const snapshot = await getDocs(result);

      if(snapshot.size > 1) return "Cannot have two users with the same id"
      else if(snapshot.size === 0) return `User with id ${id} does not exist`

      return snapshot.docs.at(0).data()
    }



    async getUserByEmail(email){
      const result = query(collection(this.database, "users"), where("email", "==", email));
      const snapshot = await getDocs(result);

      if(snapshot.size > 1) return "Cannot have two users with the same email"
      else if(snapshot.size === 0) return `User with email ${email} does not exist`

      return snapshot.docs.at(0).data()
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


// Firestore data converter[IN PROGRESS]
const userConverter = {
  toFirestore: (user) => {
      return {
        email: user.email,
        password: user.password,
        quizes: user.quizes
          };
  },
  fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options);
      const user = new User(data.email, data.password);
      user.quizzes = data.quizes
      user.id = snapshot.id
      return user;
  }
};