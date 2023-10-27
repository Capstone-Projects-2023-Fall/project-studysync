export const notificationConverter = {
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
  
  
