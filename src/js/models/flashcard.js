const { v4: uuidv4 } = require('uuid');
/**
 * Represents a flashcard with a term, definition, owner, and creation date.
*/
export class FlashcardSet {
    constructor(name ='',authorId='', flashcardItems = [], id=''){
        this.name = name
        this.flashcardItems = flashcardItems
        this.authorId = authorId
        this.id = id
        this.createdAt = new Date().getTime()
        this.sharedWith = []
    }
    toJSON(){
        return {
            name:this.name,
            authorId: this.authorId,
            flashcardItems: this.flashcardItems.map(item => item.toJSON()),
            createdAt: this.createdAt,
            sharedWith: this.sharedWith
        }
    }
}

export class FlashcardItem{
    constructor(question='', answer=''){
        this.question = question
        this.answer = answer
        this.id = uuidv4()
    }
    toJSON() {
        return {
            question: this.question,
            answer: this.answer
        };
    }
}