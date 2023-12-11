import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';

import LoginPage from './js/react/LoginPage';
import FlashcardPage from './js/Tests/AddFlashcard';
import QuizList from './js/Tests/FetchQuizLists';
import UpdateQuestions from './js/Tests/UpdateQuestions';
import FlashcardRepo from './js/repositories/FlashcardRepo';


// mock the entire firebase/auth module
jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { uid: 'mockedUserId' } })),
    signInWithEmailAndPassword: jest.fn().mockResolvedValue({}),
    auth: {},
  }));

// mock the functions from FlashcardRepo
jest.mock('./js/repositories/FlashcardRepo', () => ({
    addFlashcardItem: jest.fn(() => Promise.resolve('mockedFlashcardId')),
    getQuizTitleFromFlashcardSet: jest.fn().mockResolvedValue(['Quiz 1', 'Quiz 2']),
    updateQuestion: jest.fn(),
}));
  
  // mocking userRepository's addUser function
jest.mock('./firebase', () => ({
      userRepository: {
      addUser: jest.fn(() => Promise.resolve()),
    },
}));

describe('Integration Test', () => {
    // Use case 1
    it('Use Case 1: User can log in and navigate to Study Tool', async () => {
        render(
            <MemoryRouter>
            <LoginPage />
            </MemoryRouter>
        );

        // mock the signInWithEmailAndPassword function from Firebase
        jest.spyOn(require('firebase/auth'), 'signInWithEmailAndPassword')
        .mockResolvedValueOnce({});

        // fill in the email and password fields
        fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

        act(() => {
        fireEvent.click(screen.getByText('Sign In'));
        });

        await waitFor(() => expect(require('firebase/auth').signInWithEmailAndPassword).toHaveBeenCalled());
        expect(window.location.pathname).toBe('/');

    });
    it('Use Case 2: User navigates to flashcard and add a new flashcards', async () => {
        const { getByLabelText, getByText } = render(<FlashcardPage />);
    
        // Simulate user input
        fireEvent.change(getByLabelText('Term:'), { target: { value: 'term' } });
        fireEvent.change(getByLabelText('Definition:'), { target: { value: 'definition' } });
    
        // Trigger the button click
        fireEvent.click(getByText('Add Flashcard'));
    
        // Wait for the asynchronous operation to complete
        await waitFor(() => {
          expect(getByText('Term:')).toBeInTheDocument();
        });
      });
    it('Use Case 3: User navigates to quiz page and select quiz titles', async () => {
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

    it('Use Case 4: User navigates from flashcard to quiz so they can update questions', async () => {
        const quizId = 1;
        const editQuestion = {
        questionId: 1,
        question: 'Old question',
        choices: ['Choice A', 'Choice B', 'Choice C', 'Choice D'],
        correctChoiceIndex: 0,
        };

        const questions = [
        { questionId: 1, question: 'Question 1', choices: ['A', 'B', 'C', 'D'], correctChoiceIndex: 2 },
        { questionId: 2, question: 'Question 2', choices: ['A', 'B', 'C', 'D'], correctChoiceIndex: 1 },
        // ...
        ];

        const setQuizData = jest.fn();
        const setOpenEdit = jest.fn();
        const setEditQuestion = jest.fn();

        const { getByLabelText, getByText } = render(
        <UpdateQuestions
            quizId={quizId}
            editQuestion={editQuestion}
            questions={questions}
            setQuizData={setQuizData}
            setOpenEdit={setOpenEdit}
            setEditQuestion={setEditQuestion}
        />
        );

        // Simulate user entering new question
        fireEvent.change(getByLabelText('Question'), { target: { value: 'New question' } });

        // Mock FlashcardRepo.updateQuestion to resolve successfully
        FlashcardRepo.updateQuestion.mockResolvedValue();

        // Trigger the update button click
        fireEvent.click(getByText('Update Question'));

        // Wait for the asynchronous update to complete
        await waitFor(() => {
        // Expect that the mock functions are called as expected
        expect(FlashcardRepo.updateQuestion).toHaveBeenCalledWith(
            quizId,
            editQuestion.questionId,
            'New question',
            editQuestion.choices,
            editQuestion.correctChoiceIndex
        );
        expect(setQuizData).toHaveBeenCalled();
        expect(setOpenEdit).toHaveBeenCalledWith(false);
        expect(setEditQuestion).toHaveBeenCalledWith(null);
        });
    });

    it('Use Case 5: Users can interact with my sets', async () => {});

    it('Use Case 6: Users can interact with the social feature', async () => {});

    it('Use Case 7: Users can pause quiz and come back later', async () => {});

    it('Use Case 8: Users can update flashcard to improve accuracy', async () => {});

});
