import React from 'react';
import { render, fireEvent, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EditQuizDialog from '../Tests/EditQuizTitle';
import QuizList from '../Tests/FetchQuizLists';
import FetchQuestions from '../Tests/FetchQuestions';
import UpdateQuestions from '../Tests/UpdateQuestions';
import FlashcardRepo from '../js/repositories/FlashcardRepo';

// mock the module containing the database fetch logic
jest.mock('../js/repositories/FlashcardRepo');

describe('QuizList Component', () => {
    it('updates the quiz title', () => {
        const handleClose = jest.fn();
        const onEditQuizTitle = jest.fn();

        const { getByText, getByLabelText } = render(
            <EditQuizDialog
            isOpen={true}
            handleClose={handleClose}
            initialQuizTitle="Initial Title"
            onEditQuizTitle={onEditQuizTitle}
            />
    );

        // check if the component renders with the correct title
        expect(getByText('Edit Quiz Title')).toBeInTheDocument();

        // check if the text field is rendered with the initial quiz title
        const textField = getByLabelText('Enter a New Quiz Title');
        expect(textField).toBeInTheDocument();
        expect(textField).toHaveValue('Initial Title');

        // Check if Cancel and Save buttons are present
        expect(getByText('Cancel')).toBeInTheDocument();
        expect(getByText('Save')).toBeInTheDocument();

        fireEvent.change(textField, { target: { value: 'New Title' } });
        fireEvent.click(getByText('Save'));

        expect(onEditQuizTitle).toHaveBeenCalledWith('New Title');
        expect(handleClose).toHaveBeenCalled();
        });

    it('fetches and displays quiz titles', async () => {
        const mockQuizData = ['Quiz 1', 'Quiz 2'];

        FlashcardRepo.getQuizTitleFromFlashcardSet.mockResolvedValue(mockQuizData);

        // render the component
        let container;
        await act(async () => {
        container = render(<QuizList setId={1} quizId={2} navigate={() => {}} newQuizAdded={null} />);
        });

        // wait for the asynchronous operation to complete
        // this is important when dealing with asynchronous code inside useEffect
        await act(async () => {});

        // assert that the component renders the fetched quiz titles
        mockQuizData.forEach(quizTitle => {
        expect(container.getByText(quizTitle)).toBeInTheDocument();
        });
    });
});

describe('Quiz Component', () => {
    
      it('does not add a question when input is invalid', async () => {
        // mock the implementation of addQuizQuestion to simulate a failure
        FlashcardRepo.addQuizQuestion.mockRejectedValue(new Error('Invalid input'));
    
        // render the component
        const { getByText } = render(<FetchQuestions quizId={1} setQuizData={() => {}} />);
        await act(async () => {
          fireEvent.click(getByText('Add Question'));
        });

        expect(FlashcardRepo.addQuizQuestion).not.toHaveBeenCalled();
      });

      it('should confirm deletion', async () => {
        const mockEditQuestion = {
            questionId: 1,
            question: 'Old question',
            choices: ['Choice A', 'Choice B', 'Choice C', 'Choice D'],
            correctChoiceIndex: 0,
          };
        
          const mockQuestions = [
            { questionId: 1, question: 'Question 1', choices: ['A', 'B', 'C', 'D'], correctChoiceIndex: 2 },
            { questionId: 2, question: 'Question 2', choices: ['A', 'B', 'C', 'D'], correctChoiceIndex: 1 },
            // ...
          ];
        
          const mockSetQuizData = jest.fn();
          const mockSetOpenEdit = jest.fn();
          const mockSetEditQuestion = jest.fn();
        
          const { getByLabelText, getByText } = render(
            <UpdateQuestions
              quizId={1}
              editQuestion={mockEditQuestion}
              questions={mockQuestions}
              setQuizData={mockSetQuizData}
              setOpenEdit={mockSetOpenEdit}
              setEditQuestion={mockSetEditQuestion}
            />
          );
        
          fireEvent.change(getByLabelText('Question'), { target: { value: 'New question' } });
          fireEvent.click(getByText('Update Question'));
        
          await waitFor(() => {
            expect(mockSetQuizData).toHaveBeenCalled();
            expect(mockSetOpenEdit).toHaveBeenCalledWith(false);
            expect(mockSetEditQuestion).toHaveBeenCalledWith(null);
          });
        });
});
