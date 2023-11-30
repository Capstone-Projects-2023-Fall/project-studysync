import { setDoc, doc, collection, onSnapshot, updateDoc } from "firebase/firestore";
import useUser from "./useUser";
import { EVENT_TYPE } from "../models/event";

import { useState, useEffect } from 'react';
import 'firebase/firestore';

import { userRepository, flashcardRepository, eventRepository, quizRepository, notificationRepository, database} from "../../firebase";

const useNotificationCount = () => {

    const {user}= useUser()
      const [notificationCount, setNotificationCount] = useState(0);
        useEffect(() => {
    
          if(user===null){
            return
          }
          
          const notificationDocRef = doc(database, 'users', user.uid);
      
          const unsubscribe = onSnapshot(notificationDocRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
              const data = docSnapshot.data();
              const newNotificationCount = data.newNotifications;
              if (newNotificationCount !== notificationCount) {
                setNotificationCount(newNotificationCount);
              }
            }
          });
      
          return () => unsubscribe();
        }, [notificationCount, user]);
      
    
      return notificationCount;
    };
  
    export async function updateNotification(id) {
   
      let notification =
          await notificationRepository.getNotificationById(id);
         
      let userFromId = null;
      let userFrom = null;
      let quiz = null;
      let quizId = null;
      let flashcardId = null;
      let flashcard = null;
      const event = await eventRepository.getEventById(
          notification.eventId
      );
      notification.event = event
  
      switch (event.eventType) {
          case EVENT_TYPE.NEW_FOLLOWER:
              userFromId = event.newFollowerEvent.followerId;
              break;
          case EVENT_TYPE.SHARE_QUIZ:
              userFromId = event.shareQuizEvent.sharedBy;
              quizId = event.shareQuizEvent.itemId;
              break;
          case EVENT_TYPE.SHARE_FLASHCARD:
              userFromId = event.shareFlashcardEvent.sharedBy;
              flashcardId = event.shareFlashcardEvent.itemId;
              break;
          default:
              break;
      }
  
      if (userFromId != null) {
          userFrom = await userRepository.getUserById(userFromId);

        notification.userFrom = {
            name: userFrom.name, 
            imageURL: userFrom.imageURL,
            id: userFrom.id
        };
      }
  
  
      if (quizId != null) {
          quiz = await quizRepository.get_QuizById(quizId);
          notification.quiz = {
            name: quiz.name,
            id: quiz.id, 
          }
      }
  
      if (flashcardId != null) {
          flashcard = await flashcardRepository.getFlashcardSetBy_Id(
              flashcardId
          );
          notification.flashcard = {
            name: flashcard.name,
            id: flashcard.id
          }
      }
  
    return notification
  
  }
  export default useNotificationCount;
  