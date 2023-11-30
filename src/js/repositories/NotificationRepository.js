import {
    getItemById,
    removeDocumentFromCollection,
    getAllItems,
    setField,
} from "../utils/sharedRepositoryFunctions";
import { addDoc, collection, doc, updateDoc} from "firebase/firestore";
import { updateNotification } from "../react/useNotificationCount";

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
        return  await this.getNotification(id);
    }

    async update(id){
        const noti =  await updateNotification(id)
        await this.updateNoti(id, noti)
        return noti
    }

    async updateNoti(notiId, obj) {
        const userRef = doc(this.database, "notifications", notiId);
        try {
            await updateDoc(userRef, obj);
        } catch (error) {
            console.error("Error:", error);
        }
      }

      async getListOfNotifications(listOfNotificationIds){
        const res = []
        let nullCount = 0
        for(const id of listOfNotificationIds){
            const noti = await this.getNotificationById(id)
            res.push(noti)
            if(!noti.event){
                nullCount += 1
            }
        }
        console.log("aaidoo list of notifications: ", res.length)
        console.log("aaidoo, nullCount is: ", nullCount)
        console.log(res)

        return res
      }
}