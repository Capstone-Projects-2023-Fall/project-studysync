import { database, auth } from '../../firebase';
import { collection, getDocs, getDoc, query, where, setDoc, doc, addDoc, deleteDoc, updateDoc, arrayUnion, Timestamp, arrayRemove } from 'firebase/firestore';

const FlashCardRepository = {

  getCurrentUid: function () {
    const user = auth.currentUser;
    return user ? user.uid : null;
  },

  getUserSubjects: async function (uid) {
    try {
      const userDoc = await getDoc(doc(database, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data().subject || [];
      } else {
        console.error("User with the given UID not found.");
        return [];
      }
    } catch (error) {
      console.error("Error fetching user subjects:", error);
      return [];
    }
  },

  getUserFlashcardSets: async function (uid) {
    try {
      const userDocRef = doc(database, 'users', uid);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        if (userData && userData.ownedFlashcards) {
          return userData.ownedFlashcards;
        }
      }
      return [];
    } catch (error) {
      console.error("Error fetching user flashcard sets:", error);
      return [];
    }
  },

  getFlashcardSetById: async function (setId) {
    try {
      const setDoc = await getDoc(doc(database, 'flashcardSets', setId));
      const data = setDoc.data();
      return {
        name: data?.name || '',
        subject: data?.subject || ''
      };
    } catch (error) {
      console.error("Error fetching flashcard set:", error);
      return null;
    }
  },


  createFlashcardSet: async function ({ name, subject }) {
    try {
      // Generate unique IDs for flashcard and comments
      const flashcardId = doc(collection(database, 'flashcards')).id;
      const commentId = doc(collection(database, 'comments')).id;

      const initialFlashcardItems = {
        [flashcardId]: {  // Use the generated ID as a key here
          term: "Sample Term",
          definition: "Sample Definition"
        },
      };

      const initialComments = {
        [commentId]: {  // Use the generated ID as a key here
          uid: this.getCurrentUid(),
          content: "Sample comment content",
          like: 0,
          timestamp: Timestamp.now()
        },
      };

      const setData = {
        name: name,
        createdAt: Timestamp.now(),
        authorId: this.getCurrentUid(),
        subject: subject,
        sharedWith: [],
        flashcardItems: initialFlashcardItems,
        comments: initialComments
      };

      const newDocRef = await addDoc(collection(database, 'flashcardSets'), setData);
      console.log("New flashcard set created with ID:", newDocRef.id);

      const uid = this.getCurrentUid();
      if (uid) {
        await this.addOwnedFlashcardSetToUser(uid, newDocRef.id);
      }

      return newDocRef.id;
    } catch (error) {
      console.error("Error creating flashcard set:", error);
      throw error;
    }
},



  addOwnedFlashcardSetToUser: async function (uid, flashcardSetId) {
    try {
      const userDocRef = doc(database, 'users', uid);

      await updateDoc(userDocRef, {
        ownedFlashcards: arrayUnion(flashcardSetId)
      });

      console.log(`FlashcardSet ID ${flashcardSetId} added to user with UID ${uid}`);
    } catch (error) {
      console.error("Error adding flashcardSet ID to user:", error);
      throw error;
    }
  },



  updateFlashcard: async function (setId, cardId, cardData) {
    try {
      await setDoc(doc(database, 'flashcardSets', setId, 'flashcards', cardId), cardData);
    } catch (error) {
      console.error("Error updating flashcard:", error);
      throw error;
    }
  },


  addFlashcardItem: async function (setId, term, definition) {
    try {
      const flashcardId = doc(collection(database, 'flashcards')).id;
    

      const cardData = {
        term: term,
        definition: definition,
      };

      const flashcardSetRef = doc(database, 'flashcardSets', setId);

      const snap = await getDoc(flashcardSetRef);
      const data = snap.data();
      let flashcardItems = data.flashcardItems || {};

      flashcardItems[flashcardId] = cardData;
      console.log("Adding new flashcard:", flashcardItems);
      await updateDoc(flashcardSetRef, {
        flashcardItems: flashcardItems
      });
      return flashcardId;

    } catch (error) {
      console.error("fetch flashcard error", error);
      throw error;
    }
  },

  deleteFlashcard: async function (setId, flashcardIdToDelete) {
    try {
      const flashcardSetRef = doc(database, 'flashcardSets', setId);
      const snap = await getDoc(flashcardSetRef);
      const data = snap.data();
      let flashcardItems = data.flashcardItems || {};

      // Check if the flashcardId exists in the flashcardItems map
      if (flashcardItems[flashcardIdToDelete]) {
        // Delete the flashcard from the map
        delete flashcardItems[flashcardIdToDelete];

        // Update the database with the modified flashcardItems
        await updateDoc(flashcardSetRef, {
          flashcardItems: flashcardItems
        });
        console.log(`Flashcard with ID ${flashcardIdToDelete} deleted successfully.`);
      } else {
        console.log(`Flashcard with ID ${flashcardIdToDelete} not found.`);
      }

    } catch (error) {
      console.error("Error deleting flashcard", error);
      throw error;
    }
  },








  addUserSubject: async function (uid, newSubject) {
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

  async removeUidFromSharedWith(setId, uid) {
    try {
      const setRef = doc(database, 'flashcardSets', setId);
      await updateDoc(setRef, {
        sharedWith: arrayRemove(uid)  // Assuming 'sharedWith' is an array of user IDs
      });
    } catch (error) {
      console.error("Error removing UID from sharedWith:", error);
    }
  },

  async removeSetIdFromUser(uid, setId) {
    try {
      const userRef = doc(database, 'users', uid); // Assuming 'users' is the name of your user collection
      await updateDoc(userRef, {
        ownedFlashcards: arrayRemove(setId)  // Assuming the field is named 'flashcardSets' and it's an array of setIds
      });
    } catch (error) {
      console.error("Error removing set ID from user:", error);
    }
  },

  async getSetIdByTopicName(topicName) {
    try {
      const querySnapshot = await getDocs(query(collection(database, 'flashcardSets'), where('name', '==', topicName)));
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].id;
      }
      return null;
    } catch (error) {
      console.error("Error fetching set ID by topic name:", error);
      return null;
    }
  },

  getFlashcardItems: async function (setId) {
    try {
      const setRef = doc(database, 'flashcardSets', setId);
      const setSnapshot = await getDoc(setRef);
      const setData = setSnapshot.data();
      const flashcardData = setData.flashcardItems || [];
      return flashcardData;
    } catch (error) {
      console.error("Error getting flashcard items:", error);
      throw error;
    }
  },

  getCommentsWithUserData: async function (setId) {
    try {
      const setRef = doc(database, 'flashcardSets', setId);
      const setSnapshot = await getDoc(setRef);
      const setData = setSnapshot.data();
      const commentsMap = setData.comments || {};

      const commentsData = [];
      for (let commentId in commentsMap) {  
        const comment = commentsMap[commentId];  

        const userRef = doc(database, 'users', comment.uid);
        const userSnapshot = await getDoc(userRef);
        const userData = userSnapshot.data();

        commentsData.push({
          content: comment.content,
          date: comment.date,
          like: comment.like,
          username: userData.username,
          imageURL: userData.imageURL
        });
      }

      return commentsData;
    } catch (error) {
      console.error("Error getting comments with user data:", error);
      throw error;
    }
  }





};

export default FlashCardRepository;
