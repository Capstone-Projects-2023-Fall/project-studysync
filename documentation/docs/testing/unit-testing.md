---
sidebar_position: 1
---
# Unit Test 

## FlashcardCom Test Suite 

  

1. Rendering and UI Elements 

    - Test Case: Verify that the FlashcardComponent renders correctly and displays the initial UI elements. 

    - Method: render() 

    - Expected Result: The text 'Add Subject' should be present in the document. 

  

2. Fetching Subjects and Flashcards on Load 

    - Test Case: Ensure that subjects and flashcards are fetched from the repository when the component loads. 

    - Method: getUserSubjects(), getUserFlashcardSets(), getFlashcardSetById() 

    - Expected Result: The fetched subjects and flashcards should be correctly displayed on the screen. 

  

3. Adding a New Subject 

    - Test Case: Confirm that a new subject can be added. 

    - Method: addUserSubject() 

    - Expected Result: The addUserSubject method should be called with the correct parameters. 

  

4. Creating a New Flashcard Set 

    - Test Case: Validate that a new flashcard set can be created. 

    - Method: createFlashcardSet() 

    - Expected Result: The createFlashcardSet method should be invoked with the specified topic details. 

  

5. Handling Topic Deletion 

    - Test Case: Test the functionality of topic deletion. 

    - Method: removeSetIdFromUser() 

    - Expected Result: The removeSetIdFromUser method should be called with the correct user ID and set ID. 

  

6. Handling Topic Editing 

    - Test Case: Ensure that topics can be edited correctly. 

    - Method: updateFlashcardSetName() 

    - Expected Result: The updateFlashcardSetName method should be called with the correct set ID and new topic name. 

  

## FlashcardShare Component Test Suite 

  

1. Rendering and UI Elements 

    - Test Case: Verify that the FlashcardShare component renders correctly. 

    - Method: render() 

    - Expected Result: Initial UI elements of the FlashcardShare component should be displayed. 

  

2. Fetching Flashcards on Load 

    - Test Case: Confirm that flashcards are fetched from the repository upon component load. 

    - Method: getFlashcardItems() 

    - Expected Result: The fetched flashcards should be correctly displayed. 

  

## FlashcardUICom Component Test Suite 

  

1. Rendering and Initial Display 

    - Test Case: Validate that the FlashcardApp component renders and shows initial UI elements. 

    - Method: render() 

    - Expected Result: Initial UI elements of the FlashcardApp component should be visible. 

  

2. Loading Flashcards, Comments, and User Image.

    - Test Case: Ensure that flashcards, comments, and user image are loaded on initialization. 

    - Method: getFlashcardItems(), getCommentsWithUserData(), getUserImageURLByUid() 

    - Expected Result: Flashcards, comments, and user image should be correctly fetched and displayed. 

  

3. Adding a Flashcard 

    - Test Case: Test the addition of a new flashcard. 

    - Method: addFlashcardItem() 

    - Expected Result: The addFlashcardItem method should be called with the correct set ID, term, and definition. 

  

4. Deleting a Flashcard 

    - Test Case: Validate the deletion of a flashcard. 

    - Method: deleteFlashcard() 

    - Expected Result: The deleteFlashcard method should be invoked with the appropriate set ID and flashcard ID. 

  

5. Updating a Flashcard 

    - Test Case: Confirm that a flashcard can be updated. 

    - Method: updateFlashcard() 

    - Expected Result: The updateFlashcard method should be called with the correct parameters. 

  

6. Sending a Comment 

    - Test Case: Test the functionality of sending a comment. 

    - Method: addComment() 

    - Expected Result: The addComment method should be invoked with the correct set ID and comment details. 

  

7. Generating Flashcards with AI 
    - Test Case: Validate the AI-based generation of flashcards. 

    - Method: callYourCloudFunctionToGenerateFlashcards() 

    - Expected Result: The callYourCloudFunctionToGenerateFlashcards method should be called with the specified parameters, and the generated flashcards should match the expected output. 

  

8. Loading and Displaying Flashcards 

    - Test Case: Ensure that flashcards are loaded and displayed correctly. 

    - Method: getFlashcardItems() 

    - Expected Result: The flashcards should be correctly fetched and displayed as per the data provided. 

 <img  alt="image" src="https://github.com/Capstone-Projects-2023-Fall/project-studysync/assets/123430237/1c04eadc-3027-4cac-84f8-4be87b9e23ac">

