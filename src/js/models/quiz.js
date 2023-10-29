export default class Quiz {
    constructor(authorId, name= 'Untitled Quiz', flashCardId = '', quizItems = [], id='') {
        this.authorId = authorId;
        this.quizItems = quizItems
        this.id = id;
        this.createdAt = new Date().getTime()
        this.sharedWith = []
        this.flashCardId = flashCardId
        this.name = name
    }

    toJSON(){
        return {
            name: this.name,
            authorId: this.authorId,
            createdAt : this.createdAt,
            flashcardId: this.flashCardId,
            sharedWith: this.sharedWith,
            id: this.id,
            quizItems: this.quizItems
        }
    }
}

export class QuizItem{
    constructor(question, choices, answerIndex){
        this.question = question //The question. Based off the flashcard item
        this.choices = choices  //Array of 4 possible choices
        this.answerIndex = answerIndex //Index of the correct answer
    }
}