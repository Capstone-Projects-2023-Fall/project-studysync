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
  - User login using StudySync credential.
  - After logging into the account, the user navigates to Study Tool tab to check his flashcard decks.
  - Then he found the flashcard topic for his subject.
  - After reviewing the flashcards, the user went back to Study Tool page and select "Quiz".
  - Finally, the user completes the quiz and the correct answer is displayed.
  - After submission, the quiz shows all the correct answer and quiz score will be saved to the leaderboard.

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
   - Action: Now the user is ready to take the quiz by selecting Quiz.
   - Expected Result: The user was able to complete the quiz and view the correct answers.
4. **Collection of Incorrect Questions**:
   - Action: The system collects incorrect questions for later review.
   - Expected Result: The system collected and stored incorrect questions for review.


## USE CASE #2:
 
Features to be Tested: User Account Management, Flashcards Creation/Customization.

- A user is about to take a naturalization test but does not have time to study for it due to work, so they need to practice for the test using StudySync.
  - Users opens the website and logs in with their StudySync accounts.
  - Then since there is nothing on StudySync that he needs to learn, the user needs to add some flashcards.
  - He then adds the naturalization test questions he has studied and uploads them to StudySync.
  - After completing the upload of the flashcard items he chose flashcard mode to study those terms and definitions.
  - When the flashcard comes out there are three options, know, don't know, and not sure.
  - Finally, the rating for those questions will be saved and can be used to generate questions for quiz.

     
### Test Steps:
- **User Login**
  - Action: User navigates to StudySync website and logs in using their valid credentials.
  - Expected Result: The user is successfully logged in and has access to the website.
- **Flashcards Creation from User**
  - Action: The user selects flashcard topic and starts adding terms and definitions.
  - Expected Result: Flashcards are generated successfully.
- **Interacting with Custom Flashcards**
  - Action: The user gets to choose know, don't know and not sure when the flashcard pops up.
  - Expected Result: Data will be saved and user is able to generate question based on their flashcard ratings.
   
## USE CASE #3:
 
Features to be Tested: User Account Management, Social Learning, Quiz
 
- A user was recommended a learning program by his classmates that said he could have a quiz competition.
  - He navigates to StudySync website and sign up for a new StudySync account.
  - Then he went to the friends list and chose to add a friend.
  - After adding his friends he is able to receive a shared quiz from one of his friends.
  - The user then has the ability to do the quiz that was shared by his friends.
    
### Test Steps:

- **User Account Registration**
  - Action: The user wants to register an account to use Studysync.
  - Expected Result: The user successfully registers the account and gains access to Studysync.
- **Adding Friends on Studysync**
  - Action: The user is new to Studysync and would like to add some friends.
  - Expected Result: The user is able to follow their firends and wait to get the followback to consider friend.
- **Quiz Competition**
  - Action: After adding friends, the user is able to get the shared quiz from their friends
  - Expected Result: The user can successfully take the quiz and get their scores.
- **Viewing Scores and Rankings**
  - Action: The user wants to view the quiz scores and the leaderboard.
  - Expected Result: Scores are display for all participants as expected.
    
## USE CASE #4:
Features to be Tested: User Account Management, Flashcards Creation/Customization, AI-Generated Function
 
- A user wants to study the subject he wants, but he doesn't find the flashcard for the subject he wants in StudySync.
  - The user navigates to StudySync website and then logs in.
  - After he didn't find any flashcard for the subject he wanted to study, he turned on the AI topic generation function.
  - After pressing AI Assist button, the user is able to specify the description of his desired flashcards.
  - Once the AI has finished the flashcard generating, the user is able to study the flashcard and is also able to rate them.
  - After learning, the user is able to go "Quiz" mode and generate questions by using AI question generating feature.
  - The user didn't like the questions generated by AI, so he/she decides to edit the questions as well as the answer choices and then save it.
    
### Test Steps:
- **User Login**
  - Action: User navigates to StudySync website and logs in using their valid credentials.
  - Expected Result: The user is successfully logged in and has access to the website.
- **Enabling AI Flashcard Generator**
  - Action: The user cannot find any flashcards for his subjects, so he/she turns on AI Assist to generate flashcards.
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
- **Filtering AI-Generated Flashcards**
  - Action: The user gets all the AI-generated flashcards and wants to mark them as "know", "don't know", and "not sure".
  - Expected Result: Flashcards are generated by AI and can be rated for learning.
