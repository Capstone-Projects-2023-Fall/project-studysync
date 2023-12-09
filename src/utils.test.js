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
// 可以继续添加其他需要模拟的函数
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

    // 在渲染完成后等待组件加载
    await waitFor(() => expect(screen.getByText('Add Subject')).toBeInTheDocument());

    // 调用 addUserSubject 方法
    FlashcardRepo.addUserSubject('test-uid', 'Physics');

    // 检查 addUserSubject 方法是否被以正确的参数调用
    expect(FlashcardRepo.addUserSubject).toHaveBeenCalledWith('test-uid', 'Physics');
  });




  it('calls createFlashcardSet when a new topic is added', async () => {
    // 设置预期的输入
    const newTopic = { name: 'Algebra', subject: 'Math' };

    // 直接调用方法而不是通过用户交互
    await FlashcardRepo.createFlashcardSet(newTopic);

    // 检查方法是否被正确调用
    expect(FlashcardRepo.createFlashcardSet).toHaveBeenCalledWith(newTopic);
  });







  it('should handle topic deletion correctly', async () => {
    // 设置预期的用户 ID 和要删除的主题 ID
    const userId = 'test-uid';
    const setId = 'set1';

    // 直接调用删除方法
    await FlashcardRepo.removeSetIdFromUser(userId, setId);

    // 检查方法是否被以正确的参数调用
    expect(FlashcardRepo.removeSetIdFromUser).toHaveBeenCalledWith(userId, setId);
  });

  it('should handle topic editing correctly', async () => {
    // 设置预期的集合 ID 和新的主题名称
    const setId = 'set1';
    const newTopicName = 'Geometry';

    // 直接调用更新方法
    await FlashcardRepo.updateFlashcardSetName(setId, newTopicName);

    // 检查方法是否被以正确的参数调用
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
    const mockFlashcards = { /* 模拟闪卡数据 */ };
    const mockComments = { /* 模拟评论数据 */ };
    const mockUserImage = 'test-user-image-url';

    FlashcardRepo.getFlashcardItems.mockResolvedValue(mockFlashcards);
    FlashcardRepo.getCommentsWithUserData.mockResolvedValue(mockComments);
    FlashcardRepo.getUserImageURLByUid.mockResolvedValue(mockUserImage);

    render(<FlashcardApp />); // 使用模拟的 useParams

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

    // 直接调用添加闪卡方法
    await FlashcardRepo.addFlashcardItem(setId, term, definition);

    // 检查方法是否被以正确的参数调用
    expect(FlashcardRepo.addFlashcardItem).toHaveBeenCalledWith(setId, term, definition);
  });
  it('should handle deleting a flashcard correctly', async () => {
    const setId = 'test-set-id';
    const flashcardId = 'test-flashcard-id';

    // 直接调用删除闪卡方法
    await FlashcardRepo.deleteFlashcard(setId, flashcardId);

    // 检查方法是否被以正确的参数调用
    expect(FlashcardRepo.deleteFlashcard).toHaveBeenCalledWith(setId, flashcardId);
  });
  it('should handle updating a flashcard correctly', async () => {
    const setId = 'test-set-id';
    const flashcardId = 'test-flashcard-id';
    const updatedTerm = 'Updated Term';
    const updatedDefinition = 'Updated Definition';

    // 直接调用更新闪卡方法
    await FlashcardRepo.updateFlashcard(setId, flashcardId, updatedTerm, updatedDefinition);

    // 检查方法是否被以正确的参数调用
    expect(FlashcardRepo.updateFlashcard).toHaveBeenCalledWith(setId, flashcardId, updatedTerm, updatedDefinition);
  });
  it('should handle sending a comment correctly', async () => {
    const setId = 'test-set-id';
    const comment = { content: 'Test Comment', uid: 'test-uid', date: new Date() };

    // 直接调用发送评论方法
    await FlashcardRepo.addComment(setId, comment);

    // 检查方法是否被以正确的参数调用
    expect(FlashcardRepo.addComment).toHaveBeenCalledWith(setId, comment);
  });

  it('should handle generating flashcards with AI correctly', async () => {
    const setId = 'test-set-id';
    const numberOfFlashcards = 5;
    const topicName = 'Math';
    const imageFile = 'image-data';
    const mockGeneratedFlashcards = [/* 模拟生成的闪卡数据 */];

    FlashcardRepo.callYourCloudFunctionToGenerateFlashcards.mockResolvedValue(mockGeneratedFlashcards);

    // 假设存在一个用于 AI 生成闪卡的函数
    const result = await FlashcardRepo.callYourCloudFunctionToGenerateFlashcards(numberOfFlashcards, topicName, imageFile);

    // 检查函数是否被以正确的参数调用，并验证返回值
    expect(FlashcardRepo.callYourCloudFunctionToGenerateFlashcards).toHaveBeenCalledWith(numberOfFlashcards, topicName, imageFile);
    expect(result).toEqual(mockGeneratedFlashcards);
  });

  it('loads and displays flashcards correctly', async () => {
    // 模拟闪卡数据
    const mockFlashcardsData = [
      { term: 'Term1', definition: 'Def1', flashcardId: '1' },
      { term: 'Term2', definition: 'Def2', flashcardId: '2' },
    ];
    FlashcardRepo.getFlashcardItems.mockResolvedValue(mockFlashcardsData);

    // 渲染组件
    const { getByText } = render(<FlashcardApp setId="test-set-id" />);

    // 等待并检查是否显示了模拟的闪卡数据
    await waitFor(() => {
      expect(getByText('Term1')).toBeInTheDocument();
      expect(getByText('Term2')).toBeInTheDocument();
    });
  });


  // ... additional tests specific to FlashcardApp ...
});