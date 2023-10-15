
import Question from './question.js';
import User from './user.js';
import {Score} from './score.js';

/**
 * Represents a quiz containing a list of questions, associated with an owner and having a creation date.
 */
export class Quiz {
    /**
     * Creates a new Quiz instance.
     * 
     * @param {List<Question>} question - List of questions that make up the quiz.
     * @param {User} owner - The user who created or owns the quiz.
     */
    constructor(author, question, id) {
        this.question = question;
        this.author = author;
        this.id = id;
        this.creationDate = new Date();
    }

// import Question from './question.js';
// import User from './user.js';
// import Score from './score.js';

// /**
//  * Represents a quiz containing a list of questions, associated with an owner and having a creation date.
//  */
// export class Quiz {
//     /**
//      * Creates a new Quiz instance.
//      * 
//      * @param {List<Question>} question - List of questions that make up the quiz.
//      * @param {User} owner - The user who created or owns the quiz.
//      */
//     constructor(question, owner) {
//         this.question = question;
//         this.owner = owner;
//         this.creationDate = new Date();
//     }


//     /**
//      * Allows a user to take the quiz.
//      */
//     takeQuiz() {
//         // Logic to start or take the quiz
//         console.log('Starting the quiz...');
//     }

//     /**
//      * Edits the questions of the quiz.
//      * 
//      * @param {List<Question>} question - The new list of questions for the quiz.
//      */
//     edit(question) {
//         this.question = question;
//         console.log('Quiz edited successfully.');
//     }

//     /**
//      * Displays the results after taking the quiz.
//      * 
//      * @returns {Score} - The score obtained after taking the quiz.
//      */
//     viewResults() {
//         // Placeholder logic to fetch the score. Adjust accordingly.
//         let obtainedScore = new Score(); // Example instantiation
//         return obtainedScore;
//     }

//     /**
//      * Shares the quiz with a friend.
//      * 
//      * @param {User} friend - The friend with whom the quiz is to be shared.
//      */
//     shareWithFriend(friend) {
//         // Logic to share the quiz
//         console.log(`Quiz shared with ${friend.name}.`);
//     }
// }
