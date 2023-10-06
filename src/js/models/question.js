/**
 * Represents a question with associated choices and a correct answer.
 */
export class Question {
    /**
     * Creates a new Question instance.
     * 
     * @param {List<Question>} question - The question text or list of questions.
     * @param {List<String>} choice - The list of choices for the question.
     * @param {string} correctAnswer - The correct answer for the question.
     */
    constructor(question, choice, correctAnswer) {
        this.question = question;
        this.choice = choice;
        this.correctAnswer = correctAnswer;
    }

    /**
     * Views the question and its associated choices.
     * 
     * @returns {string} - A string representation of the question and choices.
     */
    view() {
        let display = `Question: ${this.question}\nChoices:\n`;
        this.choice.forEach((c, index) => {
            display += `${index + 1}. ${c}\n`;
        });
        return display;
    }

    /**
     * Checks if the provided choice matches the correct answer.
     * 
     * @param {string} choice - The chosen answer to be checked.
     * @returns {Boolean} - True if the choice is correct, otherwise false.
     */
    checkAnswer(choice) {
        return this.correctAnswer === choice;
    }
}