## Quiz List Component Test Suite 
1. Updates the Quiz Title
    - Test Case: "Updates the Quiz Title" 

    - Method:  

        - Renders an EditQuizDialog component with predefined props. 

        - Verifies the correct rendering of the component title, text field, and buttons. 

        - Simulates a user changing the text field and clicking the "Save" button. 

        - Checks if the onEditQuizTitle and handleClose functions are called with the expected arguments. 

  
2. Fetches and Displays Quiz Titles
    - Test Case: "Fetches and Displays Quiz Titles" 

    - Method: 

        - Mocks the FlashcardRepo.getQuizTitleFromFlashcardSet function to resolve with predefined quiz data. 

        - Renders the QuizList component and waits for asynchronous operations to complete. 

        - Asserts that the component renders the fetched quiz titles by checking each title against the container. 

 

## Quiz Component Test Suite 
1. Does Not Add a Question When Input is Invalid
    - Test Case: "Does Not Add a Question When Input is Invalid" 

    - Method: 

        - Mocks the FlashcardRepo.addQuizQuestion to reject with an error. 

        - Renders the FetchQuestions component and triggers a click on the "Add Question" button. 

        - Expects that addQuizQuestion is not called. 

  
2. Confirms Question Deletion
    - Test Case: "Confirms Question Deletion" 

    - Method: 

        - Sets up mock quiz and question IDs. 

        - Calls FlashcardRepo.deleteQuestion and expects it to be called with the correct arguments. 

  
3. Adds Owned Quiz to the User
    - Test Case: "Adds Owned Quiz to the User" 

    - Method: 

        - Mocks necessary functions and renders the CreateQuiz component. 

        - Triggers a click on the "Create Quiz" button and waits for asynchronous operations to complete. 

        - Expects that createNewQuiz and addOwnedQuizSetToUser functions are called with the correct arguments. 

  
4. Handles Opening and Fetches Flashcard Set Name
    - Test Case: "Handles Opening and Fetches Flashcard Set Name" 

    - Method:  

        - Sets up mocks for necessary functions. 

        - Calls flashcardSetHandler.handleOpenGenerateAI and expects mocked functions to be called with the correct arguments. 

  
5. Generates Questions by Using AI Generating
    - Test Case: "Generates Questions by Using AI Generating" 

    - Method:  

        - Sets up mock data and mocks the function for generating flashcards using AI. 

        - Calls the function and expects it to be called with the correct arguments and returns the mock data. 

  
6. Retrieves the Quiz Title Using Quiz ID
    - Test Case: "Retrieves the Quiz Title Using Quiz ID" 

    - Method:  

        - Calls FlashcardRepo.getQuizTitleFromFlashcardSet with a quiz ID and expects it to be called with the correct argument. 

  
7. Retrieves the Quiz ID from a Flashcard Set
    - Test Case: "Retrieves the Quiz ID from a Flashcard Set" 

    - Method:  

        - Calls FlashcardRepo.getQuizTitleId with quiz name and set ID and expects it to be called with the correct arguments. 

  
8. Retrieves the Quiz ID from a Topic Name
    - Test Case: "Retrieves the Quiz ID from a Topic Name" 

    - Method:  

        - Calls FlashcardRepo.getQuizIdByTopicName with a quiz name and expects it to be called with the correct argument. 

  
9. Creates New Quiz for a Flashcard Set
    - Test Case: "Creates New Quiz for a Flashcard Set" 

    - Method:  

        - Calls FlashcardRepo.createNewQuiz with a new quiz object and expects it to be called with the correct argument. 

  
10. Gets Flashcard Items by Status
    - Test Case: "Gets Flashcard Items by Status" 

    - Method: 

        - Calls FlashcardRepo.getFlashcardItemsByStatus with a status object and expects it to be called with the correct argument. 

  
11. Updates User Score and Adds Attempt
    - Test Case: "Updates User Score and Adds Attempt" 

    - Method:  
    
        - Calls FlashcardRepo.updateScoreAndAddAttempt with a score object and expects it to be called with the correct argument. 
  <img alt="image" src="https://github.com/Capstone-Projects-2023-Fall/project-studysync/assets/123430237/c1d55bc2-6687-4aa1-9b4a-1ea5d2d93bd3">

## MainQuizPage Component Test Suite 

 

1. Checking Answers 

    - Test Case: Verify that the checkAnswer method updates the state with the selected answer. 

    - Method: checkAnswer(index) 

    - Expected Result: The state of the questions should reflect the selected answer. If the selected answer is correct, the corresponding question's userAnswer should match the correctChoice. 

 

2. Calculating Score 

    - Test Case: Ensure that the calculateScore method correctly calculates the score after all questions have been answered. 

    - Method: calculateScore() 

    - Expected Result: The calculated score percentage should be displayed based on the number of correct answers. 

 

