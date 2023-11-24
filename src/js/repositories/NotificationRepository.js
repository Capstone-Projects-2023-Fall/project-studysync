import {
  getItemById,
  removeDocumentFromCollection,
  getAllItems,
  setField,
} from "../utils/sharedRepositoryFunctions";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

export class NotificationRepository {
  constructor(database, eventRepo) {
    this.database = database;
    this.eventRepo = eventRepo;
  }

  async getNotification(id) {
    const notification = await getItemById(
      this.database,
      id,
      "notifications",
      "notification"
    );
    return notification;
  }

  async getAllNotifications() {
    const notifications = await getAllItems(this.database, "notifications");
    return notifications;
  }

  async removeNotification(id) {
    await removeDocumentFromCollection(
      this.database,
      id,
      "notifications",
      "notification"
    );
  }

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

  async getNotificationById(id) {
    const notification = await this.getNotification(id);

    const eventId = notification.eventId;

    const event = await this.eventRepo.getEventById(eventId);
    return {
      message: notification.message,
      event: event,
    };
  }
}
