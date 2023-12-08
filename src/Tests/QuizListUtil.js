
import FlashcardRepo from '../js/repositories/FlashcardRepo';

const handleEditQuizTitle = async (editedTitle, currentlyEditingTitle, setId, quizList, setQuizList, setCurrentlyEditingTitle, setEditedTitle, setIsDrawerOpen, handleCloseEditDialog) => {
  console.log('Rename is clicked!');

  if (editedTitle.trim() === "" || !currentlyEditingTitle) {
    console.log('Empty edited name or no topic being edited, exiting');
    return;
  }

  try {
    const quizId = await FlashcardRepo.getQuizTitleId(currentlyEditingTitle, setId);
    console.log('Quiz ID by quiz title:', quizId);

    // Update the Firebase database
    await FlashcardRepo.updateQuizTitle(quizId, editedTitle.trim());

    // Update the local state
    const updatedQuizTitle = quizList.map(t => t === currentlyEditingTitle ? editedTitle.trim() : t);
    console.log('Updated Quiz Title:', updatedQuizTitle);

    setQuizList(updatedQuizTitle);

    setCurrentlyEditingTitle(null);
    setEditedTitle('');
    setIsDrawerOpen(true); // keep the drawer open

  } catch (error) {
    console.error("Error editing flashcard set name:", error);
  }
  handleCloseEditDialog();
};

export { handleEditQuizTitle };
