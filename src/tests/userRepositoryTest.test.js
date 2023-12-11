import { UserRepository } from "../js/repositories/UserRepository";
const firestore = require("firebase/firestore");
import * as sharedRepoFunctions from "../js/utils/sharedRepositoryFunctions";

jest.mock("firebase/firestore", () => ({
  setDoc: jest.fn(),
  doc: jest.fn(),
  collection: jest.fn(),
  addDoc: jest.fn(),
  getDocs: jest.fn(),
  updateDoc: jest.fn(),
  getDoc: jest.fn(),
  deleteDoc: jest.fn(),
  arrayUnion: jest.fn(),
}));

describe("UserRepository", () => {
  let userRepo;
  let databaseMock;
  let quizRepoMock;
  let flashcardRepoMock;
  let eventRepoMock;
  let notifRepoMock;

  beforeEach(() => {
    console.error = jest.fn();
    console.log = jest.fn();
    databaseMock = {};
    quizRepoMock = {
      get_QuizById: jest.fn(),
    };
    flashcardRepoMock = {
      getFlashcardSetBy_Id: jest.fn(),
    };
    eventRepoMock = {
      createUpcomingEvent: jest.fn(),
      getUpcomingEventById: jest.fn(),
      deleteUpcomingEvent: jest.fn(),
    };
    notifRepoMock = {};
    userRepo = new UserRepository(
      databaseMock,
      quizRepoMock,
      notifRepoMock,
      flashcardRepoMock,
      eventRepoMock
    );
    jest.clearAllMocks();
  });

  async function getFlashcard(isShared) {
    const userId = "banku";
    const mockQuizIds = ["quiz1"];
    const mockAuthors = [
      {
        id: userId,
        name: "Author One",
        imageURL: "url1",
        firstName: "First1",
        lastName: "Last1",
      },
    ];
    const mockQuizzes = [
      { id: "quiz1", authorId: userId, quizAuthor: mockAuthors[0] },
    ];
    const user = {
      name: "Author  One",
      imageURL: "url1",
      firstName: "First1",
      lastName: "Last1",
      id: userId,
    };

    firestore.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => mockQuizzes[0],
    });

    userRepo.getOwnedFlashcardsIds = jest.fn().mockResolvedValue(mockQuizIds);
    userRepo.getSharedFlashcardsIds = jest.fn().mockResolvedValue(mockQuizIds);
    flashcardRepoMock.getFlashcardSetBy_Id.mockImplementation((id) =>
      Promise.resolve(mockQuizzes[0])
    );
    userRepo.getUserById = jest.fn().mockResolvedValue(user);
    const result =
      isShared == false
        ? await userRepo.getOwnedFlashcards(userId)
        : await userRepo.getSharedFlashcards(userId);

    const expected = [
      {
        authorId: "banku",
        id: "quiz1",
        quizAuthor: {
          firstName: "First1",
          id: "banku",
          imageURL: "url1",
          lastName: "Last1",
          name: "Author One",
        },
        author: {
          name: "Author  One",
          imageURL: "url1",
          firstName: "First1",
          lastName: "Last1",
        },
      },
    ];

    if (!isShared) {
      expect(result).toEqual(expected);
      expect(result).toHaveLength(1);
    } else {
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    }
  }

  async function getQuiz(isShared) {
    const userId = "author1";
    const mockQuizIds = ["quiz1"];
    const mockAuthors = [
      {
        id: "author1",
        name: "Author One",
        imageURL: "url1",
        firstName: "First1",
        lastName: "Last1",
      },
    ];
    const mockQuizzes = [
      { id: "quiz1", authorId: "author1", quizAuthor: mockAuthors[0] },
    ];
    const user = {
      name: "Author  One",
      imageURL: "url1",
      firstName: "First1",
      lastName: "Last1",
      id: "author1",
    };

    userRepo.getOwnedQuizzesIds = jest.fn().mockResolvedValue(mockQuizIds);
    userRepo.getSharedQuizzesIds = jest.fn().mockResolvedValue(mockQuizIds);
    quizRepoMock.get_QuizById.mockImplementation((id) =>
      Promise.resolve(mockQuizzes[0])
    );
    userRepo.getUserById = jest.fn().mockResolvedValue(user);
    const result =
      isShared == false
        ? await userRepo.getOwnedQuizzes(userId)
        : await userRepo.getSharedQuizzes(userId);

    expect(result).toEqual(mockQuizzes);

    expect(result).toHaveLength(mockQuizIds.length);
  }

  describe("get quizzes and flashcards", () => {
    // Need to refactor

    it("should fetch owned quizzes with author details", async () => {
      getQuiz(true);
    });
    it("should fetch shared quizzes with author details", async () => {
      getQuiz(false);
    });

    it("should fetch owned flashcards with author details", async () => {
      getFlashcard(true);
    });

    it("should fetch owned flashcards with author details", async () => {
      getFlashcard(false);
    });
  });

  describe("user operations", () => {
    const userId = "userId";

    it("add user", async () => {
      const mockUser = {
        email: "test@example.com",
        username: "testuser",
        firstName: "Test",
        lastName: "User",
        uuid: "12345",
      };

      // Act
      await userRepo.addUser(
        mockUser.email,
        mockUser.username,
        mockUser.firstName,
        mockUser.lastName,
        mockUser.uuid
      );

      // Assert
      expect(firestore.doc).toHaveBeenCalledWith(
        databaseMock,
        "users",
        mockUser.uuid
      );
      expect(firestore.setDoc).toHaveBeenCalled();
    });

    it("getUserById return user data if user exists", async () => {
      const eventId = "existingEventId";
      const mockEventData = { name: "Test Event", id: eventId }; // Mock event data

      firestore.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockEventData,
      });

      const result = await userRepo.getUserById(userId);

      expect(firestore.doc).toHaveBeenCalledWith(databaseMock, "users", userId);
      expect(firestore.getDoc).toHaveBeenCalled();
      expect(result).toEqual(mockEventData);
    });

    it("should retrieve all users", async () => {
      const mockEventData1 = { name: "Event 1", type: "Type 1" };
      const mockEventData2 = { name: "Event 2", type: "Type 2" };

      firestore.getDocs.mockResolvedValueOnce({
        docs: [
          { id: "event1", data: () => mockEventData1 },
          { id: "event2", data: () => mockEventData2 },
        ],
        forEach: function (callback) {
          for (let doc of this.docs) {
            callback(doc);
          }
        },
      });
      firestore.collection.mockImplementation(() => ({
        withConverter: jest.fn().mockReturnValue({}),
      }));

      const events = await userRepo.getAllUsers();
      expect(firestore.getDocs).toHaveBeenCalled();
      expect(events).toHaveLength(2);
      expect(events[0]).toEqual(mockEventData1);
      expect(events[1]).toEqual(mockEventData2);
    });

    it("deletUser", async () => {
      const mockError = new Error("Failed to delete");
      firestore.deleteDoc.mockRejectedValue(mockError); // Mock failure

      await expect(userRepo.deleteUser(userId)).rejects.toThrow(mockError);

      expect(firestore.deleteDoc).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(
        `Error removing user with ID: ${userId} from collection users: ${mockError}`
      );
    });

    it("getUsers", async () => {
      userRepo.getUserById = jest
        .fn()
        .mockResolvedValue([{ id: "1" }, { id: "2" }, { id: "3" }]);

      const users = await userRepo.getUsers("userId");
      console.log("users: ", users);
      expect(JSON.stringify(users)).toContain('[[{"id":"1"}');
    });
  });

  describe("add ids to user array fields", () => {
    it("should add a follower id ", async () => {
      const userId = "user123";
      const followerId = "follower456";

      await userRepo.addFollower(userId, followerId);

      expect(firestore.doc).toHaveBeenCalledWith(databaseMock, "users", userId);
      expect(firestore.updateDoc).toHaveBeenCalled();
    });

    it("should add a following id ", async () => {
      const userId = "user123";
      const followerId = "follower456";

      await userRepo.addFollowing(userId, followerId);

      expect(firestore.doc).toHaveBeenCalledWith(databaseMock, "users", userId);
      expect(firestore.updateDoc).toHaveBeenCalled();
    });

    it("should add event id ", async () => {
      const userId = "user123";
      const followerId = "follower456";

      await userRepo.addEvent(userId, followerId);

      expect(firestore.doc).toHaveBeenCalledWith(databaseMock, "users", userId);
      expect(firestore.updateDoc).toHaveBeenCalled();
    });

    it("should add notification id ", async () => {
      const userId = "user123";
      const followerId = "follower456";

      await userRepo.addNotification(userId, followerId);

      expect(firestore.doc).toHaveBeenCalledWith(databaseMock, "users", userId);
      expect(firestore.updateDoc).toHaveBeenCalled();
    });

    it("add subjectId ", async () => {
      const userId = "user123";
      const followerId = "follower456";

      await userRepo.addSubject(userId, followerId);

      expect(firestore.doc).toHaveBeenCalledWith(databaseMock, "users", userId);
      expect(firestore.updateDoc).toHaveBeenCalled();
    });

    it("add ownedFlashcardId ", async () => {
      const userId = "user123";
      const followerId = "follower456";

      await userRepo.addOwnedFlashcard(userId, followerId);

      expect(firestore.doc).toHaveBeenCalledWith(databaseMock, "users", userId);
      expect(firestore.updateDoc).toHaveBeenCalled();
    });
    it("add ownedQuizId ", async () => {
      const userId = "user123";
      const followerId = "follower456";

      await userRepo.addOwnedQuiz(userId, followerId);

      expect(firestore.doc).toHaveBeenCalledWith(databaseMock, "users", userId);
      expect(firestore.updateDoc).toHaveBeenCalled();
    });

    it("add sharedQuizId ", async () => {
      const userId = "user123";
      const followerId = "follower456";

      await userRepo.addSharedQuiz(userId, followerId);

      expect(firestore.doc).toHaveBeenCalledWith(databaseMock, "users", userId);
      expect(firestore.updateDoc).toHaveBeenCalled();
    });

    it("add sharedFlashcardId ", async () => {
      const userId = "user123";
      const followerId = "follower456";

      await userRepo.addSharedQuiz(userId, followerId);

      expect(firestore.doc).toHaveBeenCalledWith(databaseMock, "users", userId);
      expect(firestore.updateDoc).toHaveBeenCalled();
    });

    it("add upcoming event id", async () => {
      const userId = "123";
      const name = "Event Name";
      const date = "2023-12-10";
      const time = "15:30";
      const type = "Event Type";
      const itemId = "456";
      const itemName = "Item Name";

      eventRepoMock.createUpcomingEvent.mockImplementation((event) =>
        Promise.resolve(true)
      );

      const result = await userRepo.addUpcomingEvent(
        userId,
        name,
        date,
        time,
        type,
        itemId,
        itemName
      );

      expect(result).toBe(true);
    });
  });

  describe("remove id fields", () => {
    it("remove follower", async () => {});
  });

  describe("utilities", () => {
    it("should convert 24-hour time to 12-hour format", () => {
      expect(userRepo.convertTo12HourFormat("13:00")).toEqual("01:00 PM");
      expect(userRepo.convertTo12HourFormat("02:30")).toEqual("02:30 AM");
    });

    it("should return the short form of the day of the week", () => {
      expect(userRepo.getDayOfWeekShort("2023-03-01")).toEqual("Wed");
    });

    it("should return the abbreviated month name", () => {
      expect(
        userRepo.getMonthAbbreviation(
          "Mon Mar 11 2024 20:00:00 GMT-0400 (Eastern Daylight Time)"
        )
      ).toEqual("Mar");
    });

    it("should return true for a future timestamp", () => {
      const futureTimestamp = Date.now() + 1000 * 60; // 1 minute into the future
      expect(userRepo.isTimestampInFuture(futureTimestamp)).toBe(true);
    });

    it("should return false for a past timestamp", () => {
      const pastTimestamp = Date.now() - 1000 * 60; // 1 minute in the past
      expect(userRepo.isTimestampInFuture(pastTimestamp)).toBe(false);
    });
  });

  describe("upcomingEvents", () => {
    it("getAllUpcomingEvents", async () => {
      const mockEvents = [{ name: "e1" }, { name: "e2" }, { name: "e3" }];
      userRepo.getUpcomingEventIds = jest
        .fn()
        .mockResolvedValue(["1", "2", "3"]);
      const expectedEvents = [
        { name: "e1", id: "1" },
        { name: "e2", id: "2" },
        { name: "e3", id: "3" },
      ];
      eventRepoMock.getUpcomingEventById.mockImplementation((event) =>
        Promise.resolve(mockEvents)
      );
      const res = await userRepo.getAllUpcomingEvents("userId");
      console.log("res is: ", res);
      expect(res.length).toEqual(mockEvents.length);
    });

    it("getUpcomingEvents", async () => {
      userRepo.getAllUpcomingEvents = jest
        .fn()
        .mockResolvedValue([{ timestamp: new Date().getTime() }]);
      const userId = "userId";
      const upcomingEvents = await userRepo.getUpcomingEvents(userId);

      expect(upcomingEvents).toEqual([]);
    });
    it("getPastEvents", async () => {
      userRepo.getAllUpcomingEvents = jest
        .fn()
        .mockResolvedValue([{ timestamp: new Date().getTime() }]);
      const userId = "userId";
      const upcomingEvents = await userRepo.getPastEvents(userId);

      expect(upcomingEvents.length).toEqual(1);
    });
  });

  describe("remove id fields", () => {
    beforeEach(() => {
      // Mock updateNonArrayDocumentFields specifically for these tests
      sharedRepoFunctions.removeItemFromArrayField = jest
        .fn()
        .mockResolvedValue();
    });

    afterEach(() => {
      // Restore the original implementation after each test in this block
      jest.restoreAllMocks();
    });

    it("remove follower", async () => {
      const id1 = "id1";
      const id2 = "id2";

      await userRepo.removeFollower(id1, id2);
      expect(sharedRepoFunctions.removeItemFromArrayField).toHaveBeenCalledWith(
        databaseMock,
        id1,
        id2,
        "users",
        "followers",
        "follower"
      );
    });

    it("remove follower", async () => {
      const id1 = "id1";
      const id2 = "id2";

      await userRepo.removeFollowing(id1, id2);
      expect(sharedRepoFunctions.removeItemFromArrayField).toHaveBeenCalledWith(
        databaseMock,
        id1,
        id2,
        "users",
        "following",
        "following"
      );
    });

    it("remove notification by id", async () => {
      const id1 = "id1";
      const id2 = "id2";

      await userRepo.removeNotificationById(id1, id2);
      expect(sharedRepoFunctions.removeItemFromArrayField).toHaveBeenCalledWith(
        databaseMock,
        id1,
        id2,
        "users",
        "notifications",
        "notification"
      );
    });
    it("delete upcoming event", async () => {
      const id1 = "id1";
      const id2 = "id2";

      eventRepoMock.deleteUpcomingEvent.mockResolvedValue();
      await userRepo.removeUpcomingEvent(id1, id2);
      expect(sharedRepoFunctions.removeItemFromArrayField).toHaveBeenCalledWith(
        databaseMock,
        id1,
        id2,
        "users",
        "upcomingEvents",
        "upcoming event"
      );
    });
  });

  describe("get id fields", () => {
    beforeEach(() => {
      // Mock updateNonArrayDocumentFields specifically for these tests
      sharedRepoFunctions.getArrayFieldFromCollection = jest
        .fn()
        .mockResolvedValue();
    });

    afterEach(() => {
      // Restore the original implementation after each test in this block
      jest.restoreAllMocks();
    });
    const userId = "id";
    it("ownedQuizzes", async () => {
      await userRepo.getOwnedQuizzesIds(userId);
      expect(
        sharedRepoFunctions.getArrayFieldFromCollection
      ).toHaveBeenCalledWith(databaseMock, "users", userId, "ownedQuizzes");
    });
    it("sharedQuizzes", async () => {
      await userRepo.getSharedQuizzesIds(userId);
      expect(
        sharedRepoFunctions.getArrayFieldFromCollection
      ).toHaveBeenCalledWith(databaseMock, "users", userId, "sharedQuizzes");
    });
    it("ownedFlashcards", async () => {
      await userRepo.getOwnedFlashcardsIds(userId);
      expect(
        sharedRepoFunctions.getArrayFieldFromCollection
      ).toHaveBeenCalledWith(databaseMock, "users", userId, "ownedFlashcards");
    });
    it("sharedFlashcards", async () => {
      await userRepo.getSharedFlashcardIds(userId);
      expect(
        sharedRepoFunctions.getArrayFieldFromCollection
      ).toHaveBeenCalledWith(databaseMock, "users", userId, "sharedFlashcards");
    });

    it("followersIds", async () => {
      await userRepo.getFollowersIds(userId);
      expect(
        sharedRepoFunctions.getArrayFieldFromCollection
      ).toHaveBeenCalledWith(databaseMock, "users", userId, "followers");
    });
    it("followingIds", async () => {
      await userRepo.getFollowingIds(userId);
      expect(
        sharedRepoFunctions.getArrayFieldFromCollection
      ).toHaveBeenCalledWith(databaseMock, "users", userId, "following");
    });
    it("notificationIds", async () => {
      await userRepo.getNotificationIds(userId);
      expect(
        sharedRepoFunctions.getArrayFieldFromCollection
      ).toHaveBeenCalledWith(databaseMock, "users", userId, "notifications");
    });
    it("getUpcomingEventIds", async () => {
      await userRepo.getUpcomingEventIds(userId);
      expect(
        sharedRepoFunctions.getArrayFieldFromCollection
      ).toHaveBeenCalledWith(databaseMock, "users", userId, "upcomingEvents");
    });
  });
});
