import { database, auth } from '../../firebase';
import { collection, getDocs, getDoc, query, where, setDoc, doc, addDoc, deleteDoc, updateDoc, arrayUnion } from 'firebase/firestore';

const FlashCardRepository = {

  getCurrentUid: function() {
    const user = auth.currentUser;
    return user ? user.uid : null;
  },

  getUserSubjects: async function(uid) {
    try {
      const userDoc = await getDoc(doc(database, 'users', uid)); // 使用 getDoc
      if (userDoc.exists()) {
        return userDoc.data().subject || [];
      } else {
        console.error("User with the given UID not found.");
        return [];
      }
    } catch (error) {
      console.error("Error fetching user subjects:", error);
      throw error;
    }
  },
  

  getUserFlashcardSets: async function(uid) {
    try {
      const userDoc = await getDocs(doc(database, 'users', uid)); 
      return userDoc.data().ownedFlashcards || []; 
    } catch (error) {
      console.error("Error fetching user flashcard sets:", error);
      throw error;
    }
  },

  getFlashcardSetById: async function(setId) {
    try {
      const setDoc = await getDocs(doc(database, 'flashcardSets', setId)); 
      return setDoc.data();
    } catch (error) {
      console.error("Error fetching flashcard set:", error);
      throw error;
    }
  },

  updateFlashcard: async function(setId, cardId, cardData) {
    try {
      await setDoc(doc(database, 'flashcardSets', setId, 'flashcards', cardId), cardData); 
    } catch (error) {
      console.error("Error updating flashcard:", error);
      throw error;
    }
  },

  addFlashcardToSet: async function(setId, cardData) {
    const cardsCollection = collection(database, 'flashcardSets', setId, 'flashcards'); 
    try {
      await addDoc(cardsCollection, cardData);
    } catch (error) {
      console.error("Error adding flashcard:", error);
      throw error;
    }
  },

  deleteFlashcard: async function(setId, cardId) {
    try {
      await deleteDoc(doc(database, 'flashcardSets', setId, 'flashcards', cardId)); 
    } catch (error) {
        console.error("Error deleting flashcard:", error);
        throw error;
      }
    },

    addUserSubject: async function(uid, newSubject) {
        try {
          const userRef = doc(database, 'users', uid);
          await updateDoc(userRef, {
            subject: arrayUnion(newSubject)
          });
          console.log("Subject added successfully.");
        } catch (error) {
          console.error("Error adding subject:", error);
          throw error;
        }
  },

};
  
  export default FlashCardRepository;