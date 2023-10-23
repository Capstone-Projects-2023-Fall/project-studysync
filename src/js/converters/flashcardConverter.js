import { FlashcardSet } from "../models/flashcard";
export const flashcardConverter = {
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
  