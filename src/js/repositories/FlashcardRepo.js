import { database, auth } from '../../firebase';
import { collection, getDocs, getDoc, query, where, setDoc, doc, addDoc, deleteDoc, updateDoc, arrayUnion, Timestamp, arrayRemove } from 'firebase/firestore';

const FlashcardRepo = {

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

            const flashcardId = doc(collection(database, 'flashcards')).id;
            const commentId = doc(collection(database, 'comments')).id;
            const questionId = doc(collection(database, 'questions')).id;

            const initialFlashcardItems = {
                [flashcardId]: {
                    term: "Sample Term",
                    definition: "Sample Definition"
                },
            };

            const initialComments = {
                [commentId]: {
                    uid: this.getCurrentUid(),
                    content: "Sample comment content",
                    like: 0,
                    date: Timestamp.now()
                },
            };

            const initialQuizItems = {
                [questionId]: {
                    question: "Sample Question",
                    answer: "Sample Answer",
                    choices: "Choices"
                },
            };

            const setData = {
                name: name,
                createdAt: Timestamp.now(),
                authorId: this.getCurrentUid(),
                subject: subject,
                sharedWith: [],
                flashcardItems: initialFlashcardItems,
                questionItems: initialQuizItems,
                comments: initialComments
            };

            const newDocRef = await addDoc(collection(database, 'flashcardSets'), setData);
            console.log("New flashcard set created with ID:", newDocRef.id);

            const uid = this.getCurrentUid();
            if (uid) {
                await this.addOwnedFlashcardSetToUser(uid, newDocRef.id);
                await this.addOwnedQuizSetToUser(uid, newDocRef.id);
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



    updateFlashcardSetName: async function (setId, newName) {
        try {
            const flashcardSetRef = doc(database, 'flashcardSets', setId);
            const snap = await getDoc(flashcardSetRef);


            if (snap.exists()) {

                await updateDoc(flashcardSetRef, {
                    name: newName
                });
                console.log(`Flashcard set with ID ${setId} updated successfully with new name: ${newName}.`);
            } else {
                console.log(`Flashcard set with ID ${setId} not found.`);
            }

        } catch (error) {
            console.error("Error updating flashcard set name:", error);
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

            if (flashcardItems[flashcardIdToDelete]) {

                delete flashcardItems[flashcardIdToDelete];

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

    updateFlashcard: async function (setId, flashcardIdToUpdate, newTerm, newDefinition) {
        try {
            const flashcardSetRef = doc(database, 'flashcardSets', setId);
            const snap = await getDoc(flashcardSetRef);
            const data = snap.data();
            let flashcardItems = data.flashcardItems || {};

            if (flashcardItems[flashcardIdToUpdate]) {

                flashcardItems[flashcardIdToUpdate] = {
                    term: newTerm,
                    definition: newDefinition
                };

                await updateDoc(flashcardSetRef, {
                    flashcardItems: flashcardItems
                });
                console.log(`Flashcard with ID ${flashcardIdToUpdate} updated successfully.`);
            } else {
                console.log(`Flashcard with ID ${flashcardIdToUpdate} not found.`);
            }
        } catch (error) {
            console.error("Error updating flashcard", error);
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

    removeUidFromSharedWith: async function (setId, uid) {

        try {
            const setRef = doc(database, 'flashcardSets', setId);
            await updateDoc(setRef, {
                sharedWith: arrayRemove(uid)
            });
        } catch (error) {
            console.error("Error removing UID from sharedWith:", error);
        }
    },

    removeSetIdFromUser: async function (uid, setId) {

        try {
            const userRef = doc(database, 'users', uid);
            await updateDoc(userRef, {
                ownedFlashcards: arrayRemove(setId)
            });
        } catch (error) {
            console.error("Error removing set ID from user:", error);
        }
    },


    getUserImageURLByUid: async function (uid) {
        try {
            const userRef = doc(database, 'users', uid);
            const userSnapshot = await getDoc(userRef);

            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                if (userData && userData.imageURL) {
                    return userData.imageURL;
                } else {
                    console.error("User avatar URL not found for the given UID.");
                    return null;
                }
            } else {
                console.error("User with the given UID not found.");
                return null;
            }
        } catch (error) {
            console.error("Error fetching user avatar URL by UID:", error);
            throw error;
        }
    },


    getSetIdByTopicName: async function (topicName) {
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
                    username: userData.name,
                    imageURL: userData.imageURL,
                    commentId: commentId
                });
            }

            return commentsData;
        } catch (error) {
            console.error("Error getting comments with user data:", error);
            throw error;
        }
    },
    updateLikesForComment: async function (setId, commentId, updatedLikes) {
        try {

            const setRef = doc(database, 'flashcardSets', setId);

            const fieldPath = `comments.${commentId}.like`;

            await updateDoc(setRef, {
                [fieldPath]: updatedLikes
            });

            console.log(`Successfully updated likes for comment ${commentId} to ${updatedLikes}.`);
        } catch (error) {
            console.error("Error updating likes for comment:", error);
            throw error;
        }
    },
    addComment: async function (setId, commentData) {
        try {
            const setRef = doc(database, 'flashcardSets', setId);
            const snap = await getDoc(setRef);
            const setData = snap.data();

            if (setData && setData.comments) {

                const updatedComments = {
                    ...setData.comments,
                    [doc(collection(database, 'comments')).id]: commentData
                };

                await updateDoc(setRef, {
                    comments: updatedComments
                });

                console.log(`Successfully added a new comment to flashcard set with ID ${setId}.`);
            } else {
                console.error(`Flashcard set with ID ${setId} does not exist or has no 'comments' field.`);
            }
        } catch (error) {
            console.error("Error adding comment:", error);
            throw error;
        }
    },

    // add owned quizzes into the users table using the flashcardSet id
    addOwnedQuizSetToUser: async function (uid, quizSetId) {
        try {
            const userDocRef = doc(database, 'users', uid);

            await updateDoc(userDocRef, {
                ownedQuizzes: arrayUnion(quizSetId)
            });

            console.log(`QuizSet ID ${quizSetId} added to user with UID ${uid}`);
        } catch (error) {
            console.error("Error adding quizset ID to user:", error);
            throw error;
        }
    },

       // add all question data to the database table called "flashcardSets"
       addQuizQuestion: async function (setId, question, choices, correctChoiceIndex) {
        try {
          const questionId = doc(collection(database, 'questions')).id;
      
          const questionData = {
            question: question,
            choices: choices,
            correctChoice: correctChoiceIndex,
          };
      
          const flashcardSetRef = doc(database, 'flashcardSets', setId); // Use 'flashcardSets' collection
      
          const snap = await getDoc(flashcardSetRef);
          const data = snap.data();
          let questionItems = data.questionItems || {};
      
          questionItems[questionId] = questionData;
          console.log("Adding new question:", questionItems);
          await updateDoc(flashcardSetRef, {
            questionItems: questionItems
          });
          return questionId;
        } catch (error) {
          console.error("Error adding quiz question", error);
          throw error;
        }
      },

      // delete question from the flashcardSets table and from questionItems field
      deleteQuestion: async function (setId, questionIdToBeDeleted) {
        try {
            const flashcardSetRef = doc(database, 'flashcardSets', setId);
            const snap = await getDoc(flashcardSetRef);
            const data = snap.data();
            let questionItems = data.questionItems || {};

            if (questionItems[questionIdToBeDeleted]) {

                delete questionItems[questionIdToBeDeleted];

                await updateDoc(flashcardSetRef, {
                    questionItems: questionItems
                });
                console.log(`Flashcard with ID ${questionIdToBeDeleted} deleted successfully.`);
            } else {
                console.log(`Flashcard with ID ${questionIdToBeDeleted} not found.`);
            }

        } catch (error) {
            console.error("Error deleting flashcard", error);
            throw error;
        }
    },

    // get all the question data from the database called quizSet
    getQuestionItems: async function (setId) {
        try {
            const setRef = doc(database, 'flashcardSets', setId);
            const setSnapshot = await getDoc(setRef);
            const setData = setSnapshot.data();
            const questionData = setData.questionItems || [];
            return questionData;
        } catch (error) {
            console.error("Error getting flashcard items:", error);
            throw error;
        }
    },


};

export default FlashcardRepo;