import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FlashcardRepo from '../js/repositories/FlashcardRepo';
import QuizList from '../js/react/QuizList'; // Import the component containing handleEditQuizTitle
import { handleEditQuizTitle } from '../Tests/QuizListUtil';

jest.mock('../js/repositories/FlashcardRepo');

describe('handleEditQuizTitle', () => {
  test('it should edit quiz title', async () => {
    // Mocked data
    const setId = 'someSetId';
    const currentlyEditingTitle = 'Old Quiz Title';
    const editedTitle = 'New Quiz Title';
    const quizId = 'someQuizId';

    // Mock FlashcardRepo functions
    FlashcardRepo.getQuizTitleId.mockResolvedValue(quizId);
    FlashcardRepo.updateQuizTitle.mockResolvedValue(); 

    // Mock state and functions
    const setQuizList = jest.fn();
    const setCurrentlyEditingTitle = jest.fn();
    const setEditedTitle = jest.fn();
    const setIsDrawerOpen = jest.fn();
    const handleCloseEditDialog = jest.fn();

    // Render the QuizList component
    render(
      <QuizList
        setQuizList={setQuizList}
        setCurrentlyEditingTitle={setCurrentlyEditingTitle}
        setEditedTitle={setEditedTitle}
        setIsDrawerOpen={setIsDrawerOpen}
        handleCloseEditDialog={handleCloseEditDialog}
      />
    );

    // Trigger handleEditQuizTitle
    await act(async () => {
      await handleEditQuizTitle(
        editedTitle,
        currentlyEditingTitle,
        setId,
        // Pass any other necessary parameters...
      );
    });

    // Assertions
    expect(FlashcardRepo.getQuizTitleId).toHaveBeenCalledWith(currentlyEditingTitle, setId);
    expect(FlashcardRepo.updateQuizTitle).toHaveBeenCalledWith(quizId, editedTitle.trim());
    expect(setQuizList).toHaveBeenCalledWith([editedTitle.trim()]); // Assuming quizList is an array
    expect(setCurrentlyEditingTitle).toHaveBeenCalledWith(null);
    expect(setEditedTitle).toHaveBeenCalledWith('');
    expect(setIsDrawerOpen).toHaveBeenCalledWith(true);
    expect(handleCloseEditDialog).toHaveBeenCalled();
  });
});
