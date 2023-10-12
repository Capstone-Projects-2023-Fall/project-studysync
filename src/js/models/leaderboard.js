import Quiz from './quiz.js'; //to get score for leaderboard

/**
 * Represents a leaderboard that maintains a list of quiz scores.
 */
export  default class Leaderboard {
    /**
     * Creates a new Leaderboard instance.
     */
    constructor() {
        this.quizScores = []; // List<Score>
    }

    /**
     * Updates the leaderboard, typically by sorting or refreshing based on new scores.
     */
    update() {
        // Logic to update the leaderboard
        console.log('Leaderboard updated.');
    }
}
