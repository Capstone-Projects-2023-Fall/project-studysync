import FlashcardRepo from '../repositories/FlashcardRepo';

class FlashcardSetHandler {
  async handleOpenGenerateAI(setId, setOpenGenerateAI, setFlashcardSetName, setFlashcardSubject) {
    setOpenGenerateAI(true);

    try {
      // retrieve the flashcard set topic name
      const flashcardSet = await FlashcardRepo.getFlashcardSetById(setId);

      // set the state variables accordingly
      setFlashcardSetName(flashcardSet.name);
      setFlashcardSubject(flashcardSet.subject);
    } catch (error) {
      console.error('Error fetching flashcard set:', error);
    }
  }
}

export default FlashcardSetHandler;