3. Calculating Initial Time 

    - Test Case: Confirm that the calculateInitialTime method computes the initial time correctly when the component mounts based on the number of questions. 

    - Method: calculateInitialTime() 

    - Expected Result: The initial time displayed should be the total number of questions multiplied by the allotted time per question (in seconds). 

<img  alt="image" src="https://github.com/Capstone-Projects-2023-Fall/project-studysync/assets/123430237/05c928a2-e9bc-4dfa-a09b-4b11a6d89dd4">

## Leaderboard Component Test Suite 

 

1. Fetching Users and Scores 

    - Test Case: Confirm that the fetchUsersAndScores method retrieves the list of users and their scores when the component loads. 

    - Method: fetchUsersAndScores() 

    - Expected Result: Upon component load, the leaderboard should be populated with user data, reflecting their scores and rankings. 

 

2. Leaderboard Rendering 

    - Test Case: Verify that the renderLeaderboard method displays the leaderboard with users ranked according to their scores. 

    - Method: renderLeaderboard(data, title, key, rankKey) 

    - Expected Result: Users should be listed in the order of their ranks based on scores, with UI elements showing their names and scores. 

 

3. Search Handling 

    - Test Case: Ensure that the handleSearch method filters the leaderboard results according to the search query. 

    - Method: handleSearch(event) 

    - Expected Result: As a user types into the search field, the leaderboard should update in real-time to only display users whose names match the search query. 
<img  alt="image" src="https://github.com/Capstone-Projects-2023-Fall/project-studysync/assets/123430237/6a5067d5-2f0a-478f-9f7c-6e365ba99434">

## Event Repository Test Suite

1. CreateEvent
    - Test Case: Test creating an event.

    - Method: CreateEvent()

    - Expected Result: The event should be successfully created in the repository.

2. CreateNewFollowerEvent
    - Test Case: Test creating a new follower event.

    - Method: CreateNewFollowerEvent()

    - Expected Result: The new follower event should be successfully created in the repository.

3. CreateShareQuizEvent
    - Test Case: Test creating a share quiz event.

    - Method: CreateShareQuizEvent()

    - Expected Result: The share quiz event should be successfully created in the repository.

4. CreateShareFlashCardEvent
    - Test Case: Test creating a share flashcard event.

    - Method: CreateShareFlashCardEvent()

    - Expected Result: The share flashcard event should be successfully created in the repository.

5. CreateUpcomingEvent
    - Test Case: Test creating an upcoming event.

    - Method: CreateUpcomingEvent()

    - Expected Result: The upcoming event should be successfully created in the repository.

6. GetEvent
    - Test Case: Test getting an event by id.

    - Method: GetEvent(eventId)

    - Expected Result: The event with the specified eventId should be retrieved from the repository.

7. GetPastEvent
    - Test Case: Test getting an event that is in the past.

    - Method: GetPastEvent()

    - Expected Result: A past event should be retrieved from the repository.

8. GetUpcomingEvent
    - Test Case: Test getting an upcoming event.

    - Method: GetUpcomingEvent()

    - Expected Result: An upcoming event should be retrieved from the repository.

9. UpdateUpcomingEvent
    - Test Case: Test updating an upcoming event.

    - Method: UpdateUpcomingEvent(eventId, updatedEvent)

    - Expected Result: The upcoming event with the specified eventId should be successfully updated in the repository.

10. MarkAsNotified
    - Test Case: Test marking a past event as notified.

    - Method: MarkAsNotified(eventId)

    - Expected Result: The specified past event should be marked as notified in the repository.
<img  alt="image" src="https://github.com/Capstone-Projects-2023-Fall/project-studysync/assets/123430237/7d8b1e4d-2c0d-4aac-8e1c-6a39a75345f1">

## Notification Repository Test Suite
1. getNotificationById
    - Test Case: Test getting notification by id.

    - Method: getNotificationById(notificationId)

    - Expected Result: The notification with the specified notificationId should be retrieved from the repository.

2. addNotification
    - Test Case: Test adding a notification.

    - Method: addNotification(notification)

    - Expected Result: The notification should be successfully added to the repository.

3. getListOfNotifications
    - Test Case: Test getting a list of notifications.

    - Method: getListOfNotifications()

    - Expected Result: A list of notifications should be retrieved from the repository.

4. UpdateNotification
    - Test Case: Test updating a notification.

    - Method: UpdateNotification(notificationId, updatedNotification)

    - Expected Result: The notification with the specified notificationId should be successfully updated in the repository.
      <img  alt="image" src="https://github.com/Capstone-Projects-2023-Fall/project-studysync/assets/123430237/efe8b42e-189e-4bfd-9c96-78aaa0d29c05">


