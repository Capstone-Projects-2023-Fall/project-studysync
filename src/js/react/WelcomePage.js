import './WelcomeStyles.css';

const WelcomePage=()=>{
    return(
        <body>
          <div class="container">
              <h1>Welcome to Our StudySync</h1>
              <p>StudySync is a web-based studying tool that allows users to add flashcards with terms and definitions to study from. </p>
              <p> The added flashcards can be customized by upvoting/downvoting cards , adding comments to a friend’s study set, and organizing cards’ priority levels, 
                upcoming dates and difficulty levels. 
              </p>  
              <p>Users can also add friends and create flashcards and quizzes/tests for each other. 
                They can also compete based on the score of the tests they made for each other.
              </p>
              <p>Sign up or log in <a href="/login"> here </a> to get started!</p>
          </div>
        </body>
      )
}

export default WelcomePage;