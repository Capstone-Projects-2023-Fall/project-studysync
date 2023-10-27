import {collection, getDocs} from 'firebase/firestore';
import Quiz from "../models/quiz"

/**
 * Utility class to talk to FireStore Quiz Collection [IN PROGRESS]
 */
export class QuizRepository{
    constructor(database){
        this.database = database
        this.ref = collection(this.database, "quizzes")
        this.snapshot = null;
        this.initializationPromise = this.initializeSnapshot();
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
        return await getDocs(this.ref, "quizzes");
    }
  
    async getAllQuizes(){
      const quizMap = await this.getQuizMap()
      return Object.values(quizMap)
    }

    async getQuizMap(){
      await this.initializationPromise;
      const quizes = {}
      this.snapshot.docs.forEach((doc)=>{
        const quiz = doc.data()
        quizes[doc.id] = new Quiz(quiz.title, quiz.question, 
          doc.id, quiz.subject, quiz.author, quiz.dateCreated, quiz.time)
      })
      return quizes
    }

    async getQuizById(id){
        await this.initializationPromise;
        const quizes = await this.getUserMap()
        if(quizes[id] !== null && quizes[id] !== undefined) return quizes[id]
        return "DOES NOT EXIST"
    }
  }