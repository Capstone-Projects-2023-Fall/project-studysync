import User from './user.js';

/**
 * Represents a flashcard with a term, definition, owner, and creation date.
 */
export default class Flashcard {
    /**
     * Creates a new Flashcard instance.
     * 
     * @param {string} term - The term or concept on the flashcard.
     * @param {string} definition - The definition or explanation of the term.
     * @param {User} owner - The user who owns or created the flashcard.
     */

    constructor(term, definition, owner) {
        this.term = term;
        this.definition = definition;
        this.owner = owner;
        this.creationDate = new Date();
    }

    /**
     * Views the flashcard's details.
     */
    view() {
        console.log(`Term: ${this.term}\nDefinition: ${this.definition}`);
    }

    /**
     * Allows for editing the term and definition of the flashcard.
     * 
     * @param {string} term - The new term for the flashcard.
     * @param {string} definition - The new definition for the term.
     */
    edit(term, definition) {
        this.term = term;
        this.definition = definition;
        console.log('Flashcard edited successfully.');
    }

    /**
     * Shares the flashcard with a friend.
     * 
     * @param {User} friend - The friend with whom the flashcard is to be shared.
     */
    shareWithFriend(friend) {
        // Logic for sharing the flashcard
        console.log(`Flashcard shared with ${friend.name}.`);
    }
}
