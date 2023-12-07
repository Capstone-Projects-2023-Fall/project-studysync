import Quiz from "../models/quiz";
import {
  collection,
  getDocs,
  getDoc,
  query,
  where,
  setDoc,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  Timestamp,
  arrayRemove,
} from "firebase/firestore";
import { getItemById, getAllItems } from "../utils/sharedRepositoryFunctions";

/**
 * Utility class to talk to FireStore Quiz Collection [IN PROGRESS]
 */
/**
 * @class QuizRepository
 * @classdesc QuizRepository - Manages quiz-related data interactions with the database.
 * 
 * @param {Object} database - The database connection used for accessing quiz data.
 */
export class QuizRepository {
  constructor(database) {
    this.database = database;
    this.ref = collection(this.database, "quizzes");
    this.snapshot = null;
    this.initializationPromise = this.initializeSnapshot();
  }
  /**
     * @memberof QuizRepository
     * @function getAll_Quizes
     * @description Retrieves all quizzes from the database.
     * @returns {Promise<Array<Object>>} A promise that resolves to an array of quiz objects.
     */
  async getAll_Quizes() {
    return await getAllItems(this.database, "quizzes", null);
  }

  //Updated version
  /**
   * @memberof QuizRepository
   * @function get_AllQuizzes
   * @description Retrieves all quizzes from the 'quizzesCreation' collection in the database.
   * @returns {Promise<Array<Object>>} A promise that resolves to an array of quiz objects.
   */
  async get_AllQuizzes() {
    const collectionRef = collection(this.database, "quizzesCreation");
    try {
      const querySnapshot = await getDocs(collectionRef);
      const documents = querySnapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      return documents;
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  }
  //Updated version
  /**
   * @memberof QuizRepository
   * @function get_QuizById
   * @description Retrieves a quiz by its ID from the 'quizzesCreation' collection.
   * @param {string} id - The ID of the quiz to retrieve.
   * @returns {Promise<Object>} A promise that resolves to the quiz object.
   */
  async get_QuizById(id) {
    const flashcardSets = await this.get_AllQuizzes();
    for (const flashcardSet of flashcardSets) {
      if (flashcardSet.id == id) return flashcardSet;
    }
    throw new Error(`Quiz with id: ${id} does not exist`);
  }
  /**
     * @memberof QuizRepository
     * @function getQuizBy_Id
     * @description Retrieves a quiz by its ID from the 'quizzes' collection.
     * @param {string} quizId - The ID of the quiz to retrieve.
     * @returns {Promise<Object>} A promise that resolves to the quiz object.
     */
  async getQuizBy_Id(quizId) {
    return await getItemById(this.database, quizId, "quizzes", "user");
  }
  /**
     * @memberof QuizRepository
     * @function initializeSnapshot
     * @description Initializes the snapshot of the quiz collection.
     * @returns {Promise<void>}
     */
  async initializeSnapshot() {
    try {
      this.snapshot = await this.getSnapshot();
    } catch (error) {
      console.error("Error while initializing snapshot: ", error);
      throw error;
    }
  }
  /**
     * @memberof QuizRepository
     * @function getSnapshot
     * @description Retrieves the snapshot of the quiz collection.
     * @returns {Promise<Object>} A promise that resolves to the snapshot object.
     */
  async getSnapshot() {
    return await getDocs(this.ref, "quizzes");
  }
  /**
     * @memberof QuizRepository
     * @function getAllQuizes
     * @description Retrieves all quizzes as a mapped object.
     * @returns {Promise<Array<Object>>} A promise that resolves to an array of quiz objects.
     */
  async getAllQuizes() {
    const quizMap = await this.getQuizMap();
    return Object.values(quizMap);
  }
  /**
     * @memberof QuizRepository
     * @function getQuizMap
     * @description Retrieves a map of quizzes from the snapshot.
     * @returns {Promise<Object>} A promise that resolves to a map of quiz objects.
     */
  async getQuizMap() {
    await this.initializationPromise;
    const quizes = {};
    this.snapshot.docs.forEach((doc) => {
      const quiz = doc.data();
      quizes[doc.id] = new Quiz(
        quiz.title,
        quiz.question,
        doc.id,
        quiz.subject,
        quiz.author,
        quiz.dateCreated,
        quiz.time
      );
    });
    return quizes;
  }
  /**
     * @memberof QuizRepository
     * @function getQuizById
     * @description Retrieves a quiz by its ID.
     * @param {string} id - The ID of the quiz to retrieve.
     * @returns {Promise<Object>} A promise that resolves to the quiz object or a string indicating it does not exist.
     */
  async getQuizById(id) {
    await this.initializationPromise;
    const quizes = await this.getUserMap();
    if (quizes[id] !== null && quizes[id] !== undefined) return quizes[id];
    return "DOES NOT EXIST";
  }

  //function to deleteQuiz using the captured quiz.id in order to remove the specifc quiz
  /**
   * @memberof QuizRepository
   * @function deleteQuiz
   * @description Deletes a quiz from the database using its ID.
   * @param {string} quizId - The ID of the quiz to be deleted.
   * @returns {Promise<void>}
   */
  async deleteQuiz(quizId) {
    const quizDocRef = doc(this.ref, quizId); // Reference to the specific quiz document
    try {
      await deleteDoc(quizDocRef);
    } catch (error) {
      console.error("Error deleting quiz:", error);
      throw error;
    }
  }
}
