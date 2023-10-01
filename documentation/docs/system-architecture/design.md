---
sidebar_position: 1
---

## Client

The StudySync web interface offers a user-centric dashboard that centralizes learning tools, friend interactions, and personalized notifications. After logging in, users can access a suite of study tools, view and interact with friends' content, receive system and friend notifications, and manage their profile, all seamlessly interconnected for an efficient and engaging learning experience.

![stydysync](https://github.com/Capstone-Projects-2023-Fall/project-studysync/assets/111998266/48d10c14-63b8-4edb-925a-37d79a6ac535)

## Server


## Database
#### Database Model

StudySync will be using a Firebase NoSQL database to store all data. The database will be made up of the following collections: 
> - User: This collection stores everything related to a single user. 
> - Notifications: Stores all the metadata related to a notification
> - Event: Store metadata for each event
> - FlashCard: Representation of an entire stack of flashcards. Made up of flashcard items
> -FlashCardItem: A single flash card
> - EventType: This is a static list of different types of events. 

For single properties on a user model such as email, password and name, we will just store it in the user the corresponding collection. For more complex properties such as notifications, followers and following, flashcards and events, we will store the ids of each corresponding field in the user collection and query the respective collection as needed. To be more specific, in the case of notifications, the actual data for notifications will be stored in the Notifications collections, anytime we need to query user notifications, we can do this easily by fetching all the notification ids for that user from the Users collection and then querying the Notifications collection using those ids. This same idea applies to fetching events for Notifications

![StudySync (2)](https://github.com/Capstone-Projects-2023-Fall/project-studysync/assets/77356776/9778a182-94c4-44be-ac72-f4f6c11adcf3)


## Use case 1
A user forgets to review because of daily chores and uses StudySync to review before midterm is approaching.

1. User login using Google api.
2. After logging into the account, the user finds the study outline.
3. Then he found the flash cards for his subject.
4. Next the user will proceed to flash Select Q&A mode.
5. Finally, the user completes the quiz and the correct answer is displayed.
6. The last wrong questions will be collected and then these questions will be saved in a new topic.


## Use case 2
A user is about to take a naturalization test but doesn't have time to study for it due to work, so he needs to practice for the test using StudySyne.

1. Users open the website and enter their account password to log in.
2. Then since there is nothing on StudySyne that he needs to learn, he needs to enter the questions himself.
3. He then adds the naturalization test questions he has studied and uploads them to StudySyne.
4. After completing the upload of the question bank he chose flash card mode for memory training.
5. When the flash card comes out there are three options, recognize, don't recognize.
6. Finally, the questions you recognize will be skipped in the next exercise, and the questions you don't recognize will show the answer and then continue to appear in the next exercise.


## Use case 3
  A user was recommended a learning program by his classmates that said he could have a quiz competition.

1. He opened the website his classmate gave him and created the account password.
2. Then he went to the friends list and chose to add a friend.
3. After adding his friends he received an invitation to a quiz contest sent to him by his classmate.
4. After completing the quiz the scores and rankings of the inviter as well as all invited people appeared.


## Use case 4
  A user wants to study the subject he wants but, he doesn't find the flash card for the subject he wants in StudySync.

1. He opened StudySync and automatically logged in
2. After he didn't find a flash card for the subject he wanted to study he turned on the AI topic generation function
3. After pressing AI Flash Card Generator you will first see all the flash cards and you can filter them.
4. After completing the screening you can study, then while flash card studying you are not satisfied with a particular topic then choose to be dissatisfied with that topic.
5. The question will then be deleted from the pool.

![](../requirements/static/UseCase4.png)

## Use case 5
   A user wants to take a quiz created by themselves or a friend.

1. User logs in to StudySync.
2. User then navigate to the "Quiz" section.
3. At the "Quiz" section, user has a wide range of quizzes either created by themselves or friends.
4. Then the user completes the quiz and submits their answers.
5. The system will then calculate and the display user's score on the leaderboard.
![](../requirements/static/UseCase5.png)


## Use case 6
   A user wants to add friends on StudySync.

1. User will have to log in to their own account.
2. Then navigate to the "Add Friend" section.
3. User enters the friend's email or username.
4. Once the friend's name popup, user recognizes their friends then clicks "add as friend".
5. The friend receives the friend request and is able to accept or reject it.
![](../requirements/static/UseCase6.png)


## Use case 7
   A user has been studying for 6 hours and wants to take a break but also wants to save the quiz's progress.

1. User is taking a quiz but then realizes he/she wants to take a quick coffee break.
2. User clicks "Save&Exit" button in order for the quiz to be saved and quit.
3. The system saves the user's progress.
4. After the break, the user logs in and goes to the "Quiz" section to resume the paused quiz.
5. User chooses to resume the quiz from where they left off.
![mermaid-diagram-2023-09-29-214820](https://github.com/Capstone-Projects-2023-Fall/project-studysync/assets/70645481/68267170-a3d8-4f8d-92d3-f32b7a341f02)


## Use case 8
  A user finds out some flashcards need to be updated in order to improve accuracy.

1. User logs in to StudySynce as usual.
2. Then user has to go to their created flashcards.
3. User finds out which flashcards need to be updated.
4. User makes some changes to the flashcard definition and details.
5. User saves changes and then flashcards are updated and ready to be learned.
![mermaid-diagram-2023-09-29-215726](https://github.com/Capstone-Projects-2023-Fall/project-studysync/assets/70645481/b3762de4-801c-475e-b658-c9a7b5b2d8bb)



