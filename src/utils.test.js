// //--------------------------------------------------------------------------------
// //import
// import Dashboard from './js/models/dashboard';
// import User from './js/models/user';
// import Quiz from './js/models/quiz';
// import AiTutor from './js/models/aiTutor';
// import Event from './js/models/event';
// import Flashcard from './js/models/flashcard.js';
// import Leaderboard from './js/models/leaderboard.js';
// import Notification from './js/models/notification.js';
// import Question from './js/models/question.js';
// import SchedulingSystem from './js/models/schedualSys.js'; 
// // import Score from './js/models/Score.js';
// import DashboardCom from './js/react/DashboardCom.js';
// import Friends from './js/react/DashboardUI/Friends.js';
// import { render ,screen} from '@testing-library/react';
// import Events from './js/react/DashboardUI/Events.js';
// import RecentCards from './js/react/DashboardUI/RecentCards.js';
// import FriendsPage from './js/react/FriendsPage.js';
// import userEvent from '@testing-library/user-event';
// import { userRepository } from './firebase.js';
// import bell from './bell.webp';



// describe('Friends Component', () => {
//   // Mock friends data for testing
//   const mockFriends = [
//     { id: 1, name: 'Friend 1', imageURL: 'https://example.com/image1.jpg' },
//     { id: 2, name: 'Friend 2', imageURL: 'https://example.com/image2.jpg' },
//   ];  
//   it('renders friends correctly', () => {
//     render(<Friends friends={mockFriends} />);

//     // Check if the friends' names are rendered
//     mockFriends.forEach((friend) => {
//       const friendNameElement = screen.getByText(friend.name);
//       expect(friendNameElement).toBeInTheDocument();
//     });

//     // Check if the friends' profile picture URLs are rendered
//     mockFriends.forEach((friend) => {
//       const friendImageElements = screen.getAllByAltText('friend-profile-picture');
//       const matchingImageElement = friendImageElements.find((element) =>
//         element.getAttribute('src') === friend.imageURL
//       );
//       expect(matchingImageElement).toBeInTheDocument();
//     });

//     // Check if the friends' profile links are rendered
//     mockFriends.forEach((friend) => {
//       const friendLinkElement = screen.getByRole('link', { name: friend.name });
//       expect(friendLinkElement).toHaveAttribute('href', `/profile/${friend.id}`);
//     });
//   });
// });





// describe('Events Component', () => {
//   // Mock events data for testing
//   const mockEvents = [
//     { name: 'Event 1', timestamp: new Date('2023-12-31T12:00:00Z').toISOString() },
//     { name: 'Event 2', timestamp: new Date('2023-12-30T15:30:00Z').toISOString() },
  
//   ];
//   it('renders upcoming events correctly', () => {
//     render(<Events events={mockEvents} />);

//     // Check if the event names are rendered
//     mockEvents.forEach((event) => {
//       const eventNameElement = screen.getByText(event.name);
//       expect(eventNameElement).toBeInTheDocument();
//     });


//   });
// });





// describe('RecentCards Component', () => {
//   // Mock card data for testing
//   const mockCard = {
//     name: 'Test Card',
//   };
//   const mockCardLink = '/test';
//   it('renders card correctly', () => {
//     render(<RecentCards card={mockCard}  cardLink={mockCardLink} />);

//     // Check if the card name is rendered
//     const cardNameElement = screen.getByText(/Test Card/);
//     expect(cardNameElement).toBeInTheDocument();

//     // Check if the card link is rendered
//     const cardLinkElement = screen.getByRole('link', { name: 'Test Card' });
//     expect(cardLinkElement).toHaveAttribute('href', '/test');


//   });
// });


