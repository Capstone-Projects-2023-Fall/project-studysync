import User from './user.js';
import Flashcard from './flashcard.js';
import Quiz from './quiz.js';
import Event from './event.js';

/**
 * Represents a user's dashboard with functionalities to manage and display 
 * upcoming events, recent flashcards, and quizzes.
 */
export default class Dashboard {
    /**
     * Creates a new Dashboard instance for a given user.
     * 
     * @param {User} user - The user associated with the dashboard.
     */
    constructor(user) {
        this.user = user;
        this.upcomingEvents = []; //List<Event>
        this.recentQuizzes = []; //List<Quiz>
        this.recentFlashcards = []; //List<Flashcard>
    }



/**
     * Fetches all upcoming events.
     * 
     * @returns {Event[]} - A list of upcoming events.
     */
viewUpcomingEvents() {
    return this.upcomingEvents;
}



/**
 * Allows the user to take a specified quiz based on its ID.
 * 
 * @param {int} quizID - The ID of the quiz to be taken.
 * @returns {quizResult} - The result of the quiz taken.
 */
takeQuiz(quizID) {
    const quiz = this.recentQuizzes.find(q => q.id === quizID);
    if (quiz) {
        // Logic to take the specified quiz
        console.log(`Starting quiz: ${quiz.name}`);
        // Placeholder for the quiz result. Adjust accordingly.
        let quizResult = {
            score: 0,
            totalQuestions: 0
        };
        return quizResult;
    } else {
        console.log(`Quiz not found in recent quizzes.`);
        return null;
    }
}

/**
 * Allows the user to study a specific flashcard based on its ID.
 * 
 * @param {int} flashcardID - The ID of the flashcard to be studied.
 */
studyFlashcard(flashcardID) {
    const flashcard = this.recentFlashcards.find(f => f.id === flashcardID);
    if (flashcard) {
        // Logic to study the specified flashcard
        console.log(`Studying flashcard: ${flashcard.term}`);
    } else {
        console.log(`Flashcard not found in recent flashcards.`);
    }
}
}