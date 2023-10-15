---
sidebar_position: 2
---
# Integration Test

## Overview:

Integration test is a critical phase in the software development process. It allows developers to combine different units and test them as a group to focus on validating the interaction and compatibility of different modules or components when they interact. 
The purpose of integration test in the Studysync project is to ensure that the integrated system functions as expected by following the requirement in order to bring a positive experience to the user. There are 5 key features we will test based on our use-case descriptions and sequence diagrams.

- **User account management**: Validate the overall functionality of user login, signing up, and profile management.
- **Flashcard creations/Customization**: Verify that users can create, edit, and remove flashcards as needed and ensure all flashcards are correctly stored and retrieved.
- **Social Learning**: Test the processes of sending friend requests and participating in a social learning environment.
- **Quizzes**: Ensure users can create, take, and save quiz progress accurately.
- **AI integration**: Verify that functionality of the AI-based technology in providing accurate definitions to every flashcard.

## USE CASE #1:

### Features to be Tested: 
User account management, Flashcards creation/customization, Interactivity, and collaboration.

- A user forgets to review because of daily chores and uses StudySync to review before midterm is approaching.
  - User login using Google api.
  - After logging into the account, the user finds the study outline.
  - Then he found the flash cards for his subject.
  - Next the user will proceed to flash Select Q&A mode.
  - Finally, the user completes the quiz and the correct answer is displayed.
  - The last wrong questions will be collected and then these questions will be saved in a new topic

### Test Steps:
1. **User Login**
   - Action: User navigates to Studysync website and logs in using their valid credentials.
   - Expected Result: The user is successfully logged in and has access to the website.
     ```
     GET/user/login
     Description: The user would like login with his/her Google account.
     Valid Request Body:
     {
     “email”: String,
     “password”: String
     }
     
     Successful Call:
     userId: Integer
     
     Failed Call:
     {
     “status”: 409,
     “body”: “Incorrect password.”
     }
     ```

2. **Accessing Correct Flashcards**:
   - Action: User wants to access flashcards before midterm.
   - Expected Result: The user was able to find and access flashcards relevant to their subject.
3. **Taking the Quiz**:
   - Action: Now the user is ready to take the quiz by selecting Quiz mode.
   - Expected Result: The user was able to complete the quiz and view the correct answers.
4. **Collection of Incorrect Questions**:
   - Action: The system collects incorrect questions for later review.
   - Expected Result: The system collected and stored incorrect questions for future review.


## USE CASE #2:
 
Features to be Tested: User Account Management, Flashcards Creation/Customization
 
-	A user is about to take a naturalization test but does not have time to study for it due to work, so he needs to practice for the test using Studysync.
  -	Users open the website and enter their account password to log in.
  - Then since there is nothing on Studysync that he needs to learn, he needs to enter the questions himself.
  - He then adds the naturalization test questions he has studied and uploads them to StudySync.
  - After completing the upload of the question bank, he chose flashcard mode for memory training.
  - When the flash card comes out there are three options, recognize, don't recognize.
  - Finally, the questions you recognize will be skipped in the next exercise, and the questions you don't recognize will show the answer and then continue to appear in the next exercise.
  - 
### Test Steps:
- User Login
  - Action: User navigates to Studysync website and logs in using their valid credentials.
  - Expected Result: The user is successfully logged in and has access to the website.
-	Flashcards Creation from User:
  - Action: The user selects custom flashcard mode by using their custom questions.
  - Expected Result: Flashcards are generated from the user’s custom questions.
-	Interacting with Custom Flashcards:
  - Action: The user gets to choose recognize or not recognize when flashcard pops up.
  - Expected Result: Recognized flashcards are skipped in the next exercise.
  - 
## USE CASE #3:
 
Features to be Tested: User Account Management, Social Learning, Quiz
 
- A user was recommended a learning program by his classmates that said he could have a quiz competition.
  - He opened the website his classmate gave him and created the account password.
  - Then he went to the friends list and chose to add a friend.
  - After adding his friends, he received an invitation to a quiz contest sent to him by his classmate.
  - After completing the quiz, the scores and rankings of the inviter as well as all invited people appeared.
    
### Test Steps:
-	User Account Registration
  - Action: The user wants to register an account to use Studysync.
  - Expected Result: The user successfully registered the account and has access to Studysync.
-	Adding Friends on Studysync
  - Action: The user is new to Studysync and would like to add some friends.
  - Expected Result: New friends were added and waiting for approval from others.
- Quiz Competition
  - Action: After adding friends, the user receives an invitation to a quiz competition from his/her friends.
  - Expected Result: The user can successfully join the quiz and complete the quiz.
-	Viewing Scores and Rankings
  - Action: The user wants to view the quiz scores and the leaderboard.
  - Expected Result: Scores and rankings for all participants are displayed as expected.
    
## USE CASE #4:
Features to be Tested: User Account Management, Flashcards Creation/Customization, AI-Generated Function
 
- A user wants to study the subject he wants but, he doesn't find the flash card for the subject he wants in StudySync.
  - He opened StudySync and automatically logged in
  - After he didn't find a flash card for the subject he wanted to study he turned on the AI topic generation function
  - After pressing AI Flash Card Generator you will first see all the flash cards and you can filter them.
  - After completing the screening you can study, then while flash card studying you are not satisfied with a particular topic then choose to be dissatisfied with that topic.
  - The question will then be deleted from the pool.
    
