import { setDoc, doc } from "firebase/firestore";
import {
    removeItemFromArrayField,
    updateArrayDocumentFields,
    addItemToArrayField,
    getArrayFieldFromCollection,
    getAllItems,
    getItemById,
    removeDocumentFromCollection,
    updateNonArrayDocumentFields,
} from "../utils/sharedRepositoryFunctions";
import { userConverter } from "../converters/userConverter";
import User from "../models/user";
import { Notification } from "../models/notification";
import { EVENT_TYPE } from "../models/event";

/**
 * Utility class to talk to FireStore User Collection [IN PROGRESS]
 */
export class UserRepository {
    constructor(
        database,
        quizRepository,
        notificationRepository,
        flashcardRepository,
        eventRepository
    ) {
        this.database = database;
        this.quizRepository = quizRepository;
        this.notificationRepository = notificationRepository;
        this.flashcardRepository = flashcardRepository;
        this.eventRepository = eventRepository;
    }

    /**Add a user to the database for the first time with id: uuid*/
    async addUser(email, username, firstName, lastName, uuid) {
        try {
            const userRef = doc(this.database, "users", uuid);
            await setDoc(
                userRef,
                new User(email, username, firstName, lastName, uuid).toJSON()
            );
            console.log("Successfully added user to database", username);
        } catch (error) {
            console.log("error adding user", error);
        }
    }

    /**Given a unique uuid, return the user associated with that uuid */
    async getUserById(id) {
        return await getItemById(this.database, id, "users", "user");
    }

    async deleteUser(id) {
        return await removeDocumentFromCollection(
            this.database,
            id,
            "users",
            "user"
        );
    }

    async updateNonArrayUserFields(id, toUpdate) {
        await updateNonArrayDocumentFields(
            this.database,
            id,
            "users",
            toUpdate
        );
    }

    async updateArrayUserFields(id, toUpdate) {
        await updateArrayDocumentFields(this.database, id, "users", toUpdate);
    }

    /**Return all users in the user collection */
    async getAllUsers() {
        return await getAllItems(this.database, "users", userConverter);
    }

    /**Get all owned quizzes owned by user with id: {id} */
    async getOwnedQuizzes(id) {
        const ownedQuizzes = await getArrayFieldFromCollection(
            this.database,
            "users",
            id,
            "ownedQuizzes"
        );
        return ownedQuizzes;
    }

    /**Get all quizzes shared by user with id: {id} */
    async getSharedQuizzes(id) {
        const sharedQuizzes = await getArrayFieldFromCollection(
            this.database,
            "users",
            id,
            "sharedQuizzes"
        );
        return sharedQuizzes;
    }

    /**Get all owned flashcards owned by user with id: {id} */
    async getOwnedFlashcards(id) {
        const ownedFlashcards = await getArrayFieldFromCollection(
            this.database,
            "users",
            id,
            "ownedFlashcards"
        );
        return await this.flashcardRepository.getFlashcards(ownedFlashcards);
    }

    /**Get all flashcards shared by user with id: {id} */
    async getSharedFlashcards(id) {
        const sharedFlashcards = await getArrayFieldFromCollection(
            this.database,
            "users",
            id,
            "sharedFlashcards"
        );
        return await this.flashcardRepository.getFlashcards(sharedFlashcards);
    }

    /**Get all followers of user with id: {id} */
    async getFollowers(id) {
        const followers = await getArrayFieldFromCollection(
            this.database,
            "users",
            id,
            "followers"
        );
        return this.getUsers(followers);
    }

    /**Get all following of user with id: {id} */
    async getFollowing(id) {
        const following = await getArrayFieldFromCollection(
            this.database,
            "users",
            id,
            "following"
        );
        return this.getUsers(following);
    }

    /** async get user friends: friends are people who are followers and are also in users following list*/
    async getFriends(id) {
        const followers = await this.getFollowersIds(id);
        const following = await this.getFollowingIds(id);

        const friendIds = [];
        for (const item of followers) {
            if (following.includes(item)) {
                friendIds.push(item);
            }
        }
        return this.getUsers(friendIds);
    }

    async getFollowingIds(id) {
        return await getArrayFieldFromCollection(
            this.database,
            "users",
            id,
            "following"
        );
    }

    async getFollowersIds(id) {
        return await getArrayFieldFromCollection(
            this.database,
            "users",
            id,
            "followers"
        );
    }

