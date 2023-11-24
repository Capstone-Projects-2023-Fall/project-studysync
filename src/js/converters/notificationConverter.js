export const notificationConverter = {
  toFirestore: (notification) => {
    return {
      event: notification.event,
      createdAt: notification.createdAt,
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    data.id = snapshot.id;
    return setNotification(data);
  },
};

function setNotification(data) {
  const notification = new Notification(data.event || "");
  notification.createdAt = data.createdAt || "";
  notification.id = data.id;
  return notification;
}