### Test Steps:
- User Login
  - Action: User navigates to Studysync website and logs in using their valid credentials.
  - Expected Result: The user is successfully logged in and has access to the website.
-	Enabling AI Flashcard Generator
  - Action: The user cannot find any flashcards for his subjects, so he/she turns on AI flashcards generator.
  - Expected Result: The AI flashcards generator feature is enabled.

 ```
POST/user/{userId}/enable-ai-flashcards
Description 
The user wants the AI system to generate flashcards for him to study his subject
 
{userId}: int
{enable-ai-flashcards}: true
 
Successful Call:
{
“success” : “200 AI flashcards generator enabled”
“userId”: Integer
}
 
Failed Call:
{ 
“error”: “500: An unexpected error occurred”
}
``` 
-	Filtering AI-Generated Flashcards
  - Action: The user gets all the AI-generated flashcards and wants to filter them.
  - Expected Result: Flashcards are generated by AI and can be filtered for learning.
-	Managing Flashcards:
  - Action: The user does not like some of the flashcards that AI has generated.
  - Expected Result: Any marked flashcards are removed successfully.
    
## USE CASE #5:
Features to be Tested: User Account Management, Quiz.
 
-	A user wants to take a quiz created by themselves or a friend.
  - User logs in to StudySync.
  - User then navigate to the "Quiz" section.
  - At the "Quiz" section, user has a wide range of quizzes either created by themselves or friends.
  - Then the user completes the quiz and submits their answers.
  - The system will then calculate and display users score on the leaderboard.
 
### Test Steps:
-	User Login
  - Action: User navigates to Studysync website and logs in using their valid credentials.
  - Expected Result: The user is successfully logged in and has access to the website.
-	Navigating to the Quiz Section
  - Action: The user wants to navigate to the Quiz section in the Studysync interface.
  - Expected Result: The Quiz section is loaded, and the user can view all available quizzes.
-	Selecting a Quiz
  - Action: The user selects a specific from the list of available quizzes either from friends or themselves.
  - Expected Result: The selected quiz is loaded, and the user is able to work on the quiz seamlessly.
-	Viewing Scores and Rankings:
  - Action: The user has finished the quiz and now submitted for grading.
  - Expected Result: The quiz is now graded, and the system calculates the user’s score, displays it and updates the leaderboard.
    
## USE CASE #6:
Features to be Tested: User Account Management, Social Learning
 
-	A user wants to add friends on StudySync.
  - The user will have to log in to their own account.
  - Then navigate to the "Add Friend" section.
  - User enters the friend's email or username.
  - Once the friend's name pops up, the user recognizes their friends then clicks "add as friend".
  - The friend receives the request and can accept or reject it.
    
### Test Steps:
-	User Login
  - Action: User navigates to Studysync website and logs in using their valid credentials.
  - Expected Result: The user is successfully logged in and has access to the website.
-	Sending Friends Request:
  - Action: The user navigates to the “Add Friend” section.
  - Expected Result: The user sent a friend request and waits for approval.
-	 Friend’s Response:
  - Action: The user’s friend receives the friend request and can either accept it or reject it.
  - Expected Result: The friend can either accept or reject the request without any issue.
    
## USE CASE #7:
Features to be Tested: User Account Management, Quiz.
 
-	A user has been studying for 6 hours and wants to take a break but also wants to save the quiz's progress.
  - The user is taking a quiz but then realizes he/she wants to take a quick coffee break.
  - User clicks "Save&Exit" button in order for the quiz to be saved and quit.
  - The system saves the user's progress.
  - After the break, the user logs in and goes to the "Quiz" section to resume the paused quiz.
  - Users choose to resume the quiz from where they left off.
    
### Test Steps:
-	Save Quiz Progress
  - Action: The user is taking a quiz but decides to quit by clicking Save&Exit button to save the quiz’s progress and quit.
  - Expected Result: The quiz’s progress is successfully saved.
-	Resuming the Quiz:
  - Action: After the break, the user logs back in and goes to the quiz section to resume the paused quiz.
  - Expected Result: The user can pick up the quiz where it has been left off and continue to work it.
    
## USE CASE #8:
Features to be Tested: User Account Management, Flashcards Creation/Customization
 
-	A user finds out some flashcards need to be updated in order to improve accuracy.
  - User logs in to Studysync as usual.
  - Then the user has to go to their created flashcards.
  - User finds out which flashcards need to be updated.
  - User makes some changes to the flashcard definition and details.
  - User saves changes and then flashcards are updated and ready to be learned.

### Test Steps:
-	User Login
  - Action: User navigates to Studysync website and logs in using their valid credentials.
  - Expected Result: The user is successfully logged in and has access to the website.
-	Accessing Flashcards
  - Action: The user navigates to the flashcards that he/she wishes to update.
  - Expected Result: The user can navigate to the flashcards that need customizations.
-	Updating Flashcards: 
  - Action: The user identifies flashcards that need updates and then proceeds to make changes to the flashcard definitions and details.
  - Expected Result: The flashcards are updated and ready to be learned again.


