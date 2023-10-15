---
sidebar_position: 1
---
# Unit Test 

## User Class 
1.	Method: login()
    - Test Case: Verify if a user can log in with valid credentials. 
    - Input: Valid email and password. 
    - Expected Result: User logged in successfully. 

2.	Method: logout() 
    - Test Case: Verify if a user can log out. 
    - Input: None. 
    - Expected Result: User logged out successfully. 

3.	Method: register() 
    - Test Case: Verify if a user can register. 
    - 	Input: Valid user email and password. 
    - Expected Result: User successfully registered.

4.	Method: createFlashcard() 
    - Test Case: Verify if a user can create a flashcard. 
    - Input: Term and definition. 
    - Expected Result: Flashcard successfully created. 

5.	Method: viewFriendProfile() 
    - Test Case: Verify if a user can view a friend's profile. 
    - Input: User ID of the friend. 
    - Expected Result: Friend's profile details successfully displayed. 

6.	Method: addFriend() 
    - Test Case: Verify if a user can add another user as a friend. 
    - Input: User ID of the potential friend. 
    - Expected Result: User successfully added as a friend. 

7.	Method: removeFriend() 
    - Test Case: Verify if a user can remove another user from their friend list. 
    - Input: User ID of the friend to be removed. 
    - Expected Result: User successfully removed from the friend list.
      
8.	Method: followFriend () 
    - Test Case: Verify if a user can follow a friend. 
    - Input: User ID of the friend to be followed. 
    - Expected Result: Friend successfully followed.

10.	Method: unfollowFriend() 
    - Test Case: Verify if a user can unfollow a friend. 
    - Input: User ID of the friend to be unfollowed. 
    - Expected Result: Friend successfully unfollowed. 

  
## UserProfile Class 
1.	Method: updateProfile() 
    - Test Case: Verify if a user's profile can be updated. 
    - Input: New profile data. 
    - Expected Result: UserProfile updated with new data. 

## Notification Class 
1.	Method: display() 
    - Test Case: Verify if a notification is displayed. 
    - Input: Notification message and type. 
    - Expected Result: Notification displayed as per given type and message. 

## Flashcard Class 
1.	Method: view() 
    - Test Case: Verify if the flashcard can be displayed 
    - Input: Show flashcards. 
    - Expected Result: Display flashcard successfully.
      
2.	Method: edit() 
    - Test Case: Verify if the term definition of a flashcard can be edited. 
    - Input: New term string. 
    - Expected Result: Flashcard's term , definition updated successfully. 
3.	Method: shareWithFriend() 
    - Test Case: Verify if a flashcard can be shared with a friend. 
    - Input: Friend's User ID. 
    - Expected Result: Flashcard shared successfully with the specified friend. 
  
## StudyTool Class 
1.	Method: createFlashcards() 
    - Test Case: Verify if flashcards can be created. 
    - Input: List of Flashcard objects with terms and definitions. 
    - Expected Result: Flashcards successfully created in the system. 
2.	Method: createQuizQuestions() 
    - Test Case: Verify if quiz questions can be created. 
    - Input: List of QuizQuestion objects. 
    - Expected Result: Quiz questions successfully created in the system. 
3.	Method: scheduleStudySession() 
    - Test Case: Verify if a study session can be scheduled. 
    - Input: Date, start time, end time. 
    - Expected Result: Study session successfully scheduled on the specified date and time. 
  
## Quiz Class 
1.	Method: takeQuiz() 
    - Test Case: Verify if a user can take a quiz. 
    - Input: List of questions and user responses. 
    - Expected Result: Quiz taken successfully and results displayed. 
2.	Method: edit() 
    - Test Case: Verify if questions in the quiz can be edited. 
    - Input: List of edited QuizQuestion objects. 
    - Expected Result: Questions in the quiz are successfully updated. 
3.	Method: viewResults() 
    - Test Case: Verify if all score can be viewed. 
    - Input: score. 
    - Expected Result: Display the score. 
4.	Method: shareWithFriend() 
    - Test Case: Verify if a user can view a friend's score on the quiz. 
    - Input: User object representing the friend. 
    - Expected Result: Display the score of the specified friend on the quiz. 

## Social Class
1.  Method: view()
    - Test Case: Verify if the user can view their social dashboard.
    - Input: None.
    - Expected Result: Display of the user's social dashboard with friends, leaderboard, and other relevant details.
2.	Method: chat()
    - Test Case: Verify if the user can initiate or continue a chat with a friend.
    - Input: User ID or friend's name.
    - Expected Result: Chat window opens with the selected friend, and messages can be sent and received.

## Event Class
1.	Method: editEvent()
    - Test Case: Verify if details of an event can be edited.
    - Input: Event ID, updated title or date.
    - Expected Result: Event details successfully updated in the system.

## Leaderboard Class
1.	Method: update()
    - Test Case: Verify if the leaderboard can be updated with new scores.
    - Input: List of scores or individual score entry.
    - Expected Result: Leaderboard successfully updated with the new scores in the correct order.

## SchedulingSystem Class
1.	Method: scheduleEvent()
    - Test Case: Verify if an event can be scheduled using the scheduling system.
    - Input: User ID, date, title of the event.
    - Expected Result: Event successfully scheduled for the user on the given date with the specified title.
2.	Method: removeEvent()
    - Test Case: Verify if an event can be removed from the scheduling system.
    - Input: User ID, event ID or event title.
    - Expected Result: Event successfully removed from the user's schedule.
3.	Method: moveEvent()
    - Test Case: Verify if an event can be moved to a different date or time.
    - Input: User ID, event ID, new date and/or time.
    - Expected Result: Event's date and/or time successfully updated in the system.
4.	Method: remindUser()
    - Test Case: Verify if the scheduling system can send a reminder for an event to the user.
    - Input: User ID, event ID.
    - Expected Result: User receives a reminder notification for the specified event from the scheduling system.

## Dashboard Class
1.  Method: viewUpcomingEvent()
    - Test Case: Verify if a specific upcoming event can be viewed by its ID.
    - Input: Event ID.
    - Expected Result: Display the details of the specified event.
2.	Method: takeQuiz()
    - Test Case: Verify if the user can take a quiz from the dashboard.
    - Input: Quiz ID.
    - Expected Result: Start the specified quiz and allow the user to answer the questions.
3.	Method: studyFlashcards()
    - Test Case: Verify if the user can study flashcards from the dashboard.
    - Input: Set of flashcards or flashcard ID.
    - Expected Result: Display the selected set of flashcards for the user to study.

## AiTutor Class
1.	Method: askAQuestion()
    - Test Case: Verify if the user can ask a question to the AiTutor.
    - Input: A string containing the user's question.
    - Expected Result: The AiTutor provides an appropriate response or answer to the question.

## Score Class
1.	Method: calculatePercentage()
    - Test Case: Calculate percentage.
    - Input: User ID.
    - Expected Result: Return the percentage right
      
## Question Class
1.  Method: view()
    - Test Case: Verify if a specific question can be viewed.
    - Input: Question ID.
    - Expected Result: Display the details of the specified question.
2.  Method: checkAnswerChoice()
    - Test Case: Verify if a user's answer choice for a question can be checked for correctness.
    - Input: Question ID, User's Answer Choice.
    - Expected Result: Return whether the user's answer choice is correct or not.


