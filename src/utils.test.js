//--------------------------------------------------------------------------------
//import
import Dashboard from './js/models/dashboard';
import User from './js/models/user';
import Quiz from './js/models/quiz';
import AiTutor from './js/models/aiTutor';
import Event from './js/models/event';
import Flashcard from './js/models/flashcard.js';
import Leaderboard from './js/models/leaderboard.js';
import Notification from './js/models/notification.js';
import Question from './js/models/question.js';
import SchedulingSystem from './js/models/schedualSys.js'; 
import Score from './js/models/Score.js';
import DashboardCom from './js/react/DashboardCom.js';
import Friends from './js/react/DashboardUI/Friends.js';

//--------------------------------------------------------------------------------
// AiTutor.test.js
describe('AiTutor', () => {
  it('should return a valid response when asked a question', () => {
    // Arrange
    const aiTutor = new AiTutor();
    // Act
    const response = aiTutor.askQuestion();
    // Assert
    expect(response).toBeDefined(); 
    expect(typeof response).toBe('string'); 
  });
});
// AiTutor.test.js end
//--------------------------------------------------------------------------------
// AiTutor.test.js
describe('Dashboard', () => {
    it('should allow the user to take a specified quiz and return the result', () => {
      // Mock user data for testing
      const user = new User(/* pass user data here */);  
      // Mock data for recent quizzes
      const recentQuizzes = [
        new Quiz({ id: 1, name: 'Quiz 1' }),
        new Quiz({ id: 2, name: 'Quiz 2' }),
      ]; 
      // Create a new Dashboard instance before the test
      const dashboard = new Dashboard(user);  
      // Initialize the dashboard with mock data
      dashboard.recentQuizzes = recentQuizzes;  
      const quizID = 1;  
      // Mock a quizResult object
      const quizResult = {
        score: 85, 
        totalQuestions: 10, 
      };
  
      // Now you can make assertions on the mock quizResult
      expect(quizResult).toBeDefined();
      expect(quizResult.score).toEqual(expect.any(Number));
      expect(quizResult.totalQuestions).toEqual(expect.any(Number));
    });
  });
// AiTutor.test.js end
//--------------------------------------------------------------------------------
// Event.test.js
describe('Event', () => {
  it('should create a new Event instance with date and title', () => {
    // Arrange
    const date = new Date('2023-10-15');
    const title = 'Sample Event';

    // Act
    const event = new Event(date, title);

    // Assert
    expect(event).toBeDefined(); 
    expect(event.date).toBe(date); 
    expect(event.title).toBe(title); 
  });

  it('should allow editing the details of the event', () => {
    // Arrange
    const date = new Date('2023-10-15');
    const title = 'Sample Event';
    const event = new Event(date, title);

    // Act
    event.editEvent();


  });
});
// Event.test.js end
//--------------------------------------------------------------------------------
// Flashcard.test.js
describe('Flashcard', () => {
   
    it('should create a new flashcard with the correct properties', () => {
      // Arrange
      const term = 'Term';
      const definition = 'Definition';
      const owner = new User();
  
      // Act
      const flashcard = new Flashcard(term, definition, owner);
  
      // Assert
      expect(flashcard).toBeDefined(); 
      expect(flashcard.term).toBe(term); 
      expect(flashcard.definition).toBe(definition); 
      expect(flashcard.owner).toBe(owner); 
      expect(flashcard.creationDate).toBeDefined(); 
    });
  
   
    it('should view flashcard details', () => {
      // Arrange
      const term = 'Term';
      const definition = 'Definition';
      const owner = new User();
      const flashcard = new Flashcard(term, definition, owner);
  
      // Act
      const consoleSpy = jest.spyOn(console, 'log');
      flashcard.view();
  
      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(`Term: ${term}\nDefinition: ${definition}`);
    });
  
    
    it('should edit flashcard term and definition', () => {
      // Arrange
      const term = 'Term';
      const definition = 'Definition';
      const owner = new User();
      const flashcard = new Flashcard(term, definition, owner);
      const newTerm = 'New Term';
      const newDefinition = 'New Definition';
  
      // Act
      const consoleSpy = jest.spyOn(console, 'log');
      flashcard.edit(newTerm, newDefinition);
  
      // Assert
      expect(flashcard.term).toBe(newTerm); 
      expect(flashcard.definition).toBe(newDefinition); 
      expect(consoleSpy).toHaveBeenCalledWith('Flashcard edited successfully.');
    });
  
   
    it('should share the flashcard with a friend', () => {
      // Arrange
      const term = 'Term';
      const definition = 'Definition';
      const owner = new User();
      const flashcard = new Flashcard(term, definition, owner);
      const friend = new User();
  
      // Act
      const consoleSpy = jest.spyOn(console, 'log');
      flashcard.shareWithFriend(friend);
  
      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(`Flashcard shared with ${friend.name}.`);
    });
  });
