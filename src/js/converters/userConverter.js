import User from "../models/user";
export const userConverter = {
  toFirestore: (user) => {
    return {
      id: user.id,
      username: user.username,
      firstName: this.firstName,
      lastName: this.lastName,
      email: user.email,
      bio: user.bio,
      following: user.following,
      followers: user.followers,
      imageURL: user.imageURL,
      ownedQuizzes: user.ownedQuizzes,
      sharedQuizzes: user.sharedQuizzes,
      ownedFlashcards: user.sharedFlashcards,
      sharedFlashcards: user.sharedFlashcards,
      notifications: user.notifications,
      events: user.events,
      phone: user.phone,
      name: user.name,
      profession: user.profession,
      subjects: user.subjects,
      newNotifications: user.newNotifications,
      unseenNotifications: user.unseenNotifications,
      upcomingEvents: user.upcomingEvents,
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return setUser(data);
  },
};

function setUser(data) {
  const user = new User();
  user.id = data.id;
  user.username = data.username;
  user.email = data.email;
  user.bio = data.bio;
  user.firstName = data.firstName;
  user.lastName = data.lastName;
  user.following = data.following;
  user.followers = data.followers;
  user.imageURL = data.imageURL;
  user.ownedQuizzes = data.ownedQuizzes;
  user.sharedQuizzes = data.sharedQuizzes;
  user.ownedFlashcards = data.ownedFlashcards;
  user.sharedFlashcards = data.sharedFlashcards;
  user.notifications = data.notifications;
  user.events = data.events;
  user.name = data.name;
  user.profession = data.profession;
  user.phone = data.phone;
  user.subjects = data.subjects;
  user.newNotifications = data.newNotifications;
  user.unseenNotifications = data.unseenNotifications;
  user.upcomingEvents = data.upcomingEvents;
  return user;
}