## QuizRepository Test Suite
1. Test whether you can fetch all quizzes
    - Test Case: Test whether you can fetch all quizzes.

    - Method: get_AllQuizzes()

    - Expected Result: The repository should successfully fetch all quizzes.

2. Handles errors when fetching all quizzes
    - Test Case: Handles errors when fetching all quizzes.

    - Method: get_AllQuizzes()

    - Expected Result: The repository should handle errors gracefully when attempting to fetch all quizzes.

3. Tests the functionality of finding a quiz with a valid id
    - Test Case: Tests the functionality of finding a quiz with a valid id.

    - Method: get_QuizById(validQuizId)

    - Expected Result: The repository should successfully find and return the quiz with the validQuizId.
4. Tests the failure case of finding a quiz with an invalid id
    - Test Case: Tests the failure case of finding a quiz with an invalid id.

    - Method: get_QuizById(invalidQuizId)

    - Expected Result: The repository should handle the failure case gracefully and return an appropriate error or null when attempting to find a quiz with an invalid id.


<img alt="image" src="https://github.com/Capstone-Projects-2023-Fall/project-studysync/assets/123430237/0e25bd14-58d1-4352-8447-756aa494a808">

## Flashcard Repository Test Suite

1. Test the functionality of retrieving a flashcard set by id
    - Test Case: Test the functionality of retrieving a flashcard set by id.

    - Method: getFlashcardSet(flashcardSetId)

    - Expected Result: The repository should successfully retrieve and return the flashcard set with the specified flashcardSetId.

2. getAll_flashcardSet
    - Test Case: Test the functionality of retrieving all flashcard sets from the database.

    - Method: getAll_flashcardSet()

    - Expected Result: The repository should successfully retrieve and return all flashcard sets from the database.

3. getFlashcardSetBy_Id
    - Test Case: Test the functionality of retrieving a flashcard set by id.

    - Method: getFlashcardSetBy_Id(flashcardSetId)

    - Expected Result: The repository should successfully retrieve and return the flashcard set with the specified flashcardSetId.

4. getFlashcards
    - Test Case: Tests the functionality of retrieving flashcards given a list of ids.

    - Method: getFlashcards(flashcardIds)

    - Expected Result: The repository should successfully retrieve and return the flashcards corresponding to the list of flashcardIds.

<img alt="image" src="https://github.com/Capstone-Projects-2023-Fall/project-studysync/assets/123430237/e74c33b4-8579-41f6-920a-1816eff6c5d4">

## UserRepository Test Suite

1. Get Item

    - Test Case: Test get user flashcards

    - Method: getUserFlashcards(userId)

    - Expected Result: The repository should successfully retrieve and return the flashcards associated with the specified userId.
      
2. Test get user quizzes
    - Test Case: Test get user quizzes

    - Method: getUserQuizzes(userId)

    - Expected Result: The repository should successfully retrieve and return the quizzes associated with the specified userId.
      
3. Test get user events
    - Test Case: Test get user events

    - Method: getUserEvents(userId)

    - Expected Result: The repository should successfully retrieve and return the events associated with the specified userId.
4. Test get user notifications
    - Test Case: Test get user notifications

    - Method: getUserNotifications(userId)

    - Expected Result: The repository should successfully retrieve and return the notifications associated with the specified userId.
5. Test get user upcoming events
    - Test Case: Test get user upcoming events

    - Method: getUserUpcomingEvents(userId)

    - Expected Result: The repository should successfully retrieve and return the upcoming events associated with the specified userId.

6. Getting Item by Id

    - Test Case: Followers - Test Get followers by id

    - Method: getFollowersById(userId)

    - Expected Result: The repository should successfully retrieve and return the followers of the user with the specified userId.
7. Test Get following by id
    - Test Case: Following - Test Get following by id

    - Method: getFollowingById(userId)

    - Expected Result: The repository should successfully retrieve and return the users followed by the user with the specified userId.
8. Test Get events by id
    - Test Case: Events - Test Get events by id

    - Method: getEventsById(userId)

    - Expected Result: The repository should successfully retrieve and return the events associated with the user with the specified userId.
9. Test Get notifications by id
    - Test Case: Notifications - Test Get notifications by id

    - Method: getNotificationsById(userId)

    - Expected Result: The repository should successfully retrieve and return the notifications associated with the user with the specified userId.