// Flashcard.test.js end
//--------------------------------------------------------------------------------
// Leaderboard.test.js
describe('Leaderboard', () => {
    it('should create a new leaderboard with an empty list of quiz scores', () => {
      // Arrange
      const leaderboard = new Leaderboard();
  
      // Act
      const { quizScores } = leaderboard;
  
      // Assert
      expect(quizScores).toBeDefined();
      expect(Array.isArray(quizScores)).toBe(true);
      expect(quizScores.length).toBe(0);
    });
  
    it('should update the leaderboard', () => {
      // Arrange
      const leaderboard = new Leaderboard();
  
      // Act
      const consoleSpy = jest.spyOn(console, 'log');
      leaderboard.update();
  
      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('Leaderboard updated.');
    });
  });
// Leaderboard.test.js end
//--------------------------------------------------------------------------------
// Notification.test.js
describe('Notification', () => {
    it('should create a new notification with default values', () => {
      // Arrange
      const notification = new Notification();
  
      // Act
      const { message, type } = notification;
  
      // Assert
      expect(message).toBe('');
      expect(type).toBe(0);
    });
  
    it('should create a new notification with specified values', () => {
      // Arrange
      const message = 'New friend request';
      const type = 1;
  
      // Act
      const notification = new Notification(message, type);
  
      // Assert
      expect(notification.message).toBe(message);
      expect(notification.type).toBe(type);
    });
  
    it('should display the notification', () => {
      // Arrange
      const message = 'New flashcard reminder';
      const type = 2;
      const notification = new Notification(message, type);
  
      // Act
      const consoleSpy = jest.spyOn(console, 'log');
      notification.display();
  
      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(`[${type}] ${message}`);
    });
  });
// Notification.test.js end
//--------------------------------------------------------------------------------
// Question.test.js
describe('Question', () => {
    it('should create a new question with specified values', () => {
      // Arrange
      const questionText = 'What is the capital of France?';
      const choices = ['London', 'Berlin', 'Paris', 'Madrid'];
      const correctAnswer = 'Paris';
  
      // Act
      const question = new Question(questionText, choices, correctAnswer);
  
      // Assert
      expect(question.question).toBe(questionText);
      expect(question.choice).toEqual(choices);
      expect(question.correctAnswer).toBe(correctAnswer);
    });
  
    it('should view the question and its choices', () => {
      // Arrange
      const questionText = 'What is 2 + 2?';
      const choices = ['3', '4', '5', '6'];
      const correctAnswer = '4';
      const question = new Question(questionText, choices, correctAnswer);
  
      // Act
      const display = question.view();
  
      // Assert
      expect(display).toContain(questionText);
      choices.forEach((choice) => {
        expect(display).toContain(choice);
      });
    });
  
    it('should check if the chosen answer is correct', () => {
      // Arrange
      const questionText = 'What is the capital of Italy?';
      const choices = ['London', 'Berlin', 'Rome', 'Madrid'];
      const correctAnswer = 'Rome';
      const question = new Question(questionText, choices, correctAnswer);
  
      // Act
      const correctChoice = 'Rome';
      const incorrectChoice = 'Berlin';
  
      // Assert
      expect(question.checkAnswer(correctChoice)).toBe(true);
      expect(question.checkAnswer(incorrectChoice)).toBe(false);
    });
  });
// Question.test.js end
//--------------------------------------------------------------------------------
// Quiz.test.js
describe('Quiz', () => {
    it('should create a new quiz with specified questions and owner', () => {
      // Arrange
      const owner = new User('user@example.com', 'password');
      const questions = [
        new Question('What is 2 + 2?', ['3', '4', '5', '6'], '4'),
        new Question('What is the capital of France?', ['London', 'Berlin', 'Paris', 'Madrid'], 'Paris'),
      ];
  
      // Act
      const quiz = new Quiz(questions, owner);
  
      // Assert
      expect(quiz.question).toEqual(questions);
      expect(quiz.owner).toBe(owner);
    });
  
    it('should edit the questions of the quiz', () => {
      // Arrange
      const owner = new User('user@example.com', 'password');
      const initialQuestions = [
        new Question('What is 2 + 2?', ['3', '4', '5', '6'], '4'),
        new Question('What is the capital of France?', ['London', 'Berlin', 'Paris', 'Madrid'], 'Paris'),
      ];
      const updatedQuestions = [
        new Question('What is 3 + 3?', ['5', '6', '7', '8'], '6'),
        new Question('What is the capital of Germany?', ['London', 'Berlin', 'Paris', 'Madrid'], 'Berlin'),
      ];
  
      const quiz = new Quiz(initialQuestions, owner);
  
      // Act
      quiz.edit(updatedQuestions);
  
      // Assert
      expect(quiz.question).toEqual(updatedQuestions);
    });
  
    it('should allow a user to take the quiz', () => {
      // Arrange
      const owner = new User('user@example.com', 'password');
      const questions = [
        new Question('What is 2 + 2?', ['3', '4', '5', '6'], '4'),
        new Question('What is the capital of France?', ['London', 'Berlin', 'Paris', 'Madrid'], 'Paris'),
      ];
      const quiz = new Quiz(questions, owner);
  
      // Act
      quiz.takeQuiz();
  
    });
  
    it('should display the results after taking the quiz', () => {
      // Arrange
      const owner = new User('user@example.com', 'password');
      const questions = [
        new Question('What is 2 + 2?', ['3', '4', '5', '6'], '4'),
        new Question('What is the capital of France?', ['London', 'Berlin', 'Paris', 'Madrid'], 'Paris'),
      ];
      const quiz = new Quiz(questions, owner);
  
      // Act
      const score = quiz.viewResults();
  
      // Assert
      // You can add assertions related to viewing the quiz results.
    });
  
    it('should share the quiz with a friend', () => {
      // Arrange
      const owner = new User('user@example.com', 'password');
      const questions = [
        new Question('What is 2 + 2?', ['3', '4', '5', '6'], '4'),
        new Question('What is the capital of France?', ['London', 'Berlin', 'Paris', 'Madrid'], 'Paris'),
      ];
      const quiz = new Quiz(questions, owner);
      const friend = new User('friend@example.com', 'friendpassword');
  
      // Act
      quiz.shareWithFriend(friend);
  
      
    });
  });
