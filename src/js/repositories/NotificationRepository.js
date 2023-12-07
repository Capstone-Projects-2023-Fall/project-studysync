import {
    getItemById,
    removeDocumentFromCollection,
    getAllItems,
    setField,
} from "../utils/sharedRepositoryFunctions";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { updateNotification } from "../react/useNotificationCount";
/**
 * @class NotificationRepository
 * @classdesc NotificationRepository - Manages notification-related data interactions with the database.
 * 
 * @param {Object} database - The database connection used for accessing notification data.
 * @param {EventRepository} eventRepo - An instance of EventRepository for event-related operations.
 */
export class NotificationRepository {
    constructor(database, eventRepo) {
        this.database = database;
        this.eventRepo = eventRepo;
    }
    /**
       * @memberof NotificationRepository
       * @function getNotification
       * @description Retrieves a single notification by its ID.
       * @param {string} id - The ID of the notification to retrieve.
       * @returns {Promise<Object>} A promise that resolves to the notification object.
       */
    async getNotification(id) {
        const notification = await getItemById(
            this.database,
            id,
            "notifications",
            "notification"
        );
        return notification;
    }
    /**
       * @memberof NotificationRepository
       * @function getAllNotifications
       * @description Retrieves all notifications from the database.
       * @returns {Promise<Array<Object>>} A promise that resolves to an array of notification objects.
       */
    async getAllNotifications() {
        const notifications = await getAllItems(this.database, "notifications");
        return notifications;
    }
    /**
      * @memberof NotificationRepository
      * @function removeNotification
      * @description Removes a notification from the database.
      * @param {string} id - The ID of the notification to be removed.
      * @returns {Promise<void>}
      */
    async removeNotification(id) {
        await removeDocumentFromCollection(
            this.database,
            id,
            "notifications",
            "notification"
        );
    }
    /**
       * @memberof NotificationRepository
       * @function addNotification
       * @description Adds a new notification to the database.
       * @param {Object} notification - The notification object to add.
       * @returns {Promise<string>} A promise that resolves to the ID of the newly added notification.
       */
    async addNotification(notification) {
        try {
            const notificationsCollection = collection(
                this.database,
                "notifications"
            );
            const notificationRef = await addDoc(
                notificationsCollection,
                notification.toJSON()
            );
            await setField(
                this.database,
                notificationRef.id,
                "notifications",
                "id",
                notificationRef.id
            );
            return notificationRef.id;
        } catch (error) {
            console.log("error adding notification", error);
        }
    }
    /**
       * @memberof NotificationRepository
       * @function getNotificationById
       * @description Retrieves a notification by its ID.
       * @param {string} id - The ID of the notification to retrieve.
       * @returns {Promise<Object>} A promise that resolves to the notification object.
       */
    async getNotificationById(id) {
        return await this.getNotification(id);
    }
    /**
      * @memberof NotificationRepository
      * @function update
      * @description Updates a notification's data in the database.
      * @param {string} id - The ID of the notification to update.
      * @returns {Promise<Object>} A promise that resolves to the updated notification object.
      */
    async update(id) {
        const noti = await updateNotification(id);
        await this.updateNoti(id, noti);
        return noti;
    }
    /**
      * @memberof NotificationRepository
      * @function updateNoti
      * @description Updates specific fields of a notification in the database.
      * @param {string} notiId - The ID of the notification to update.
      * @param {Object} obj - The object containing updated fields for the notification.
      * @returns {Promise<void>}
      */
    async updateNoti(notiId, obj) {
        const userRef = doc(this.database, "notifications", notiId);
        try {
            await updateDoc(userRef, obj);
        } catch (error) {
            console.error("Error:", error);
        }
    }
    /**
       * @memberof NotificationRepository
       * @function getListOfNotifications
       * @description Retrieves a list of notifications by their IDs.
       * @param {Array<string>} listOfNotificationIds - An array of notification IDs.
       * @returns {Promise<Array<Object>>} A promise that resolves to an array of notification objects.
       */
    async getListOfNotifications(listOfNotificationIds) {
        const res = [];
        let nullCount = 0;
        for (const id of listOfNotificationIds) {
            const noti = await this.getNotificationById(id);
            res.push(noti);
            if (!noti.event) {
                nullCount += 1;
            }
        }
        console.log("aaidoo list of notifications: ", res.length);
        console.log("aaidoo, nullCount is: ", nullCount);
        console.log(res);

        return res;
    }
}