    /**
     *
     * Get user profile. User profile is made up of
     * User name, Bio, email, flashcards, friends, quizzes, profession, etc
     */
    async getProfile(userId) {
        const user = await this.getUserById(userId);
        const {
            id,
            bio,
            email,
            imageURL,
            username,
            name,
            profession,
            phone,
            firstName,
            lastName,
        } = user;

        const flashcards = await this.getOwnedFlashcards(id);
        const sharedFlashcards = await this.getSharedFlashcards(id);
        const friends = await this.getFriends(id);
        const followers = await this.getFollowers(id);
        const following = await this.getFollowing(id);

        return {
            id: id,
            bio: bio,
            email: email,
            imageURL: imageURL,
            username: username,
            friends: friends,
            followers: followers,
            following: following,
            name: firstName + " " + lastName,
            flashcards: flashcards,
            sharedFlashcards: sharedFlashcards,
            profession: profession,
            phone: phone,
            name: name,
        };
    }

    /**Get all notifications of user with id: {id}, returns the ids */
    async getNotificationIds(id) {
        const notificationIds = await getArrayFieldFromCollection(
            this.database,
            "users",
            id,
            "notifications"
        );
        return notificationIds;
    }

    /**Get raw notifications and not just the ids */
    async getNotifications(id) {
        const notificationIds = await this.getNotificationIds(id);
        const result = [];

        for (const notifId of notificationIds) {
            let notification =
                await this.notificationRepository.getNotificationById(notifId);
            console.log("notification is: ", notification);
            let userFromId = null;
            let userFrom = null;
            const event = await this.eventRepository.getEventById(
                notification.event.id
            );
            switch (event.eventType) {
                case EVENT_TYPE.NEW_FOLLOWER:
                    userFromId = event.newFollowerEvent.followerId;
                    break;
                case EVENT_TYPE.SHARE_QUIZ:
                    userFromId = event.shareQuizEvent.sharedBy;
                    break;
                case EVENT_TYPE.SHARE_FLASHCARD:
                    userFromId = event.shareFlashcardEvent.sharedBy;
                    break;
                default:
                    break;
            }

            if (userFromId != null) {
                userFrom = await this.getUserById(userFromId);
                notification.userFrom = userFrom;
            }
            result.push(notification);
        }
        return result;
    }

    /**get all user events */
    async getEvents(id) {
        const events = await getArrayFieldFromCollection(
            this.database,
            "users",
            id,
            "events"
        );
        return events;
    }

    /**add quiz with quizId to list of quizzes for user with userId */
    async addSharedQuiz(userId, quizId) {
        await addItemToArrayField(
            this.database,
            userId,
            quizId,
            "users",
            "sharedQuizzes",
            "quiz"
        );
    }

    /**user with userId shares quiz with user with id sharedWithId */
    async shareQuiz(userId, sharedWithId, quizId) {
        await this.addSharedQuiz(sharedWithId, quizId);
        const eventId = await this.eventRepository.createShareQuizEvent(
            userId,
            sharedWithId
        );
        const notificationId =
            await this.notificationRepository.addNotification(
                new Notification(eventId)
            );
        this.addEvent(eventId);
        this.addNotification(sharedWithId, notificationId);
    }

    /**add flashcard with flashcardId to list of flashcards for user with userId */
    async addSharedFlashcard(userId, flashcardId) {
        await addItemToArrayField(
            this.database,
            userId,
            flashcardId,
            "users",
            "flashcards",
            "flashcard"
        );
    }

    /**user with userId shares flashcard with user with id sharedWithId */
    async shareFlashcard(userId, sharedWithId, flashcardId) {
        await this.addSharedQuiz(sharedWithId, flashcardId);
        const eventId = await this.eventRepository.createShareFlashcardEvent(
            userId,
            sharedWithId
        );
        const notificationId =
            await this.notificationRepository.addNotification(
                new Notification(eventId)
            );
        this.addNotification(sharedWithId, notificationId);
        return true;
    }

    /**user with userId shares flashcard with users in listOfUserIds sharedWithId */
    async shareFlashcard(userId, listOfUserIds, flashcardId) {
        for (const id of listOfUserIds) {
            await this.shareFlashcard(userId, id, flashcardId);
        }
        return true;
    }

    async addOwnedQuiz(userId, quizId) {
        await addItemToArrayField(
            this.database,
            userId,
            quizId,
            "users",
            "ownedQuizzes",
            "quiz"
        );
    }

    async addOwnedFlashcard(userId, flashcardId) {
        await addItemToArrayField(
            this.database,
            userId,
            flashcardId,
            "users",
            "flashcards",
            "flashcard"
        );
    }

