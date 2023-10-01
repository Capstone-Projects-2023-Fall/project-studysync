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
User: This collection stores everything related to a single user. 
Notifications: Stores all the metadata related to a notification
Event: Store metadata for each event
FlashCard: Representation of an entire stack of flashcards. Made up of flashcard items
FlashCardItem: A single flash card
EventType: This is a static list of different types of events. 

For single properties on a user model such as email, password and name, we will just store it in the user the corresponding collection. For more complex properties such as notifications, followers and following, flashcards and events, we will store the ids of each corresponding field in the user collection and query the respective collection as needed. To be more specific, in the case of notifications, the actual data for notifications will be stored in the Notifications collections, anytime we need to query user notifications, we can do this easily by fetching all the notification ids for that user from the Users collection and then querying the Notifications collection using those ids. This same idea applies to fetching events for Notifications

![StudySync (2)](https://github.com/Capstone-Projects-2023-Fall/project-studysync/assets/77356776/9778a182-94c4-44be-ac72-f4f6c11adcf3)


## Use case 1


## Use case 2


## Use case 3


## Use case 4

![](../requirements/static/UseCase4.png)

## Use case 5
![](../requirements/static/UseCase5.png)


## Use case 6
![](../requirements/static/UseCase6.png)


## Use case 7
![mermaid-diagram-2023-09-29-214820](https://github.com/Capstone-Projects-2023-Fall/project-studysync/assets/70645481/68267170-a3d8-4f8d-92d3-f32b7a341f02)


## Use case 8
![mermaid-diagram-2023-09-29-215726](https://github.com/Capstone-Projects-2023-Fall/project-studysync/assets/70645481/b3762de4-801c-475e-b658-c9a7b5b2d8bb)



