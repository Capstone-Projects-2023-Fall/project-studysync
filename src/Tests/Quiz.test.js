import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EditQuizDialog from '../Tests/EditQuizTitle';
import QuizList from '../Tests/FetchQuizList';
import FlashcardRepo from '../js/repositories/FlashcardRepo';

// Mock the module containing the database fetch logic
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

        // Check if the component renders with the correct title
        expect(getByText('Edit Quiz Title')).toBeInTheDocument();

        // Check if the text field is rendered with the initial quiz title
        const textField = getByLabelText('Enter a New Quiz Title');
        expect(textField).toBeInTheDocument();
        expect(textField).toHaveValue('Initial Title');

        // Check if Cancel and Save buttons are present
        expect(getByText('Cancel')).toBeInTheDocument();
        expect(getByText('Save')).toBeInTheDocument();

        // Simulate user interaction: change text field value
        fireEvent.change(textField, { target: { value: 'New Title' } });

        // Simulate user interaction: click Save button
        fireEvent.click(getByText('Save'));

        // Check if onEditQuizTitle and handleClose are called with the correct arguments
        expect(onEditQuizTitle).toHaveBeenCalledWith('New Title');
        expect(handleClose).toHaveBeenCalled();
        });

    it('fetches and displays quiz titles', async () => {
        const mockQuizData = ['Quiz 1', 'Quiz 2'];

        // Mock the implementation of getQuizTitleFromFlashcardSet
        FlashcardRepo.getQuizTitleFromFlashcardSet.mockResolvedValue(mockQuizData);

        // Render the component
        let container;
        await act(async () => {
        container = render(<QuizList setId={1} quizId={2} navigate={() => {}} newQuizAdded={null} />);
        });

        // Wait for the asynchronous operation to complete
        // This is important when dealing with asynchronous code inside useEffect
        await act(async () => {});

        // Assert that the component renders the fetched quiz titles
        mockQuizData.forEach(quizTitle => {
        expect(container.getByText(quizTitle)).toBeInTheDocument();
        });
    });
});

describe('Quiz Component', () => {
    it('fetches and displays questions from the database', async () => {
        const mockQuestionData = {
          question1: { question: 'What is the capital of France?', choices: ['Paris', 'Berlin', 'Madrid'], },
          question2: { question: 'What is the largest planet?', choices: ['Jupiter', 'Saturn', 'Neptune'], },
        };
    
        // Mock the implementation of getQuestionItems
        FlashcardRepo.getQuestionItems.mockResolvedValue(mockQuestionData);
    
        // Render the component
        let container;
        await act(async () => {
          container = render(<FlashcardComponent quizId={1} termArray={[]} definitionArray={[]} />);
        });
    
        // Wait for the asynchronous operation to complete
        await act(async () => {});
    
        // Assert that the component renders the fetched questions
        Object.values(mockQuestionData).forEach(({ question }) => {
          expect(container.getByText(question)).toBeInTheDocument();
        });
    });
});
