import AITutor from './aiTutor.js';
import SchedulingSystem from './schedulingSystem.js';
import Flashcard from './flashcard.js';
import Quiz from './quiz.js';

/**
 * Represents a comprehensive study tool that integrates AI-based tutoring,
 * scheduling functionalities, and capabilities to create flashcards and quizzes.
 */
export class StudyTool {
    /**
     * Creates a new StudyTool instance.
     * 
     * @param {AITutor} aiTutor - The AI-based tutor integrated within the study tool.
     * @param {SchedulingSystem} schedulingSystem - The system used for scheduling study sessions.
     */
    constructor(aiTutor, schedulingSystem) {
        this.aiTutor = aiTutor;
        this.schedulingSystem = schedulingSystem;
    }

    /**
     * Creates a new flashcard with a specified term and its definition.
     * 
     * @param {String} term - The term or concept on the flashcard.
     * @param {String} definition - The definition or explanation of the term.
     * @returns {Flashcard} - The newly created flashcard.
     */
    createFlashcard(term, definition) {
        const flashcard = new Flashcard(term, definition);
        // Logic to integrate with the system (if needed)
        console.log(`Flashcard for "${term}" created successfully.`);
        return flashcard;
    }

    /**
     * Creates a new quiz with a list of questions.
     * 
     * @param {List<Question>} questions - The list of questions for the quiz.
     * @returns {Quiz} - The newly created quiz.
     */
    createQuiz(questions) {
        const quiz = new Quiz(questions);
        // Logic to integrate with the system (if needed)
        console.log('Quiz created successfully.');
        return quiz;
    }

    /**
     * Schedules a study session using the integrated scheduling system.
     */
    scheduleStudySession() {
        // Logic to schedule a study session using the schedulingSystem
        this.schedulingSystem.scheduleEvent(new Date(), "Study Session"); // Example logic
        console.log('Study session scheduled successfully.');
    }
}
