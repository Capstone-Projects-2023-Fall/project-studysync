import { getItemById, removeDocumentFromCollection, getAllItems, setField } from "../utils/sharedRepositoryFunctions"
import { addDoc, collection, doc, setDoc } from "firebase/firestore"

export class NotificationRepository{

    constructor(database){
        this.database = database
    }

    async getNotification(id){
        const notification = await getItemById(this.database, id, "notifications", "notification")
        return notification
    }

    async getAllNotifications(){
        const notifications = await getAllItems(this.database, "notifications")
        return notifications
    }

    async removeNotification(id){
        await removeDocumentFromCollection(this.database, id, "notifications", "notification")
    }

    async addNotification(notification){
        try{
            const notificationsCollection = collection(this.database, 'notifications')
            // const notificationRef = await addDoc(notificationsCollection, {})
            // notification.id = notificationRef.id

            // const r = doc(this.database, "notifications", notificationRef.id).withConverter(notificationConverter)
            // await setDoc(r, notification)

            // return notificationRef.id
             // Use addDoc to create a new document with the provided notification object
           // Use addDoc to create a new document with the provided notification object
            const notificationRef = await addDoc(notificationsCollection, notification.toJSON());
            await setField(this.database, notificationRef.id, "notifications", "id", notificationRef.id)
            return notificationRef.id;
          }catch(error){
            console.log("error adding notification", error)
        }
    }
}

const notificationConverter = {
    toFirestore: (notification) => {
        return {
            event: notification.event,
            message: notification.message,
            createdAt: notification.createdAt,
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        data.id = snapshot.id
        return setNotification(data);
    }
  };
  
  function setNotification(data){
    const notification = new Notification(data.event || '', data.message || '');
    notification.createdAt = data.createdAt || ''
    notification.id = data.id
    return notification

  }
  
  
