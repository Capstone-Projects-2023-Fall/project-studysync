import { QuizRepository } from "../js/repositories/QuizRepository";
const firestore = require("firebase/firestore");

// Mock Firestore functions
jest.mock("firebase/firestore", () => ({
  setDoc: jest.fn(),
  doc: jest.fn(),
  collection: jest.fn(),
  addDoc: jest.fn(),
  getDocs: jest.fn(),
  updateDoc: jest.fn(),
  getDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
}));
describe("QuizRepository", () => {
  const mockDatabase = {};
  const quizRepo = new QuizRepository(mockDatabase);
  beforeEach(() => {
    jest.resetAllMocks();
  });

  // Test for get_AllQuizzes
  describe("get_AllQuizzes", () => {
    it("fetches all quizzes successfully", async () => {
      const mockQuizzes = [
        { id: "1", name: "Quiz 1" },
        { id: "2", name: "Quiz 2" },
      ];
      firestore.getDocs.mockResolvedValue({
        docs: mockQuizzes.map((quiz) => ({
          id: quiz.id,
          data: () => quiz,
        })),
      });

      const quizzes = await quizRepo.get_AllQuizzes();
      expect(quizzes).toEqual(mockQuizzes);
    });

    it("handles errors and returns an empty array", async () => {
      firestore.getDocs.mockRejectedValue(new Error("Database Error"));
      const quizzes = await quizRepo.get_AllQuizzes();
      expect(quizzes).toEqual([]);
    });
  });

  // Test for get_QuizById
  describe("get_QuizById", () => {
    it("finds a quiz by ID successfully", async () => {
      const mockQuizzes = [
        { id: "1", name: "Quiz 1" },
        { id: "2", name: "Quiz 2" },
      ];
      firestore.getDocs.mockResolvedValue({
        docs: mockQuizzes.map((quiz) => ({
          id: quiz.id,
          data: () => quiz,
        })),
      });

      const quiz = await quizRepo.get_QuizById("1");
      expect(quiz).toEqual({ id: "1", name: "Quiz 1" });
    });

    it("throws an error when quiz is not found", async () => {
      const mockQuizzes = [{ id: "1", name: "Quiz 1" }];
      firestore.getDocs.mockResolvedValue({
        docs: mockQuizzes.map((quiz) => ({
          id: quiz.id,
          data: () => quiz,
        })),
      });

      await expect(quizRepo.get_QuizById("2")).rejects.toThrow(
        "Quiz with id: 2 does not exist"
      );
    });
  });
});
