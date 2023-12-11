// Import the necessary modules
import Event, { EVENT_TYPE } from "../js/models/event";
import { EventRepository } from "../js/repositories/EventRepository";
const firestore = require("firebase/firestore");
import * as sharedRepoFunctions from "../js/utils/sharedRepositoryFunctions";

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
  query:jest.fn(),
}));

describe("EventRepository", () => {
  let eventRepo;
  let databaseMock;

  beforeEach(() => {
    databaseMock = {};
    eventRepo = new EventRepository(databaseMock);
    firestore.collection.mockReturnValue({});
    console.error = jest.fn();
    console.log = jest.fn();
    jest.clearAllMocks();
    firestore.doc.mockReset();
    firestore.updateDoc.mockReset();

    firestore.doc.mockReturnValue({});
    firestore.updateDoc.mockResolvedValue();

    // Mock Firestore query functions for checkFieldExists
    firestore.collection.mockReturnValue({});
    firestore.query.mockReturnValue({});
    firestore.getDocs.mockResolvedValue({ empty: false }); // Mock a non-empty result indicating field exists
  });

  describe("creating events", () => {
    it("should create a new event", async () => {
      const mockEvent = new Event(
        "Banku event",
        EVENT_TYPE.NEW_FOLLOWER,
        "123"
      );
      const eventType = EVENT_TYPE.NEW_FOLLOWER;

      firestore.doc.mockReturnValue(mockEvent);
      firestore.setDoc.mockResolvedValue(undefined);

      const result = await eventRepo.createEvent(mockEvent, eventType);

      console.log("mocked event JSON is: ", mockEvent.toJSON());
      expect(firestore.doc).toHaveBeenCalledWith(
        databaseMock,
        "events",
        mockEvent.id
      );
      expect(firestore.setDoc).toHaveBeenCalledWith(
        mockEvent,
        mockEvent.toJSON()
      );
      expect(result).toBe(mockEvent.id);
    });

    it("should create a new follower event", async () => {
      const followerId = "follower123";
      const followingId = "following123";
      const mockEvent = new Event(
        "Banku event",
        EVENT_TYPE.NEW_FOLLOWER,
        "123"
      );

      firestore.doc.mockReturnValue(mockEvent);
      firestore.setDoc.mockResolvedValue(undefined);

      firestore.setDoc.mockResolvedValueOnce(undefined);

      const result = await eventRepo.createNewFollowerEvent(
        followerId,
        followingId
      );

      expect(firestore.setDoc).toHaveBeenCalled();
      expect(firestore.doc).toHaveBeenCalled();
      expect(result).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });

    it("should create a share quiz event", async () => {
      const sharedById = "follower123";
      const sharedWithId = "following123";
      const mockEvent = new Event(
        "Share Quiz Event",
        EVENT_TYPE.NEW_FOLLOWER,
        "123"
      );

      firestore.doc.mockReturnValue(mockEvent);
      firestore.setDoc.mockResolvedValue(undefined);

      firestore.setDoc.mockResolvedValueOnce(undefined);

      const result = await eventRepo.createShareQuizEvent(
        sharedWithId,
        sharedById,
        "123"
      );

      expect(firestore.setDoc).toHaveBeenCalled();
      expect(firestore.doc).toHaveBeenCalled();
      expect(result).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });

    it("should create a share flashcard event", async () => {
      const sharedById = "follower123";
      const sharedWithId = "following123";
      const mockEvent = new Event(
        "Share Quiz Event",
        EVENT_TYPE.NEW_FOLLOWER,
        "123"
      );

      firestore.doc.mockReturnValue(mockEvent);
      firestore.setDoc.mockResolvedValue(undefined);

      firestore.setDoc.mockResolvedValueOnce(undefined);

      const result = await eventRepo.createShareFlashcardEvent(
        sharedWithId,
        sharedById,
        "123"
      );

      expect(firestore.setDoc).toHaveBeenCalled();
      expect(firestore.doc).toHaveBeenCalled();
      expect(result).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });
  });

  describe("get events", () => {
    it("should retrieve all events", async () => {
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
      const events = await eventRepo.getAllEvents();
      expect(firestore.getDocs).toHaveBeenCalled();
      expect(events).toHaveLength(2);
      expect(events[0]).toEqual(mockEventData1);
      expect(events[1]).toEqual(mockEventData2);
    });

    it("getEventByIdShould return event data if event exists", async () => {
      const eventId = "existingEventId";
      const mockEventData = { name: "Test Event", id: eventId }; // Mock event data

      firestore.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockEventData,
      });

      const result = await eventRepo.getEventById(eventId);

      expect(firestore.doc).toHaveBeenCalledWith(
        databaseMock,
        "events",
        eventId
      );
      expect(firestore.getDoc).toHaveBeenCalled();
      expect(result).toEqual(mockEventData);
    });

    it("getEventById should return a not found message if event does not exist", async () => {
      const eventId = "nonExistingEventId";

      firestore.getDoc.mockResolvedValue({
        exists: () => false,
        data: () => null,
      });

      const result = await eventRepo.getEventById(eventId);

      expect(firestore.doc).toHaveBeenCalledWith(
        databaseMock,
        "events",
        eventId
      );
      expect(firestore.getDoc).toHaveBeenCalled();
      expect(result).toBe(`event with id ${eventId} does not exist`);
    });
  });

  describe("delete upcoming events", () => {
    it("should log an error message if deletion fails", async () => {
      const upcomingEventId = "event123";
      const mockError = new Error("Failed to delete");
      firestore.deleteDoc.mockRejectedValue(mockError); // Mock failure

      await expect(
        eventRepo.deleteUpcomingEvent(upcomingEventId)
      ).rejects.toThrow(mockError);

      expect(firestore.deleteDoc).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(
        `Error removing upcoming event with ID: ${upcomingEventId} from collection upcomingEvents: ${mockError}`
      );
    });
  });

  it("should successfully delete an upcoming event", async () => {
    const upcomingEventId = "event123";
    firestore.deleteDoc.mockResolvedValue(undefined); // Mock successful deletion

    await eventRepo.deleteUpcomingEvent(upcomingEventId);

    expect(firestore.deleteDoc).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith("event deleted successfully");
  });

  describe("markUpcomingEventAsNotified", () => {
    it("should mark an upcoming event as notified", async () => {
      const upcomingEventId = "upcomingEvent123";

      firestore.doc.mockReturnValue({});
      firestore.updateDoc.mockResolvedValue(undefined);

      const result = await eventRepo.markUpcomingEventAsNotified(
        upcomingEventId
      );

      expect(firestore.doc).toHaveBeenCalledWith(
        databaseMock,
        "upcomingEvents",
        upcomingEventId
      );
      expect(firestore.updateDoc).toHaveBeenCalledWith(expect.anything(), {
        notified: true,
      });
      expect(result).toBe(true);
    });
  });

  describe("createUpcomingEvent", () => {
    it("should successfully create an upcoming event and return its ID", async () => {
      const mockEvent = {
        toJSON: () => ({ name: "Test Event" }), // Mock toJSON function
      };
      const mockDocRef = { id: "newEventId" };
      firestore.addDoc.mockResolvedValue(mockDocRef); // Mock successful creation

      const result = await eventRepo.createUpcomingEvent(mockEvent);

      expect(firestore.collection).toHaveBeenCalledWith(
        databaseMock,
        "upcomingEvents"
      );
      expect(firestore.addDoc).toHaveBeenCalledWith({}, mockEvent.toJSON());
      expect(result).toBe(mockDocRef.id);
    });

    it("should log an error and rethrow it if creating an event fails", async () => {
      const mockEvent = {
        toJSON: () => ({ name: "Test Event" }),
      };
      const mockError = new Error("Failed to create event");
      firestore.addDoc.mockRejectedValue(mockError); // Mock failure

      await expect(eventRepo.createUpcomingEvent(mockEvent)).rejects.toThrow(
        mockError
      );

      expect(firestore.collection).toHaveBeenCalledWith(
        databaseMock,
        "upcomingEvents"
      );
      expect(firestore.addDoc).toHaveBeenCalledWith({}, mockEvent.toJSON());
      expect(console.log).toHaveBeenCalledWith(
        `error adding event: ${mockError}`
      );
    });
  });

  describe("createUpcomingEvent", () => {
    it("getUpcomingEventByIdShould return event data if event exists", async () => {
      const eventId = "existingEventId";
      const mockEventData = { name: "Test Event", id: eventId }; // Mock event data

      firestore.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockEventData,
      });

      const result = await eventRepo.getUpcomingEventById(eventId);

      expect(firestore.doc).toHaveBeenCalledWith(
        databaseMock,
        "upcomingEvents",
        eventId
      );
      expect(firestore.getDoc).toHaveBeenCalled();
      expect(result).toEqual(mockEventData);
    });

    it("getUpcomingEventById should return a not found message if event does not exist", async () => {
      const eventId = "nonExistingEventId";

      firestore.getDoc.mockResolvedValue({
        exists: () => false,
        data: () => null,
      });

      const result = await eventRepo.getUpcomingEventById(eventId);

      expect(firestore.doc).toHaveBeenCalledWith(
        databaseMock,
        "upcomingEvents",
        eventId
      );
      expect(firestore.getDoc).toHaveBeenCalled();
      expect(result).toBe(`upcoming event with id ${eventId} does not exist`);
    });
  });

  it("should retrieve all upcoming events", async () => {
    const mockEventData1 = { name: "Event 0", type: "Type 1" };
    const mockEventData2 = { name: "Event 2", type: "Type 2" };

    firestore.getDocs.mockResolvedValueOnce({
      docs: [
        { name: "event1", data: () => mockEventData1 },
        { name: "event2", data: () => mockEventData2 },
      ],
      forEach: function (callback) {
        for (let doc of this.docs) {
          callback(doc);
        }
      },
    });
    const events = await eventRepo.getAllUpcomingEvents();
    expect(firestore.getDocs).toHaveBeenCalled();
    expect(events).toHaveLength(2);
    expect(events[0]).toEqual(mockEventData1);
    expect(events[1]).toEqual(mockEventData2);
  });

  describe("updateUpcomingEvent", () => {

    it("should throw an error for non-existing field in updateUpcomingEvent", async () => {
      const upcomingEventId = "upcomingEvent123";
      const updatedUpcomingEvent = { nonExistingField: "Some value", date:"2022-10-10", time:"19:19" };
    
      await expect(eventRepo.updateUpcomingEvent(upcomingEventId, updatedUpcomingEvent))
        .rejects
        .toThrow("The field nonExistingField does not exist in the upcomingEvents collection");
    });
    
  });

  describe("Tests with mocked updateNonArrayDocumentFields", () => {
    beforeEach(() => {
      // Mock updateNonArrayDocumentFields specifically for these tests
      sharedRepoFunctions.updateNonArrayDocumentFields = jest.fn().mockResolvedValue();
    });

    afterEach(() => {
      // Restore the original implementation after each test in this block
      jest.restoreAllMocks();
    });

    it("should successfully update an upcoming event using mocked updateNonArrayDocumentFields", async () => {
      const upcomingEventId = "upcomingEvent123";
      const updatedUpcomingEvent = {
        name: "Updated Event Name",
        date: "2023-07-20",
        time: "14:00"
      };

      // Call the method to test
      await eventRepo.updateUpcomingEvent(upcomingEventId, updatedUpcomingEvent);

      // Assertions to verify the behavior
      expect(sharedRepoFunctions.updateNonArrayDocumentFields).toHaveBeenCalledWith(
        databaseMock,
        upcomingEventId,
        "upcomingEvents",
        expect.objectContaining(updatedUpcomingEvent)
      );
    });
  });
  describe("markUpcomingEventAsNotified", () => {
    it("should mark an upcoming event as notified", async () => {
      const upcomingEventId = "upcomingEvent123";

      // Call the method to test
      const result = await eventRepo.markUpcomingEventAsNotified(upcomingEventId);

      // Assertions to verify correct Firestore functions were called
      expect(firestore.doc).toHaveBeenCalledWith(databaseMock, "upcomingEvents", upcomingEventId);
      expect(firestore.updateDoc).toHaveBeenCalledWith({}, { notified: true });
      expect(result).toBe(true);
    });

  });
});


