import React from 'react';
import './leaderboard.css';
import { database } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

class Leaderboard extends React.Component {
    state = {
        usersData: [],
        isLoading: true,
        error: null
    };

    componentDidMount() {
        this.fetchUsersAndScores();
    }

    fetchUsersAndScores = async () => {
      this.setState({ isLoading: true });
      try {
          const usersSnapshot = await getDocs(collection(database, 'users'));
          const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          const usersWithScoresPromises = usersData.map(async user => {
              const quizzesSnapshot = await getDocs(collection(database, 'quizzesCreation'));
              let totalScore = 0;
              let attemptCount = 0;

              quizzesSnapshot.forEach(quizDoc => {
                  const quizData = quizDoc.data();
                  if (quizData.authorId === user.id && quizData.quizScore) {
                      Object.values(quizData.quizScore).forEach(attempt => {
                          totalScore += attempt.score;
                          attemptCount++;
                      });
                  }
              });

              const averageScore = attemptCount > 0 ? (totalScore / attemptCount) : 0;
              return { ...user, averageScore: averageScore.toFixed(2) };
          });

          const usersWithScores = await Promise.all(usersWithScoresPromises);
          this.setState({ usersData: usersWithScores, isLoading: false });
      } catch (error) {
          console.error("Error fetching users and quizzes: ", error);
          this.setState({ error, isLoading: false });
      }
    }
  
    renderLeaderboard(data, title, key) {
        return (
            <div className="leaderboard-section">
                <h2>{title}</h2>
                <table className="leaderboard-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>{key}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(user => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user[key]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    render() {
        const { usersData, isLoading, error } = this.state;

        if (isLoading) {
            return <div className="loading">Loading...</div>;
        }

        if (error) {
            return <div className="error">Error loading leaderboard: {error.message}</div>;
        }

        const sortedUsers = [...usersData].sort((a, b) => parseFloat(b.averageScore) - parseFloat(a.averageScore));

        return (
            <div className="leaderboards-container">
                {this.renderLeaderboard(sortedUsers, 'Average Score Leaderboard', 'averageScore')}
            </div>
        );
    }
}

export default Leaderboard;
