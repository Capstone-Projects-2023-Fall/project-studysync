import User from './user.js';

/**
 * Represents a user's score, capturing details such as obtained marks and total marks.
 */
export default class Score {
    /**
     * Creates a new Score instance.
     * 
     * @param {User} user - The user associated with the score.
     * @param {int} obtainedMarks - The marks obtained by the user.
     * @param {int} totalMarks - The total marks available for the assessment.
     */
    constructor(user, obtainedMarks, totalMarks) {
        this.user = user;
        this.obtainedMarks = obtainedMarks;
        this.totalMarks = totalMarks;
    }

    /**
     * Calculates and returns the percentage of marks obtained.
     * 
     * @returns {float} - The percentage of marks obtained.
     */
    calculatePercentage() {
        const percentage = (this.obtainedMarks / this.totalMarks) * 100;
        return parseFloat(percentage.toFixed(2)); // Rounded to two decimal places
    }
}