10. Test Get shared quizzes by id
    - Test Case: Shared Quizzes - Test Get shared quizzes by id

    - Method: getSharedQuizzesById(userId)

    - Expected Result: The repository should successfully retrieve and return the shared quizzes associated with the user with the specified userId.
11. Test Get owned quizzes by id
    - Test Case: Owned Quizzes - Test Get owned quizzes by id

    - Method: getOwnedQuizzesById(userId)

    - Expected Result: The repository should successfully retrieve and return the owned quizzes associated with the user with the specified userId.
12. Test Get upcoming events by id
    - Test Case: Upcoming Events - Test Get upcoming events by id

    - Method: getUpcomingEventsById(userId)

    - Expected Result: The repository should successfully retrieve and return the upcoming events associated with the user with the specified userId.

13. Adding Item by Add

    - Test Case: Followers - Test Add followers by id

    - Method: addFollowerById(userId, followerId)

    - Expected Result: The repository should successfully add the follower (followerId) to the user with the specified userId.
14. Following - Test Add following by id
    - Test Case: Following - Test Add following by id

    - Method: addFollowingById(userId, followingId)

    - Expected Result: The repository should successfully add the following (followingId) to the user with the specified userId.
15. Test Add events by id
    - Test Case: Events - Test Add events by id

    - Method: addEventById(userId, eventId)

    - Expected Result: The repository should successfully add the event (eventId) to the user with the specified userId.
16. Test Add notifications by id
    - Test Case: Notifications - Test Add notifications by id

    - Method: addNotificationById(userId, notificationId)

    - Expected Result: The repository should successfully add the notification (notificationId) to the user with the specified userId.
17. Test Add shared quizzes by id
    - Test Case: Shared Quizzes - Test Add shared quizzes by id

    - Method: addSharedQuizById(userId, quizId)

    - Expected Result: The repository should successfully add the shared quiz (quizId) to the user with the specified userId.
18. Test Add owned quizzes by id
    - Test Case: Owned Quizzes - Test Add owned quizzes by id

    - Method: addOwnedQuizById(userId, quizId)

    - Expected Result: The repository should successfully add the owned quiz (quizId) to the user with the specified userId.
19. Test Add upcoming events by id
    - Test Case: Upcoming Events - Test Add upcoming events by id

    - Method: addUpcomingEventById(userId, eventId)

    - Expected Result: The repository should successfully add the upcoming event (eventId) to the user with the specified userId.

20. Test should convert 24-hour time to 12-hour format
    - Test Case: Test should convert 24-hour time to 12-hour format

    - Method: convertTo12HourFormat(time)

    - Expected Result: The method should successfully convert the given 24-hour time to 12-hour format.
21. test should return the short form of the day of the week
    - Test Case: Test should return the short form of the day of the week

    - Method: getShortDayOfWeek(dayOfWeek)

    - Expected Result: The method should successfully return the short form of the given day of the week.
22. Test should return the abbreviated month name
    - Test Case: Test should return the abbreviated month name

    - Method: getAbbreviatedMonthName(month)

    - Expected Result: The method should successfully return the abbreviated month name for the given month.
23. Test should return true for a future timestamp
    - Test Case: Test should return true for a future timestamp

    - Method: isFutureTimestamp(timestamp)

    - Expected Result: The method should return true if the timestamp is in the future.
24.  Test should return false for a past timestamp
    - Test Case: Test should return false for a past timestamp

    - Method: isFutureTimestamp(timestamp)

    - Expected Result: The method should return false if the timestamp is in the past.


25. Test Remove follower by id
    - Test Case: Follower - Test Remove follower by id

    - Method: removeFollowerById(userId, followerId)

    - Expected Result: The repository should successfully remove the follower (followerId) from the user with the specified userId.
26. Test Remove following by id
    - Test Case: Following - Test Remove following by id

    - Method: removeFollowingById(userId, followingId)

    - Expected Result: The repository should successfully remove the following (followingId) from the user with the specified userId.
27. Test Remove notifications by id
    - Test Case: Notifications - Test Remove notifications by id

    - Method: removeNotificationById(userId, notificationId)

    - Expected Result: The repository should successfully remove the notification (notificationId) from the user with the specified userId.
28. Test Remove upcoming events by id
    - Test Case: Upcoming Events - Test Remove upcoming events by id

    - Method: removeUpcomingEventById(userId, eventId)

    - Expected Result: The repository should successfully remove the upcoming event (eventId) from the user with the specified userId.


<img alt="image" src="https://github.com/Capstone-Projects-2023-Fall/project-studysync/assets/123430237/bb2796c5-36d4-4d10-b97d-ffadf8f34cd0">




