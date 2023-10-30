import Quiz from "../models/quiz"
import { getItemById, removeDocumentFromCollection, setField, getAllItems } from "../utils/sharedRepositoryFunctions"
import { FlashCardRepository } from "./FlashCardRepository"
import { UserRepository } from "./UserRepository"
import { addDoc, setDoc, collection, doc, getDoc, updateDoc} from "firebase/firestore"
import { QuizItem } from "../models/quiz"

/**
 * Utility class to talk to FireStore Quiz Collection [IN PROGRESS]
 */
export class QuizRepository{
    constructor(database){
        this.database = database
        this.flashcardRepository = new FlashCardRepository(database)
        this.userRepository = new UserRepository(database)
    }

    /** Given a quiz id, fetch the quiz object */
    async getQuizByid(id){
        return await getItemById(this.database, id, "quizzes", "quiz")
    }

    /** Given a quiz id, delete that quiz */
    async deleteQuizById(id){
        return await removeDocumentFromCollection(this.database, id, "quizzes", "quiz")
    }

    /** Get all quizzes in the database */
    async getAllQuizes(){
        return await getAllItems(this.database, "quizzes")
    }

    /** Create  new quiz based on flashcardId. */
    async createQuiz(userId, flashcardSetId){
      try{
        const flashcardSet = await this.flashcardRepository.getFlashcardSet(flashcardSetId)
        const flashcardItems = flashcardSet.flashcardItems
         
        console.log("flashcard set is: ", flashcardSet)
        console.log("items is: ", flashcardItems)
        
        const newQuiz = new Quiz(userId, flashcardSet.name, flashcardSet.id, []);
        for(const flashcardItem of flashcardItems){
          const quizItem = new QuizItem(flashcardItem.question)

          console.log("quizItem:", quizItem);
          quizItem.choices[quizItem.answerIndex] = flashcardItem.answer
          newQuiz.quizItems.push(quizItem.toJSON())
        }

        console.log("new quiz: ", newQuiz)

        const quizCollection = collection(this.database, "quizzes")
        console.log("new quiz to json is: ", newQuiz.toJSON())
        const quizRef = await addDoc(quizCollection, newQuiz.toJSON())
        console.log("id is: ", quizRef.id)
        await setField(this.database, quizRef.id, "quizzes","id", quizRef.id)
        
        /**whenever we create a quiz, we add it to the list of quizzes for the user
            who created it */
        this.userRepository.addOwnedQuiz(userId, quizRef.id)
        return quizRef.id
        
        
      }catch(error){
          console.log("error creating quiz", error)
      }
    }

    /**For each quiz question, the right answer choice is added by  by default
     * We still need to add three more invalid answer choices. Pass in an array 
     * with three strings representing the invalid choices and they will be aded to
     * the list of choices by default
    */
    async addWrongChoicesToQuizQuestion(quizId){

      const quiz = await this.getQuizByid(quizId)
      //TODO: Will complete soon
    }
}
