import { useId } from 'react';
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
                    definition: "Sample Definition",
                    status: ""
                },
            };

            const initialComments = {
                [commentId]: {
                    uid: this.getCurrentUid(),
                    content: "Sample feedback content",
                    like: 0,
                    date: Timestamp.now()
                },
            };

            const initialQuizItems = {
                [questionId]: {
                    question: "Sample Question",
                    choices: ["Choice 1", "Choice 2", "Choice 3", "Choice 4"],
                    correctChoiceIndex: 0
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


            const setQuizData = {
                name: name,
                createdAt: Timestamp.now(),
                authorId: this.getCurrentUid(),
                subject: subject,
                sharedWith: [],
                quizName: "Initial Quiz",
                questionItems: initialQuizItems,
                flashcardSetId: newDocRef.id
            };

            const newDocRefQuizzes = await addDoc(collection(database, 'quizzesCreation'), setQuizData);
            console.log("New quiz set created with ID:", newDocRefQuizzes.id);


            const uid = this.getCurrentUid();
            if (uid) {
                await this.addOwnedFlashcardSetToUser(uid, newDocRef.id);
                await this.addOwnedQuizSetToUser(uid, newDocRefQuizzes.id);
            }

            return { flashcardSetId: newDocRef.id, quizSetId: newDocRefQuizzes.id };
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

    fetchTopicName: async function (setId) {
        try {
            const flashcardSetRef = doc(database, 'flashcardSets', setId);
            const snap = await getDoc(flashcardSetRef);

            if (snap.exists()) {
                const flashcardSetData = snap.data();
                console.log(`Flashcard set with ID ${setId} fetched successfully.`);
                return flashcardSetData.name;
            } else {
                console.log(`Flashcard set with ID ${setId} not found.`);
                return null;
            }

        } catch (error) {
            console.error("Error fetching topic name:", error);
            throw error;
        }
    },




    addFlashcardItem: async function (setId, term, definition) {
        try {
            const flashcardId = doc(collection(database, 'flashcards')).id;


            const cardData = {
                term: term,
                definition: definition,
                status: ""
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
    updateCardStatus: async function (setId, flashcardId, newStatus) {
        const flashcardSetRef = doc(database, 'flashcardSets', setId);
        const snap = await getDoc(flashcardSetRef);
        if (!snap.exists()) {
            console.error("Flashcard set not found");
            return; 
        }

        const data = snap.data();
        let flashcardItems = data.flashcardItems || {};

        if (flashcardItems[flashcardId]) {
            
            flashcardItems[flashcardId].status = newStatus;

         
            await updateDoc(flashcardSetRef, {
                flashcardItems: flashcardItems
            });
        } else {
            
            console.error("Flashcard not found");
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

            const flashcardSetRef = doc(database, 'quizzesCreation', setId); // Use 'flashcardSets' collection

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
            const flashcardSetRef = doc(database, 'quizzesCreation', setId);
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
            const setRef = doc(database, 'quizzesCreation', setId);
            const setSnapshot = await getDoc(setRef);
            const setData = setSnapshot.data();
            const questionData = setData.questionItems || [];
            return questionData;
        } catch (error) {
            console.error("Error getting flashcard items:", error);
            throw error;
        }
    },

    // update existing question as requested from the user
    updateQuestion: async function (setId, questionToBeUpdated, newQuestion, newChoices, newCorrectChoiceIndex) {
        try {
            const flashcardSetRef = doc(database, 'quizzesCreation', setId);
            const snap = await getDoc(flashcardSetRef);
            const data = snap.data();
            // this will retrieve from questionItems field on firebase
            let questionItems = data.questionItems || {};

            if (questionItems[questionToBeUpdated]) {

                questionItems[questionToBeUpdated] = {
                    question: newQuestion,
                    choices: newChoices,
                    correctChoiceIndex: newCorrectChoiceIndex,
                };

                await updateDoc(flashcardSetRef, {
                    questionItems: questionItems
                });
                console.log(`Question with ID ${questionToBeUpdated} updated successfully.`);
            } else {
                console.log(`Question with ID ${questionToBeUpdated} not found.`);
            }
        } catch (error) {
            console.error("Error updating flashcard", error);
            throw error;
        }
    },

    // get all the quiz titles from its flashcard sets
    getQuizTitleFromFlashcardSet: async function (flashcardSetId) {
        try {
            const quizzesRef = collection(database, 'quizzesCreation');
            // Retrieve all quizzes from the flashcard set using the flashcard id
            const querySnapshot = await getDocs(query(quizzesRef, where('flashcardSetId', '==', flashcardSetId)));
    
            const quizTitles = [];
            querySnapshot.forEach((doc) => {
                const quizData = doc.data();
                quizTitles.push(quizData.quizName);
            });
            return quizTitles;

        } catch (error) {
            console.error("Error getting quiz titles:", error);
            throw error;
        }
    },

    // get quiz id by using the quiz name
    getQuizTitleId: async function (quizName, flashcardSetId) {
        try {
            const querySnapshot = await getDocs(query(collection(database, 'quizzesCreation'), 
            where('quizName', '==', quizName),
            where('flashcardSetId', '==', flashcardSetId)));
            if (!querySnapshot.empty) {
                return querySnapshot.docs[0].id;
            }
            return null;
        } catch (error) {
            console.error("Error fetching set ID by topic name:", error);
            return null;
        }
    },

    // get quiz id by using topic name
    getQuizIdByTopicName: async function (topicName) {
        try {
            const querySnapshot = await getDocs(query(collection(database, 'quizzesCreation'), where('name', '==', topicName)));
            if (!querySnapshot.empty) {
                return querySnapshot.docs[0].id;
            }
            return null;
        } catch (error) {
            console.error("Error fetching set ID by topic name:", error);
            return null;
        }
    },

    // get the flashcardSet Id by the quiz Id
    getSetIdByQuizId: async function (quizId) {
        try {
            const setDoc = await getDoc(doc(database, 'quizzesCreation', quizId));
            const data = setDoc.data();
            return data?.flashcardSetId || '';
            
        } catch (error) {
            console.error("Error fetching flashcard set:", error);
            return null;
        }
    },
    // this will create new quiz by referencing to the flashcardsets id
    createNewQuiz: async function (flashcardSetId, quizTitle) {
        try {
            // Get the flashcard set reference
            const flashcardSetRef = doc(database, 'flashcardSets', flashcardSetId);
    
            // Get the current flashcard set data
            const flashcardSetSnapshot = await getDoc(flashcardSetRef);
            const flashcardSetData = flashcardSetSnapshot.data();
    
            // Extract topic name and subject from flashcard set data
            const flashcardTopicName = flashcardSetData.name;
            const flashcardSubject = flashcardSetData.subject;
    
            // Generate a new quiz ID
            const quizId = doc(collection(database, 'quizzes')).id;
    
            // Create the initial quiz item
            const initialQuizItems = {
                [quizId]: {
                    question: "Sample Question",
                    choices: ["Choice 1", "Choice 2", "Choice 3", "Choice 4"],
                    correctChoiceIndex: 0,
                },
            };
    
            const setData = {
                name: flashcardTopicName,   //Add the flashcard topic name to the data
                quizName: quizTitle,    // Add a quiz title to each quiz
                createdAt: Timestamp.now(),
                authorId: this.getCurrentUid(),
                subject: flashcardSubject,
                flashcardSetId: flashcardSetId, // Add the flashcard set ID to the data
                questionItems: initialQuizItems,
            };
    
            const newDocRef = await addDoc(collection(database, 'quizzesCreation'), setData);
            console.log("New Quiz is created with ID:", newDocRef.id);
    
            const uid = this.getCurrentUid();
            if (uid) {
                await this.addOwnedQuizSetToUser(uid, newDocRef.id);
            }
    
            return newDocRef.id;
        } catch (error) {
            console.error("Error creating flashcard set:", error);
            throw error;
        }
    },

    // this will update the quiz title in the database accordingly
    updateQuizTitle: async function (quizId, newTitle) {
        try {
            const quizSetRef = doc(database, 'quizzesCreation', quizId);
            const snap = await getDoc(quizSetRef);

            if (snap.exists()) {
                // update the quiz title
                await updateDoc(quizSetRef, {
                    quizName: newTitle
                });
                console.log(`Flashcard set with ID ${quizId} updated successfully with new name: ${newTitle}.`);
            } else {
                console.log(`Flashcard set with ID ${quizId} not found.`);
            }

        } catch (error) {
            console.error("Error updating flashcard set name:", error);
            throw error;
        }
    },

    // this will delete a quiz from the database accordingly
    deleteQuiz: async function(quizIdToBeDeleted, uid) {
        const quizSetRef = doc(database, 'quizzesCreation', quizIdToBeDeleted);
      
        try {
            // delete the selected quiz
            await deleteDoc(quizSetRef);

            console.log('Quiz is deleted successfully');
            } catch (error) {
            console.error('Error deleting quiz:', error);
              throw error;
            }
    },

    // this will remove the owned quiz from the user
    removeOwnedQuizFromUser: async function(uid, quizIdToBeDeleted) {
        try {
            const userSetRef = doc(database, 'users', uid);
            const snap = await getDoc(userSetRef);
            // check if the users table exists with the id 
            if (snap.exists()) {
              const data = snap.data();
        
              if (Array.isArray(data['ownedQuizzes']) && data['ownedQuizzes'].includes(quizIdToBeDeleted)) {
                // remove the item from the array
                data['ownedQuizzes'] = data['ownedQuizzes'].filter(item => item !== quizIdToBeDeleted);
        
                // update the document with the modified data
                await updateDoc(userSetRef, { ownedQuizzes: data['ownedQuizzes'] });
                
                console.log(`Quiz ID ${quizIdToBeDeleted} is removed from user ${uid} successfully.`);
              } else {
                console.log(`Quiz ID ${quizIdToBeDeleted} not found in ownedQuizzes.`);
              }
            } else {
              console.log(`User with ID ${uid} does not exist.`);
            }
          } catch (error) {
            console.error("Error deleting quiz", error);
            throw error;
          }
        },

};

export default FlashcardRepo;
