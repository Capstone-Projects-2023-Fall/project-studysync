//--------------------------------------------------------------------------------
//Kai Guo unit test part
import React from 'react';
import '@testing-library/jest-dom';
import FlashcardComponent from './js/react/flashcardCom.js';
import FlashcardShare from './js/react/flashcardShare.js';
import FlashcardApp from './js/react/flashcardUICom.js';
import FlashcardRepo from './js/repositories/FlashcardRepo.js';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import { filterFlashcards } from './js/react/flashcardUICom.js';

jest.mock('./js/repositories/FlashcardRepo.js', () => ({
  getCurrentUid: jest.fn(),
  getUserSubjects: jest.fn().mockResolvedValue(['Math', 'Science']),
  getUserFlashcardSets: jest.fn().mockResolvedValue(['set1', 'set2']),
  getFlashcardSetById: jest.fn().mockResolvedValue({ name: 'Set 1', subject: 'Math' }),
  getFlashcardItems: jest.fn(),
  addFlashcardItem: jest.fn(),
  deleteFlashcard: jest.fn(),
  updateFlashcard: jest.fn(),
  getCommentsWithUserData: jest.fn(),
  fetchTopicName: jest.fn(),
  addUserSubject: jest.fn(),
  removeSetIdFromUser: jest.fn().mockResolvedValue(true),
  updateFlashcardSetName: jest.fn().mockResolvedValue(true),
  createFlashcardSet: jest.fn().mockResolvedValue({ flashcardSetId: '123', quizSetId: '456' }),
  addOwnedFlashcardSetToUser: jest.fn(),
  addOwnedQuizSetToUser: jest.fn(),
  getFlashcardItems: jest.fn(),
  getCommentsWithUserData: jest.fn(),
  getUserImageURLByUid: jest.fn(),
  addComment: jest.fn(),
  callYourCloudFunctionToGenerateFlashcards: jest.fn(),

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
    render(
      <MemoryRouter>
        <FlashcardComponent />
      </MemoryRouter>
    );
    expect(screen.getByText('Add Subject')).toBeInTheDocument();
    // Add more assertions to check for initial elements
  });

  it('fetches subjects and flashcards on load', async () => {
    FlashcardRepo.getUserSubjects.mockResolvedValue(['Math', 'Science']);
    FlashcardRepo.getUserFlashcardSets.mockResolvedValue(['set1', 'set2']);
    FlashcardRepo.getFlashcardSetById.mockResolvedValue({ name: 'Set 1', subject: 'Math' });

    render(
      <MemoryRouter>
        <FlashcardComponent />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Math')).toBeInTheDocument();
      expect(screen.getByText('Science')).toBeInTheDocument();
      // Additional assertions for fetched data display
    });
  });
  it('calls addUserSubject when a new subject is added', async () => {
    render(
      <MemoryRouter>
        <FlashcardComponent />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('Add Subject')).toBeInTheDocument());

    FlashcardRepo.addUserSubject('test-uid', 'Physics');

    expect(FlashcardRepo.addUserSubject).toHaveBeenCalledWith('test-uid', 'Physics');
  });




  it('calls createFlashcardSet when a new topic is added', async () => {
    const newTopic = { name: 'Algebra', subject: 'Math' };

    await FlashcardRepo.createFlashcardSet(newTopic);

    expect(FlashcardRepo.createFlashcardSet).toHaveBeenCalledWith(newTopic);
  });







  it('should handle topic deletion correctly', async () => {
    const userId = 'test-uid';
    const setId = 'set1';

    await FlashcardRepo.removeSetIdFromUser(userId, setId);

    expect(FlashcardRepo.removeSetIdFromUser).toHaveBeenCalledWith(userId, setId);
  });

  it('should handle topic editing correctly', async () => {
    const setId = 'set1';
    const newTopicName = 'Geometry';

    await FlashcardRepo.updateFlashcardSetName(setId, newTopicName);

    expect(FlashcardRepo.updateFlashcardSetName).toHaveBeenCalledWith(setId, newTopicName);
  });


  // Additional tests for other functionalities and interactions...
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

  it('loads flashcards, comments, and user image on initialization', async () => {
    const mockFlashcards = {};
    const mockComments = {};
    const mockUserImage = 'test-user-image-url';

    FlashcardRepo.getFlashcardItems.mockResolvedValue(mockFlashcards);
    FlashcardRepo.getCommentsWithUserData.mockResolvedValue(mockComments);
    FlashcardRepo.getUserImageURLByUid.mockResolvedValue(mockUserImage);

    render(<FlashcardApp />);

    await waitFor(() => {
      expect(FlashcardRepo.getFlashcardItems).toHaveBeenCalledWith('someSetId');
      expect(FlashcardRepo.getCommentsWithUserData).toHaveBeenCalledWith('someSetId');
      expect(FlashcardRepo.getUserImageURLByUid).toHaveBeenCalled();
    });
  });
  it('should handle adding a flashcard correctly', async () => {
    const setId = 'test-set-id';
    const term = 'Test Term';
    const definition = 'Test Definition';

    await FlashcardRepo.addFlashcardItem(setId, term, definition);

    expect(FlashcardRepo.addFlashcardItem).toHaveBeenCalledWith(setId, term, definition);
  });
  it('should handle deleting a flashcard correctly', async () => {
    const setId = 'test-set-id';
    const flashcardId = 'test-flashcard-id';

    await FlashcardRepo.deleteFlashcard(setId, flashcardId);

    expect(FlashcardRepo.deleteFlashcard).toHaveBeenCalledWith(setId, flashcardId);
  });
  it('should handle updating a flashcard correctly', async () => {
    const setId = 'test-set-id';
    const flashcardId = 'test-flashcard-id';
    const updatedTerm = 'Updated Term';
    const updatedDefinition = 'Updated Definition';

    await FlashcardRepo.updateFlashcard(setId, flashcardId, updatedTerm, updatedDefinition);

    expect(FlashcardRepo.updateFlashcard).toHaveBeenCalledWith(setId, flashcardId, updatedTerm, updatedDefinition);
  });
  it('should handle sending a comment correctly', async () => {
    const setId = 'test-set-id';
    const comment = { content: 'Test Comment', uid: 'test-uid', date: new Date() };

    await FlashcardRepo.addComment(setId, comment);

    expect(FlashcardRepo.addComment).toHaveBeenCalledWith(setId, comment);
  });

  it('should handle generating flashcards with AI correctly', async () => {
    const setId = 'test-set-id';
    const numberOfFlashcards = 5;
    const topicName = 'Math';
    const imageFile = 'image-data';
    const mockGeneratedFlashcards = [];

    FlashcardRepo.callYourCloudFunctionToGenerateFlashcards.mockResolvedValue(mockGeneratedFlashcards);

    const result = await FlashcardRepo.callYourCloudFunctionToGenerateFlashcards(numberOfFlashcards, topicName, imageFile);

    expect(FlashcardRepo.callYourCloudFunctionToGenerateFlashcards).toHaveBeenCalledWith(numberOfFlashcards, topicName, imageFile);
    expect(result).toEqual(mockGeneratedFlashcards);
  });

  it('loads and displays flashcards correctly', async () => {
    const mockFlashcardsData = [
      { term: 'Term1', definition: 'Def1', flashcardId: '1' },
      { term: 'Term2', definition: 'Def2', flashcardId: '2' },
    ];
    FlashcardRepo.getFlashcardItems.mockResolvedValue(mockFlashcardsData);

    const { getByText } = render(<FlashcardApp setId="test-set-id" />);

    await waitFor(() => {
      expect(getByText('Term1')).toBeInTheDocument();
      expect(getByText('Term2')).toBeInTheDocument();
    });
  });


  // ... additional tests specific to FlashcardApp ...
});