- **Managing Flashcards**
  - Action: The user wants to generate quiz questions based on their flashcard ratings.
  - Expected Result: The user is able to generate those questions through AI and has the ability to either delete them or edit.
    
## USE CASE #5:
Features to be Tested: User Account Management, Quiz.

- A user wants to take a quiz created by themselves or a friend.
  - User logs in to StudySync.
  - User then navigate to the "Quiz" section.
  - At the "Quiz" section, user has a wide range of quizzes either created by themselves or friends.
  - Then the user completes the quiz and submits their answers.
  - The system will then calculate and display users score on the leaderboard.
 
### Test Steps:
- **User Login**
  - Action: User navigates to Studysync website and logs in using their valid credentials.
  - Expected Result: The user is successfully logged in and has access to the website.
- **Navigating to the Quiz Section**
  - Action: The user wants to navigate to the Quiz section in the Studysync interface.
  - Expected Result: The Quiz section is loaded, and the user can view all available quizzes.
- **Selecting a Quiz**
  - Action: The user selects a specific from the list of available quizzes either from friends or themselves.
  - Expected Result: The selected quiz is loaded, and the user is able to work on the quiz seamlessly.
- **Viewing Scores and Rankings**
  - Action: The user has finished the quiz and now submitted for grading.
  - Expected Result: The quiz is now graded, and the system calculates the user’s score, displays it and updates the leaderboard.
    
## USE CASE #6:
Features to be Tested: User Account Management, Social Learning
 
- A user wants to add friends on StudySync.
  - The user will have to log in to their own account.
  - Then navigate to the "Add Friend" section.
  - User enters the friend's email or username.
  - Once the friend's name pops up, the user recognizes their friends then clicks "add as friend".
  - The friend receives the request and can accept or reject it.
    
### Test Steps:
- **User Login**
  - Action: User navigates to Studysync website and logs in using their valid credentials.
  - Expected Result: The user is successfully logged in and has access to the website.
- **Sending Friends Request**
  - Action: The user navigates to the “Add Friend” section.
  - Expected Result: The user sent a friend request and waits for approval.
- **Friend’s Response**
  - Action: The user’s friend receives the friend request and can either accept it or reject it.
  - Expected Result: The friend can either accept or reject the request without any issue.
    
## USE CASE #7:
Features to be Tested: User Account Management, Quiz.
 
- A user has been studying for 6 hours and wants to take a break but also wants to save the quiz's progress.
  - The user is taking a quiz but then realizes he/she wants to take a quick coffee break.
  - User clicks "Save&Exit" button in order for the quiz to be saved and quit.
  - The system saves the user's progress.
  - After the break, the user logs in and goes to the "Quiz" section to resume the paused quiz.
  - Users choose to resume the quiz from where they left off.
    
### Test Steps:
- **Save Quiz Progress**
  - Action: The user is taking a quiz but decides to quit by clicking Save&Exit button to save the quiz’s progress and quit.
  - Expected Result: The quiz’s progress is successfully saved.
- **Resuming the Quiz**
  - Action: After the break, the user logs back in and goes to the quiz section to resume the paused quiz.
  - Expected Result: The user can pick up the quiz where it has been left off and continue to work it.
    
## USE CASE #8:
Features to be Tested: User Account Management, Flashcards Creation/Customization

- A user finds out some flashcards need to be updated in order to improve accuracy.
  - User logs in to Studysync as usual.
  - Then the user has to go to their created flashcards.
  - User finds out which flashcards need to be updated.
  - User makes some changes to the flashcard definition and details.
  - User saves changes and then flashcards are updated and ready to be learned.

### Test Steps:
- **User Login**
  - Action: User navigates to Studysync website and logs in using their valid credentials.
  - Expected Result: The user is successfully logged in and has access to the website.
- **Accessing Flashcards**
  - Action: The user navigates to the flashcards that he/she wishes to update.
  - Expected Result: The user can navigate to the flashcards that need customizations.
- **Updating Flashcards** 
  - Action: The user identifies flashcards that need updates and then proceeds to make changes to the flashcard definitions and details.
  - Expected Result: The flashcards are updated and ready to be learned again.


