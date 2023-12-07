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

            const usersWithScoresAndQuizzesPromises = usersData.map(async user => {
                const quizzesSnapshot = await getDocs(collection(database, 'quizzesCreation'));
                let totalScore = 0;
                let attemptCount = 0;

                quizzesSnapshot.forEach(quizDoc => {
                    const quizData = quizDoc.data();
                    if (quizData.authorId === user.id && quizData.quizScore) {
                        const userAttempts = Object.values(quizData.quizScore).filter(attempt => attempt.attempt > 0);
                        userAttempts.forEach(attempt => {
                            totalScore += attempt.score;
                        });
                        attemptCount += userAttempts.length; // Increment by the number of attempts, not quizzes
                    }
                });

                const averageScore = attemptCount > 0 ? (totalScore / attemptCount) : 0;
                return { ...user, averageScore: averageScore.toFixed(2), quizCount: attemptCount }; // Use attemptCount for quizCount
            });

            const usersWithScoresAndQuizzes = await Promise.all(usersWithScoresAndQuizzesPromises);
            this.setState({ usersData: usersWithScoresAndQuizzes, isLoading: false });
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

    renderTotalQuizzesLeaderboard(data) {
        return (
            <div className="leaderboard-section">
                <h2>Total Quizzes Taken</h2>
                <table className="leaderboard-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Quizzes Taken</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(user => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.quizCount}</td>
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

        const sortedUsersByScore = [...usersData].sort((a, b) => parseFloat(b.averageScore) - parseFloat(a.averageScore));
        const sortedUsersByQuizzes = [...usersData].sort((a, b) => b.quizCount - a.quizCount);

        return (
            <div className="leaderboards-container">
                {this.renderLeaderboard(sortedUsersByScore, 'Average Score Leaderboard', 'averageScore')}
                {this.renderTotalQuizzesLeaderboard(sortedUsersByQuizzes)}
            </div>
        );
    }
}

export default Leaderboard;