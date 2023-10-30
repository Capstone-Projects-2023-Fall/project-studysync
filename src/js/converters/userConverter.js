import User from "../models/user"
export const userConverter = {
    toFirestore: (user) => {
        return {
          id : user.id,
          username: user.username,
          email: user.email,
          bio: user.bio,
          following: user.following,
          followers: user.followers,
          imageUrl: user.imageUrl,
          ownedQuizzes: user.ownedQuizzes,
          sharedQuizzes: user.sharedQuizzes,
          ownedFlashcards : user.sharedFlashcards,
          sharedFlashcards : user.sharedFlashcards,
          notifications: user.notifications,
          events: user.events,
          phone: user.phone,
          name: user.name,
          profession: user.profession
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return setUser(data);
    }
  };
  
  function setUser(data){
    const user = new User()
    user.id = data.id
      user.username = data.username;
      user.email = data.email;
        user.bio = data.bio;
        user.following = data.following;
        user.followers = data.followers;
        user.imageUrl = data.imageUrl;
        user.ownedQuizzes = data.ownedQuizzes
        user.sharedQuizzes = data.sharedQuizzes
        user.ownedFlashcards = data.ownedFlashcards
        user.sharedFlashcards = data.sharedFlashcards
        user.notifications = data.notifications
        user.events = data.events
        user.name = data.name
        user.profession = data.profession
        user.phone = data.phone
        return user
  }
  
  