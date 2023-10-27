
import { getItemById, removeDocumentFromCollection, updateArrayDocumentFields, updateNonArrayDocumentFields, getAllItems, setField, addItemToArrayField } from "../utils/sharedRepositoryFunctions"
import { addDoc, collection, doc, getDoc, updateDoc} from "firebase/firestore"
import {flashcardConverter} from  "../converters/flashcardConverter"
import { UserRepository } from "./UserRepository"

export class FlashCardRepository{
    constructor(database){
        this.database = database
        this.userRepository = new UserRepository(database)
    }

    //Retrive a flashcard by id
    async getFlashcardSet(id){
        const flashCardSet = await getItemById(this.database, id, "flashcardSets", "flashcardSet")
        return flashCardSet
    }

    //Retrieve all flashcard sets
    async getAllFlashcardsSets(){
        return await getAllItems(this.database, "flashcardSets", flashcardConverter)
    }

    //add a flashcard set to the flashcard table
    async addFlashCardSet(flashcardSet){
        try{
            const flashcardCollection = collection(this.database, "flashcardSets")
            const flashcardRef = await addDoc(flashcardCollection, flashcardSet.toJSON())
            await setField(this.database, flashcardRef.id, "flashcardSets","id", flashcardRef.id)
            /**whenever we create a flashcard, we add it to the list of flashcards for the user
            who created it */
            await this.userRepository.addOwnedFlashcard(flashcardSet.authorId, flashcardRef.id)
            return flashcardRef.id
        }catch(error){
            console.log("error adding flashcard set", error)
        }
    }

    //add a new card to flashcardSet with id: {setId}
    async addCardtoFlashcardSet(setId, cardToAdd){
        try{
            const ref= doc(this.database, "flashcardSets", setId);
            const item = await getDoc(ref);
            const cards = item.data().flashcardItems;

            cards.push(cardToAdd.toJSON())
    
            await updateDoc(ref, {
                flashcardItems : cards
            })

        }catch(error){
            console.log("err while adding card to set with id: ", setId)
            throw error
        }
    }

    //given a flashcard wit id: {setId}, delete a card with id {cardToDeleteId}
    async deleteCardFromFlashcardSet(setId, cardToDeleteId){
        const ref= doc(this.database, "flashcardSets", setId);
        const item = await getDoc(ref);
        const cards = item.data().flashcardItems;

        await updateDoc(ref, {
            flashcardItems : cards.filter(curr=>curr.id !== cardToDeleteId)
        })
    }

     //delete set with id: {setId} from collection
     async deleteFlashcardSet(setId){
        await removeDocumentFromCollection(this.database, setId, "flashcardSets", "flashcardSet")
    }

    //add user with id: userId to the shared with list of flashcard set with id: flashcardId
    async addToSharedWith(flashCardId, userId){
        await addItemToArrayField(this.database, flashCardId, userId, "flashcardSets", "sharedWith", "sharedWith")
    }

    //update one or more non-array field by passing in object
    async updateNonArrayFlashcardSetFields(id, toUpdate){
        await updateNonArrayDocumentFields(this.database, id, "flashcardSets", toUpdate)
    }

    //update one or more array fields by passing in object
    async updateArrayFlashcardSetFields(id, toUpdate){
        await updateArrayDocumentFields(this.database, id, "flashcardSets", toUpdate)
    }

    //Given a list of flashcard ids, get the actual object representation of those flashcards
    async getFlashcards(flashcardIds){
        const flashcards = []
        for(const id of flashcardIds){
            const set = await this.getFlashcardSet(id)
            flashcards.push(set)
        }
        return flashcards
    }
}


