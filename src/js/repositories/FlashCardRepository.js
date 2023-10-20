import { FlashcardSet } from "../models/flashcard"
import { getItemById, removeDocumentFromCollection, getAllItems, setField, addItemToArrayField } from "../utils/sharedRepositoryFunctions"
import { addDoc, collection, doc, setDoc } from "firebase/firestore"

export class FlashCardRepository{
    constructor(database){
        this.database = database
    }

    //Retrive a flashcard by id
    async getFlashcardSet(id){
        const flashCardSet = await getItemById(this.database, id, "flashcardSets", "flashcardSet")
        return flashCardSet
    }

    //add a flashcard set to the flashcard table
    async addFlashCard(flashcardSet){
        try{
            console.log("json: ", flashcardSet.toJSON())
            const flashcardCollection = collection(this.database, "flashcardSets")
            const flashcardRef = await addDoc(flashcardCollection, flashcardSet.toJSON())
            await setField(this.database, flashcardRef.id, "flashcardSets","id", flashcardRef.id)
            return flashcardRef.id
        }catch(error){
            console.log("error adding flashcard set", error)
        }
    }

    async deleteCardFromFlashcardSet(setId, itemId){
        
    }

    //add user with id: userId to the shared with list of flashcard set with id: flashcardId
    async addToSharedWith(flashCardId, userId){
        await addItemToArrayField(this.database, flashCardId, userId, "flashcardSets", "sharedWith", "sharedWith")
    }
}

const flashcardConverter = {
    toFirestore: (flashcard) => {
        return {
            authorId: flashcard.authorId,
            flashcardItems: flashcard.flashcardItems,
            createdAt: flashcard.createdAt
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        data.id = snapshot.id
        return setFlashcard(data);
    }
};
  
function setFlashcard(data){
    const flashcard= new FlashcardSet(data.name, data.authorId);
    flashcard.flashcardItems = data.flashcardItems
    flashcard.id = data.id
    flashcard.createdAt = data.createdAt || ''
    return flashcard
}
  