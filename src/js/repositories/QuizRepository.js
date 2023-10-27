import {collection, getDocs} from 'firebase/firestore';
import Quiz from "../models/quiz"

/**
 * Utility class to talk to FireStore Quiz Collection [IN PROGRESS]
 */
export class QuizRepository{
    constructor(database){
        this.database = database
    }
}