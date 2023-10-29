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
            flashCardId: this.flashCardId,
            sharedWith: this.sharedWith,
            id: this.authorId,
            quizItems: this.quizItems
        }
    }
}

export class QuizItem{

    //correct choice index is populated by default
    constructor(question){
        this.question = question //The question. Based off the flashcard item
        this.choices = ['','','',''] //Array of 4 possible choices, we populate correct choice by default, other choices must be manually added
        this.answerIndex = Math.floor(Math.random() * 4) //Index of the correct answer [random int between 0 and 3]
    }

    toJSON(){
        return{
            question: this.question,
            choices: this.choices,
            answerIndex: this.answerIndex
        }
    }
}