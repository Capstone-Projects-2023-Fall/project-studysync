import { FlashCardRepository } from "../js/repositories/FlashCardRepository";
import { collection, getDocs } from "firebase/firestore";
import { getItemById } from "../js/utils/sharedRepositoryFunctions";

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
}));

jest.mock("../js/utils/sharedRepositoryFunctions", () => ({
  getItemById: jest.fn(),
}));

describe("getFlashcardSet", () => {
  it("retrieves a flashcard set successfully", async () => {
    const mockFlashcardSet = { id: "1", name: "Set 1" };
    getItemById.mockResolvedValue(mockFlashcardSet);

    const repo = new FlashCardRepository({});
    const flashcardSet = await repo.getFlashcardSet("1");
    expect(flashcardSet).toEqual(mockFlashcardSet);
  });
});

describe("getAll_flashcardSets", () => {
  it("retrieves all flashcard sets successfully", async () => {
    const mockFlashcardSets = [
      { id: "1", name: "Set 1" },
      { id: "2", name: "Set 2" },
    ];
    getDocs.mockResolvedValue({
      docs: mockFlashcardSets.map((set) => ({
        id: set.id,
        data: () => set,
      })),
    });

    const repo = new FlashCardRepository({});
    const flashcardSets = await repo.getAll_flashcardSets();
    expect(flashcardSets).toEqual(mockFlashcardSets);
  });
});

describe("getFlashcardSetBy_Id", () => {
  it("retrieves a flashcard set by ID successfully", async () => {
    const mockFlashcardSet = { id: "1", name: "Set 1" };
    const mockFlashcardSets = [mockFlashcardSet];
    getDocs.mockResolvedValue({
      docs: mockFlashcardSets.map((set) => ({
        id: set.id,
        data: () => set,
      })),
    });

    const repo = new FlashCardRepository({});
    const flashcardSet = await repo.getFlashcardSetBy_Id("1");
    expect(flashcardSet).toEqual(mockFlashcardSet);
  });
});

describe("getFlashcards", () => {
  it("retrieves multiple flashcard sets successfully", async () => {
    const mockFlashcardSets = [
      { id: "1", name: "Set 1" },
      { id: "2", name: "Set 2" },
    ];
    getItemById.mockImplementation((database, id, collectionName, docName) =>
      Promise.resolve(mockFlashcardSets.find((set) => set.id === id))
    );

    const repo = new FlashCardRepository({});
    const flashcards = await repo.getFlashcards(["1", "2"]);
    expect(flashcards).toEqual(mockFlashcardSets);
  });
});
