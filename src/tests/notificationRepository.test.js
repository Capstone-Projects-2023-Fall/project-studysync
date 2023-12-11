import { NotificationRepository } from "../js/repositories/NotificationRepository";
const firestore = require("firebase/firestore");
import * as sharedRepoFunctions from "../js/utils/sharedRepositoryFunctions"
import * as notificationUtil from "../js/react/useNotificationCount"
jest.mock("firebase/firestore", () => ({
    setDoc: jest.fn(),
    doc: jest.fn(),
    collection: jest.fn(),
    addDoc: jest.fn(),
    getDocs: jest.fn(),
    updateDoc: jest.fn(),
    getDoc: jest.fn(),
    deleteDoc: jest.fn(),
    setField: jest.fn(),
}));

jest.mock('../js/react/useNotificationCount', () => ({
    updateNotification: jest.fn(),
  }));

  jest.mock("../js/utils/sharedRepositoryFunctions", () => ({
    updateNotification: jest.fn(),
  }));

  jest.mock('../js/utils/sharedRepositoryFunctions', () => ({
    getItemById: jest.fn(),
    removeDocumentFromCollection: jest.fn(),
    getAllItems: jest.fn(),
    setField: jest.fn(),
  }));
  

describe("NotificationRepository", ()=>{
    let eventRepoMock
    let notificationRepo
    let databaseMock 

    beforeEach(() => {
        databaseMock = {};
        eventRepoMock = {}
        notificationRepo = new NotificationRepository(databaseMock, eventRepoMock)
        firestore.collection.mockReturnValue({});
        console.error = jest.fn();
        console.log = jest.fn();
        jest.clearAllMocks();
      });

      describe("notificationRepository", ()=>{
        it("getNotificationById", async () => {
            const mockNotificationId = 'notification-id';
            const mockNotificationData = { title: 'Test Notification', id: mockNotificationId };
            sharedRepoFunctions.getItemById.mockResolvedValue(mockNotificationData);
      
            // Act
            const result = await notificationRepo.getNotificationById(mockNotificationId);
      
            // Assert
            expect(sharedRepoFunctions.getItemById).toHaveBeenCalledWith(databaseMock, mockNotificationId, 'notifications', 'notification');
            expect(result).toEqual(mockNotificationData);
        })

        it("addNotification", async ()=>{
            // Arrange
            const mockNotification = {
                toJSON: jest.fn().mockReturnValue({ title: 'Test Notification' })
            };
            const mockNotificationId = 'notification-id';
            firestore.addDoc.mockResolvedValue({ id: mockNotificationId });

            // Act
            const result = await notificationRepo.addNotification(mockNotification);

            // Assert
            expect(firestore.collection).toHaveBeenCalledWith(databaseMock, 'notifications');
            expect(firestore.addDoc).toHaveBeenCalledWith(expect.anything(), { title: 'Test Notification' });
            expect(sharedRepoFunctions.setField).toHaveBeenCalledWith(databaseMock, mockNotificationId, 'notifications', 'id', mockNotificationId);
            expect(result).toEqual(mockNotificationId);
        })

        it("update", async() =>{
            notificationUtil.updateNotification.mockResolvedValue([])
            // notificationRepo.updateNoti = jest.fn()
            const notification = await notificationRepo.update("userId")
            expect(firestore.updateDoc).toHaveBeenCalled()
            expect(notification.length).toEqual(0)
        })

        it("updateNoti", async()=>{

        })

        it("getListOfNotifications", async()=>{

        const notifs =[{id:"1"},{id:"2"},{id:"3"}] 
           notificationRepo.getNotificationById = jest.fn().mockImplementation((id)=>{
                for(const noti of notifs){
                    if(noti.id == id) return Promise.resolve(noti)
                }
                return Promise.reject("Unable to find noti")
           })

           const ids = ["1", "2", "3"]

           const res = await notificationRepo.getListOfNotifications(ids)
           expect(res).toEqual(notifs)
        })

        it("getListOfNotifications, invalid notification id throws error", async () => {
            const notifs = [{ id: "1" }, { id: "2" }, { id: "3" }];
            notificationRepo.getNotificationById = jest.fn().mockImplementation((id) => {
              for (const noti of notifs) {
                if (noti.id === id) return Promise.resolve(noti);
              }
              return Promise.reject(new Error("Unable to find noti"));
            });
          
            const ids = ["1", "2", "4"];
          
            await expect(notificationRepo.getListOfNotifications(ids)).rejects.toThrow("Unable to find noti");
          });
          
      })

      describe('updateNoti', () => {
        it('should successfully update a notification', async () => {
          // Arrange
          const mockNotiId = 'notification-id';
          const mockUpdateObject = { title: 'Updated Notification' };
          firestore.doc.mockReturnValue({}); // Mock the doc reference
          firestore.updateDoc.mockResolvedValue(); // Mock updateDoc as resolved
    
          // Act
          await notificationRepo.updateNoti(mockNotiId, mockUpdateObject);
    
          // Assert
          expect(firestore.doc).toHaveBeenCalledWith(databaseMock, 'notifications', mockNotiId);
          expect(firestore.updateDoc).toHaveBeenCalledWith({}, mockUpdateObject);
        });
    
        it('should handle errors when updating a notification', async () => {
          // Arrange
          const mockNotiId = 'notification-id';
          const mockUpdateObject = { title: 'Updated Notification' };
          const mockError = new Error('Update failed');
          firestore.doc.mockReturnValue({}); // Mock the doc reference
          firestore.updateDoc.mockRejectedValue(mockError);
          console.error = jest.fn(); // Mock console.error
    
          // Act
          await notificationRepo.updateNoti(mockNotiId, mockUpdateObject);
    
          // Assert
          expect(firestore.doc).toHaveBeenCalledWith(databaseMock, 'notifications', mockNotiId);
          expect(firestore.updateDoc).toHaveBeenCalledWith({}, mockUpdateObject);
          expect(console.error).toHaveBeenCalledWith("Error:", mockError);
        });
      });
})



  