    async addEvent(userId, eventId) {
        await addItemToArrayField(
            this.database,
            userId,
            eventId,
            "users",
            "events",
            "event"
        );
    }

    async addNotification(userId, notificationId) {
        await addItemToArrayField(
            this.database,
            userId,
            notificationId,
            "users",
            "notifications",
            "notification"
        );
    }

    async addSubject(userId, subjectId) {
        await addItemToArrayField(
            this.database,
            userId,
            subjectId,
            "users",
            "subjects",
            "subject"
        );
    }

    async addFollower(userId, followerId) {
        await addItemToArrayField(
            this.database,
            userId,
            followerId,
            "users",
            "followers",
            "follower"
        );
    }

    /**Whenever userId follows followingId, followingId gains a new follower which is userId */
    async addFollowing(userId, followingId) {
        console.log(`incoming data: ${userId}, ${followingId}`);
        try {
            await addItemToArrayField(
                this.database,
                userId,
                followingId,
                "users",
                "following",
                "following"
            );
            await this.addFollower(followingId, userId);
            // //create a new event in followingId to indicate that someone followed them. add the event to their notifications
            // const eventId = await this.eventRepository.createNewFollowerEvent(
            //   userId,
            //   followingId
            // );
            // // //create a new notification with this event
            // const notificationId = await this.notificationRepository.addNotification(
            //   new Notification(eventId)
            // );
            // // //add this notification to users list of notifications
            // this.addNotification(followingId, notificationId);
            // //add event to user events
            // this.addEvent(userId, eventId);
        } catch (error) {
            console.error(`error while adding following is: ${error}`);
            return false;
        }

        return true;
    }

    async removeFollower(userId, followerId) {
        console.log("incoming data is: ", followerId);
        await removeItemFromArrayField(
            this.database,
            userId,
            followerId,
            "users",
            "followers",
            "follower"
        );
        console.log(
            `successfully removed ${followerId} from the list of followers of ${userId}`
        );
    }

    async removeFollowing(userId, followingId) {
        await removeItemFromArrayField(
            this.database,
            userId,
            followingId,
            "users",
            "following",
            "following"
        );
    }

    /**
     * userId starts folloing followingId
     * followingId gains userId as a follower
     */
    async startFollowing(userId, followingId) {
        await this.addFollowing(userId, followingId);
        await this.addFollower(followingId, userId);
        const eventId = await this.eventRepository.createNewFollowerEvent(
            userId,
            followingId
        );
        const notificationId =
            await this.notificationRepository.addNotification(
                new Notification(eventId)
            );
        this.addNotification(followingId, notificationId);
    }

    /**
     * userId stops folloing followingId
     * followingId losses userId as a follower
     */
    async stopFollowing(userId, followingId) {
        await this.removeFollowing(userId, followingId);
        await this.removeFollower(followingId, userId);
    }

    //Given a list of user ids, get the actual user representation objects
    async getUsers(userIds) {
        const users = [];
        for (const userId of userIds) {
            users.push(await this.getUserById(userId));
        }
        return users;
    }

    //Given a user id, pass in an object to save profile
    /**
     *
     * Eg saveProfile(123, {friends:['mike', 'john'], firstName:"Joe", bio: "SWE at Amaxzon"})
     * In this example, we add mike and john to user(123) list of firends and edit their bio and firstName
     * Awlays make sure the keys you are passing into the updatedProfile match the keys in the database
     */
    async saveUserProfile(userId, updatedProfile) {
        let arrayFields = {};
        let nonArrayFields = {};

        for (const key in updatedProfile) {
            if (Array.isArray(updatedProfile[key])) {
                arrayFields[key] = updatedProfile[key];
            } else {
                nonArrayFields[key] = updatedProfile[key];
            }
        }

        await this.updateArrayUserFields(userId, arrayFields);
        await this.updateNonArrayUserFields(userId, nonArrayFields);
    }

    async incrementNewNotifications(userId) {
        const user = await this.getUserById(userId);

        await this.updateNonArrayUserFields(userId, {
            newNotifications: user.newNotifications + 1,
        });

        return user.newNotifications + 1;
    }

    async getNotificationCount(userId) {
        const user = await this.getUserById(userId);

        return user.newNotifications;
    }

    async setNotificationCountoZero(userId) {
        await this.updateNonArrayUserFields(userId, {
            newNotifications: 0,
        });
        return 0;
    }
}