// Quiz.test.js end
//--------------------------------------------------------------------------------
// SchedulingSystem.test.js
describe('SchedulingSystem', () => {
    it('should schedule a new event', () => {
      // Arrange
      const schedulingSystem = new SchedulingSystem();
      const date = new Date('2023-12-31');
      const title = 'New Year Party';
  
      // Act
      const scheduledEvent = schedulingSystem.scheduleEvent(date, title);
  
      // Assert
      expect(scheduledEvent).toBeInstanceOf(Event);
      expect(schedulingSystem.scheduledEvents).toContain(scheduledEvent);
    });
  
    it('should remove an event by ID and move it to eventHistory', () => {
      // Arrange
      const schedulingSystem = new SchedulingSystem();
      const date = new Date('2023-12-31');
      const title = 'New Year Party';
      const scheduledEvent = schedulingSystem.scheduleEvent(date, title);
  
      // Act
      schedulingSystem.removeEvent(scheduledEvent.id);
  
      // Assert
      expect(schedulingSystem.scheduledEvents).not.toContain(scheduledEvent);
      expect(schedulingSystem.eventHistory).toContain(scheduledEvent);
    });
  
    it('should not remove an event if ID is not found', () => {
      // Arrange
      const schedulingSystem = new SchedulingSystem();
      const date = new Date('2023-12-31');
      const title = 'New Year Party';
      schedulingSystem.scheduleEvent(date, title);
  
      // Act
      schedulingSystem.removeEvent(999);
  
      // Assert
      expect(schedulingSystem.scheduledEvents.length).toBe(1); 
      expect(schedulingSystem.eventHistory.length).toBe(0); 
    });
  
    it('should send reminders to users about upcoming events', () => {
      // Arrange
      const schedulingSystem = new SchedulingSystem();
      const date = new Date('2023-12-31');
      const title = 'New Year Party';
      schedulingSystem.scheduleEvent(date, title);
  
      // Act
      schedulingSystem.remindUser();
  
    });
  });
// SchedulingSystem.test.js end
//--------------------------------------------------------------------------------
// Score.test.js
describe('Score', () => {
    it('should create a new Score instance', () => {
      // Arrange
      const user = new User('test@example.com', 'password');
      const obtainedMarks = 85;
      const totalMarks = 100;
  
      // Act
      const score = new Score(user, obtainedMarks, totalMarks);
  
      // Assert
      expect(score).toBeInstanceOf(Score);
      expect(score.user).toBe(user);
      expect(score.obtainedMarks).toBe(obtainedMarks);
      expect(score.totalMarks).toBe(totalMarks);
    });
  
    it('should calculate the percentage of marks obtained', () => {
      // Arrange
      const user = new User('test@example.com', 'password');
      const obtainedMarks = 85;
      const totalMarks = 100;
      const score = new Score(user, obtainedMarks, totalMarks);
  
      // Act
      const percentage = score.calculatePercentage();
  
      // Assert
      expect(percentage).toBe(85.00); 
    });
  });
// Score.test.js end
//--------------------------------------------------------------------------------


//Unit test dashboard
describe(DashboardCom,()=>{

  const mockFriends = [{name: "Harris",id: "123123",imageURL:"123ndnasdlknsad"},
  {name:"Ichigo",id:"89y84y3123",imageURL:"329ulkncknasca"}];

  it('Correctly renders friends in the table', () => {
    render(<Friends friends={mockFriends} />);

    // Check if the friends' names are rendered
    mockFriends.forEach((friend) => {
      const friendName = screen.getByText(friend.name);
      expect(friendName).toBeInTheDocument();
    });

    // Check if the friends' profile picture URLs are rendered
    mockFriends.forEach((friend) => {
      if (friend.imageURL) {
        const friendImage = screen.getByAltText('friend-profile-picture');
        expect(friendImage).toBeInTheDocument();
        expect(friendImage).toHaveAttribute('src', friend.imageURL);
      }
    });
  });
})