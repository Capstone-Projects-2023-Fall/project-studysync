import { getItemById, removeDocumentFromCollection, collection } from "../utils/sharedRepositoryFunctions"
import { FlashCardRepository } from "./FlashCardRepository"
/**
 * Utility class to talk to FireStore Quiz Collection [IN PROGRESS]
 */
export class QuizRepository{
    constructor(database){
        this.database = database
        this.flashcardRepository = new FlashCardRepository(database)
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
    async getAllQuizzes(){
        return await getAllItems(this.database, "quizzes")
    }

    /** TODO: Create  new quiz based on flashcardId. 
     * quiz param represents the quiz we wish to create
    */
    async createQuiz(quiz){
      try{
        const flashcardCollection = collection(this.database, "flashcardSets")
        const flashcardRef = await addDoc(flashcardCollection, flashcardSet.toJSON())
        await setField(this.database, flashcardRef.id, "flashcardSets","id", flashcardRef.id)
        /**whenever we create a flashcard, we add it to the list of flashcards for the user
        who created it */
        await this.userRepository.addOwnedFlashcard(flashcardSet.authorId, flashcardRef.id)
        return flashcardRef.id
    }catch(error){
        console.log("error adding flashcard set", error)
    }
    }
}
