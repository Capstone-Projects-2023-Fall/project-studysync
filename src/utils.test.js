import React from 'react';
import { render, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import FlashcardComponent from './js/react/flashcardCom.js';
import FlashcardShare from './js/react/flashcardShare.js';
import FlashcardApp from './js/react/flashcardUICom.js';
import FlashcardRepo from './js/repositories/FlashcardRepo.js';
import { MemoryRouter } from 'react-router-dom';

jest.mock('./js/repositories/FlashcardRepo.js', () => ({
  getCurrentUid: jest.fn(),
  getUserSubjects: jest.fn(),
  getUserFlashcardSets: jest.fn(),
  getFlashcardSetById: jest.fn(),
  getFlashcardItems: jest.fn(),
  addFlashcardItem: jest.fn(),
  deleteFlashcard: jest.fn(),
  updateFlashcard: jest.fn(),
  getCommentsWithUserData: jest.fn(),
  fetchTopicName: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ setId: 'someSetId', quizId: 'someQuizId', flashcardId: 'abc' }),
  useNavigate: () => jest.fn(),
}));

describe('FlashcardComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    FlashcardRepo.getCurrentUid.mockReturnValue('test-uid');
  });

  it('renders component and shows initial UI elements', () => {
    act(() => {
      render(
        <MemoryRouter>
          <FlashcardComponent />
        </MemoryRouter>
      );
    });
    // Add assertions if necessary
  });

  it('fetches subjects and flashcards on load', async () => {
    FlashcardRepo.getUserSubjects.mockResolvedValue(['Math', 'Science']);
    FlashcardRepo.getUserFlashcardSets.mockResolvedValue(['set1', 'set2']);
    FlashcardRepo.getFlashcardSetById.mockResolvedValue({ name: 'Set 1', subject: 'Math' });

    await act(async () => {
      render(
        <MemoryRouter>
          <FlashcardComponent />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(FlashcardRepo.getCurrentUid).toHaveBeenCalled();
      expect(FlashcardRepo.getUserSubjects).toHaveBeenCalledWith('test-uid');
      expect(FlashcardRepo.getUserFlashcardSets).toHaveBeenCalledWith('test-uid');
      // You might want to add assertions for elements that should be present after fetching data
    });
  });

  // Additional tests for FlashcardComponent...
});

describe('FlashcardShare Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders FlashcardShare and shows initial UI elements', () => {
    act(() => {
      render(
        <MemoryRouter>
          <FlashcardShare />
        </MemoryRouter>
      );
    });
    // Assertions for FlashcardShare
  });

  it('fetches flashcards on load', async () => {
    FlashcardRepo.getFlashcardItems.mockResolvedValue({
      card1: { term: 'Term 1', definition: 'Definition 1' },
      card2: { term: 'Term 2', definition: 'Definition 2' },
    });

    await act(async () => {
      render(
        <MemoryRouter>
          <FlashcardShare />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(FlashcardRepo.getFlashcardItems).toHaveBeenCalledWith('abc');
    });
    // Additional assertions...
  });

  // Additional tests for FlashcardShare...
});

describe('FlashcardApp Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    FlashcardRepo.getFlashcardItems.mockResolvedValue({ /* Mock flashcard items */ });
    FlashcardRepo.addFlashcardItem.mockResolvedValue(/* Mock return value for adding a flashcard */);
    FlashcardRepo.deleteFlashcard.mockResolvedValue(/* Mock return value for deleting a flashcard */);
    FlashcardRepo.updateFlashcard.mockResolvedValue(/* Mock return value for updating a flashcard */);
    FlashcardRepo.getCommentsWithUserData.mockResolvedValue(/* Mock comments data */);
    FlashcardRepo.fetchTopicName.mockResolvedValue('Math'); // Mock this function if it's used in FlashcardApp
  });

  it('renders FlashcardApp and shows initial UI elements', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <FlashcardApp />
        </MemoryRouter>
      );
    });
    // Add assertions specific to FlashcardApp initial render
  });

  it('performs operations like fetching, adding, updating, and deleting flashcards', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <FlashcardApp />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      // Assertions for these operations...
    });
  });

  // ... additional tests specific to FlashcardApp ...
});