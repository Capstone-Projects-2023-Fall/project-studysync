import { useId } from 'react';
import { database, auth } from '../../firebase';

import { collection, getDocs, getDoc, query, where, setDoc, doc, addDoc, deleteDoc, updateDoc, arrayUnion, Timestamp, arrayRemove } from 'firebase/firestore';
/**
 * @class FlashcardRepo
 * @classdesc FlashcardRepo
 * @description Repository for handling flashcard-related operations with Firebase.
 */
const FlashcardRepo = {
    /**
         * @memberof FlashcardRepo
         * @function getCurrentUid
         * @description Retrieves the current user's UID.
         * @returns {string|null} The current user's UID or null if not logged in.
         */

    getCurrentUid: function () {
        const user = auth.currentUser;
        return user ? user.uid : null;
    },

    /**
         * @memberof FlashcardRepo
         * @function getUserSubjects
         * @description Fetches subjects associated with a specific user.
         * @param {string} uid - The user's UID.
         * @returns {Promise<Array>} A promise that resolves to an array of subjects.
         */

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

    /**
        * @memberof FlashcardRepo
        * @function getUserFlashcardSets
        * @description Retrieves flashcard sets owned by a specific user.
        * @param {string} uid - The user's UID.
        * @returns {Promise<Array>} A promise that resolves to an array of flashcard sets.
        */

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

    /**
         * @memberof FlashcardRepo
         * @function getFlashcardSetById
         * @description Fetches a flashcard set by its ID.
         * @param {string} setId - The ID of the flashcard set.
         * @returns {Promise<Object>} A promise that resolves to the flashcard set object.
         */
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


    /**
     * @memberof FlashcardRepo
     * @function createFlashcardSet
     * @description Creates a new flashcard set with given parameters.
     * @param {Object} setDetails - The details of the flashcard set including name and subject.
     * @returns {Promise<Object>} A promise that resolves to the new flashcard set's ID.
     */
    createFlashcardSet: async function ({ name, subject }) {
        try {


            const flashcardId = doc(collection(database, 'flashcards')).id;
            const commentId = doc(collection(database, 'comments')).id;
            const questionId = doc(collection(database, 'questions')).id;
            const scoreId = doc(collection(database, 'scores')).id;


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


            const initialScore = {
                [scoreId]: {
                    score: 0,
                    attempt: increment(0),
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
                flashcardSetId: newDocRef.id,
                quizScore: initialScore
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

    /**
 * @memberof FlashcardRepo
 * @function copyFlashcards
 * @description Copies a flashcard set to a new user.
 * @param {string} flashcardId - The ID of the flashcard set to copy.
 * @param {string} userId - The ID of the user to copy the flashcard set to.
 * @returns {Promise<string|null>} A promise that resolves to the new flashcard set ID or null if failed.
 */
    copyFlashcards: async function (flashcardId, userId) {
        try {






    /**
     * @memberof FlashcardRepo
     * @function addOwnedFlashcardSetToUser
     * @description Adds a flashcard set to the list of sets owned by a user.
     * @param {string} uid - The user's UID.
     * @param {string} flashcardSetId - The ID of the flashcard set.
     * @returns {Promise<void>}
     */
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



    /**
     * @memberof FlashcardRepo
     * @function updateFlashcardSetName
     * @description Updates the name of a specified flashcard set.
     * @param {string} setId - The ID of the flashcard set.
     * @param {string} newName - The new name for the flashcard set.
     * @returns {Promise<void>}
     */
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




    /**
     * @memberof FlashcardRepo
     * @function addFlashcardItem
     * @description Adds a new flashcard item to a specified flashcard set.
     * @param {string} setId - The ID of the flashcard set.
     * @param {string} term - The term of the new flashcard.
     * @param {string} definition - The definition of the new flashcard.
     * @returns {Promise<string>} A promise that resolves to the ID of the newly added flashcard item.
     */
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

    /**
     * @memberof FlashcardRepo
     * @function deleteFlashcard
     * @description Deletes a specific flashcard from a flashcard set.
     * @param {string} setId - The ID of the flashcard set.
     * @param {string} flashcardIdToDelete - The ID of the flashcard to delete.
     * @returns {Promise<void>}
     */
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

    /**
     * @memberof FlashcardRepo
     * @function updateFlashcard
     * @description Updates the term and definition of a specific flashcard in a set.
     * @param {string} setId - The ID of the flashcard set.
     * @param {string} flashcardIdToUpdate - The ID of the flashcard to update.
     * @param {string} newTerm - The new term for the flashcard.
     * @param {string} newDefinition - The new definition for the flashcard.
     * @returns {Promise<void>}
     */
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

    /**
     * @memberof FlashcardRepo
     * @function addUserSubject
     * @description Adds a new subject to a user's list of subjects.
     * @param {string} uid - The UID of the user.
     * @param {string} newSubject - The new subject to add.
     * @returns {Promise<void>}
     */
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

    /**
     * @memberof FlashcardRepo
     * @function removeUidFromSharedWith
     * @description Removes a user's UID from the 'sharedWith' list of a flashcard set.
     * @param {string} setId - The ID of the flashcard set.
     * @param {string} uid - The UID of the user to remove.
     * @returns {Promise<void>}
     */
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

    /**
     * @memberof FlashcardRepo
     * @function removeSetIdFromUser
     * @description Removes a flashcard set ID from a user's list of owned flashcard sets.
     * @param {string} uid - The UID of the user.
     * @param {string} setId - The ID of the flashcard set to remove.
     * @returns {Promise<void>}
     */
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


    /**
     * @memberof FlashcardRepo
     * @function getUserImageURLByUid
     * @description Retrieves the image URL of a user based on their UID.
     * @param {string} uid - The UID of the user.
     * @returns {Promise<string|null>} A promise that resolves to the user's image URL or null if not found.
     */
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
    /**
 * @memberof FlashcardRepo
 * @function updateCardStatus
 * @description Updates the status of a specific flashcard in a set.
 * @param {string} setId - The ID of the flashcard set.
 * @param {string} flashcardId - The ID of the flashcard to update.
 * @param {string} newStatus - The new status for the flashcard.
 * @returns {Promise<void>}
 */
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


    /**
     * @memberof FlashcardRepo
     * @function getSetIdByTopicName
     * @description Retrieves the ID of a flashcard set by its topic name.
     * @param {string} topicName - The name of the topic.
     * @returns {Promise<string|null>} A promise that resolves to the flashcard set ID or null if not found.
     */
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

    /**
     * @memberof FlashcardRepo
     * @function getFlashcardItems
     * @description Retrieves all flashcard items in a specific flashcard set.
     * @param {string} setId - The ID of the flashcard set.
     * @returns {Promise<Object>} A promise that resolves to an object containing flashcard items.
     */
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

    /**
     * @memberof FlashcardRepo
     * @function getCommentsWithUserData
     * @description Retrieves all comments for a flashcard set along with user data.
     * @param {string} setId - The ID of the flashcard set.
     * @returns {Promise<Array>} A promise that resolves to an array of comments with user data.
     */
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
    /**
 * @memberof FlashcardRepo
 * @function updateLikesForComment
 * @description Updates the like count for a specific comment in a flashcard set.
 * @param {string} setId - The ID of the flashcard set.
 * @param {string} commentId - The ID of the comment.
 * @param {number} updatedLikes - The updated like count.
 * @returns {Promise<void>}
 */
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
    /**
 * @memberof FlashcardRepo
 * @function addComment
 * @description Adds a new comment to a flashcard set.
 * @param {string} setId - The ID of the flashcard set.
 * @param {Object} commentData - The data of the new comment.
 * @returns {Promise<void>}
 */
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

    /**
     * @memberof FlashcardRepo
     * @function getFlashcardItemsByStatus
     * @description Retrieves flashcard items from a set filtered by a specific status.
     * @param {string} setId - The ID of the flashcard set.
     * @param {string} status - The status to filter by.
     * @returns {Promise<Array>} A promise that resolves to an array of flashcards with the specified status.
     */
    getFlashcardItemsByStatus: async function (setId, status) {
        try {
            const setRef = doc(database, 'flashcardSets', setId);
            const setSnapshot = await getDoc(setRef);
            const setData = setSnapshot.data();
            const flashcardData = setData.flashcardItems || [];

            // if flashcardData is an object, convert it to an array
            const flashcardArray = Object.values(flashcardData);
            //console.log('Converted flashcardData to array:', flashcardArray);
            // filter flashcards based on the status field
            const flashcardsWithStatus = flashcardArray.filter(flashcard => flashcard.status === status);
            //console.log("Filtered flashcards are: ", flashcardsWithStatus);

            return flashcardsWithStatus;
        } catch (error) {
            console.error("Error getting flashcard items:", error);
            throw error;

        }
    },


    // add owned quizzes into the users table using the flashcardSet id
    /**
 * @memberof FlashcardRepo
 * @function addOwnedQuizSetToUser
 * @description Adds a quiz set to a user's list of owned quizzes.
 * @param {string} uid - The UID of the user.
 * @param {string} quizSetId - The ID of the quiz set to add.
 * @returns {Promise<void>}
 */
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
    /**
 * @memberof FlashcardRepo
 * @function addQuizQuestion
 * @description Adds a new question to a quiz set.
 * @param {string} setId - The ID of the quiz set.
 * @param {string} question - The question text.
 * @param {Array<string>} choices - An array of choices for the question.
 * @param {number} correctChoiceIndex - The index of the correct choice.
 * @returns {Promise<string>} A promise that resolves to the ID of the newly added question.
 */
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
    /**
 * @memberof FlashcardRepo
 * @function deleteQuestion
 * @description Deletes a question from a quiz set.
 * @param {string} setId - The ID of the quiz set.
 * @param {string} questionIdToBeDeleted - The ID of the question to delete.
 * @returns {Promise<void>}
 */
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
    /**
 * @memberof FlashcardRepo
 * @function getQuestionItems
 * @description Retrieves all question items from a quiz set.
 * @param {string} setId - The ID of the quiz set.
 * @returns {Promise<Object>} A promise that resolves to an object containing question items.
 */
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
    /**
 * @memberof FlashcardRepo
 * @function updateQuestion
 * @description Updates an existing question in a quiz set.
 * @param {string} setId - The ID of the quiz set.
 * @param {string} questionToBeUpdated - The ID of the question to update.
 * @param {string} newQuestion - The new question text.
 * @param {Array<string>} newChoices - The new array of choices.
 * @param {number} newCorrectChoiceIndex - The index of the new correct choice.
 * @returns {Promise<void>}
 */
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
    /**
 * @memberof FlashcardRepo
 * @function getQuizTitleFromFlashcardSet
 * @description Retrieves all quiz titles from a flashcard set.
 * @param {string} flashcardSetId - The ID of the flashcard set.
 * @returns {Promise<Array<string>>} A promise that resolves to an array of quiz titles.
 */
    getQuizTitleFromFlashcardSet: async function (flashcardSetId) {
        try {
            const quizzesRef = collection(database, 'quizzesCreation');
            // Retrieve all quizzes from the flashcard set using the flashcard id


            const querySnapshot = await getDocs(query(quizzesRef,
                 where('flashcardSetId', '==', flashcardSetId),
                 orderBy('createdAt', 'asc')));
   
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
    /**
 * @memberof FlashcardRepo
 * @function getQuizTitleId
 * @description Retrieves the ID of a quiz by its title and associated flashcard set ID.
 * @param {string} quizName - The name of the quiz.
 * @param {string} flashcardSetId - The ID of the associated flashcard set.
 * @returns {Promise<string|null>} A promise that resolves to the quiz ID or null if not found.
 */
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
    /**
    * @memberof FlashcardRepo
    * @function getQuizIdByTopicName
    * @description Retrieves the ID of a quiz by its topic name.
    * @param {string} topicName - The topic name of the quiz.
    * @returns {Promise<string|null>} A promise that resolves to the quiz ID or null if not found.
    */
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
    /**
   * @memberof FlashcardRepo
   * @function getSetIdByQuizId
   * @description Retrieves the ID of the flashcard set associated with a quiz.
   * @param {string} quizId - The ID of the quiz.
   * @returns {Promise<string|null>} A promise that resolves to the flashcard set ID or null if not found.
   */
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
    /**
 * @memberof FlashcardRepo
 * @function createNewQuiz
 * @description Creates a new quiz associated with a flashcard set.
 * @param {string} flashcardSetId - The ID of the flashcard set.
 * @param {string} quizTitle - The title of the new quiz.
 * @returns {Promise<string>} A promise that resolves to the ID of the newly created quiz.
 */
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
            const scoreId = doc(collection(database, 'scores')).id;


            // Create the initial quiz item
            const initialQuizItems = {
                [quizId]: {
                    question: "Sample Question",
                    choices: ["Choice 1", "Choice 2", "Choice 3", "Choice 4"],
                    correctChoiceIndex: 0,
                },
            };


            const initialScore = {
                [scoreId]: {
                    score: 0,
                    attempt: increment(0),
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
                quizScore: initialScore,
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
    /**
 * @memberof FlashcardRepo
 * @function updateQuizTitle
 * @description Updates the title of a quiz.
 * @param {string} quizId - The ID of the quiz to update.
 * @param {string} newTitle - The new title of the quiz.
 * @returns {Promise<void>}
 */
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
    /**
 * @memberof FlashcardRepo
 * @function deleteQuiz
 * @description Deletes a quiz.
 * @param {string} quizIdToBeDeleted - The ID of the quiz to be deleted.
 * @param {string} uid - The UID of the user performing the action.
 * @returns {Promise<void>}
 */
    deleteQuiz: async function (quizIdToBeDeleted, uid) {
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
    /**
 * @memberof FlashcardRepo
 * @function removeOwnedQuizFromUser
 * @description Removes an owned quiz from a user's list.
 * @param {string} uid - The UID of the user.
 * @param {string} quizIdToBeDeleted - The ID of the quiz to be removed.
 * @returns {Promise<void>}
 */
    removeOwnedQuizFromUser: async function (uid, quizIdToBeDeleted) {
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


    getFlashcardItemsByStatus: async function(setId, status) {
        try {
            const setRef = doc(database, 'flashcardSets', setId);
            const setSnapshot = await getDoc(setRef);
            const setData = setSnapshot.data();
            const flashcardData = setData.flashcardItems || [];
           
            // if flashcardData is an object, convert it to an array
            const flashcardArray = Object.values(flashcardData);
            //console.log('Converted flashcardData to array:', flashcardArray);
             // filter flashcards based on the status field
            const flashcardsWithStatus = flashcardArray.filter(flashcard => flashcard.status === status);
            //console.log("Filtered flashcards are: ", flashcardsWithStatus);


            return flashcardsWithStatus;
        } catch (error) {
            console.error("Error getting flashcard items:", error);
            throw error;


        }
    },
   
    // this will add the user score to the db as well as the attempt
    updateScoreAndAddAttempt: async function(quizId, score) {
        try {
            // create the attempt data
            const scoreData = {
                attempt: 1, // initialize attempt to 1 for the first attempt
                score: score, // the calculated score
                submitAt: Timestamp.now(), // capture the time the user submitted the quiz
            };
   
            // get a reference to the quiz document in the 'quizzesCreation' collection
            const quizRef = doc(database, 'quizzesCreation', quizId);
   
            const snap = await getDoc(quizRef);
            const data = snap.data();
            let quizScore = data.quizScore || {};
   
            // check if there are existing attempts
            const existingAttempts = Object.values(quizScore).length;
   
            // increment the attempt field by 1
            if (existingAttempts > 0) {
                scoreData.attempt = increment(existingAttempts);
            }
   
            // get a new ID for the attempt
            const scoreId = doc(collection(database, 'score')).id;
   
            // add the new score data to the quizScore object
            quizScore[scoreId] = scoreData;
   
            console.log("Adding new score to DB:", quizScore);
   
            // update the quiz document with the updated quizScore
            await updateDoc(quizRef, {
                quizScore: quizScore
            });
   
            return scoreId;
        } catch (error) {
            console.error("Error adding score", error);
            throw error;
        }
    },




    //get score and attempt date
    getQuizAttemptsForUser: async function(userId) {
        const quizAttempts = [];
        try {
            //reference to the user's quiz scores
            const scoresRef = collection(database, 'score');
            const q = query(scoresRef, where("userId", "==", userId));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                quizAttempts.push({
                    score: data.score,
                    submitAt: data.submitAt.toDate().toLocaleString(),
                });
        });
    } catch (error) {
        console.error("Error fetching user's quiz attempts:", error);
    }
    return quizAttempts;
},
};


export default FlashcardRepo;



