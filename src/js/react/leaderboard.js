import React from 'react';
import './leaderboard.css';
import { database } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

class Leaderboard extends React.Component {
    state = {
        usersData: [],
        isLoading: true,
        error: null,
        searchQuery: ''
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
                        attemptCount += userAttempts.length;
                    }
                });

                const averageScore = attemptCount > 0 ? (totalScore / attemptCount) : 0;
                return { ...user, averageScore: averageScore.toFixed(2), quizCount: attemptCount };
            });

            const usersWithScoresAndQuizzes = await Promise.all(usersWithScoresAndQuizzesPromises);

            // Sort and rank by average score
            usersWithScoresAndQuizzes.sort((a, b) => parseFloat(b.averageScore) - parseFloat(a.averageScore));
            usersWithScoresAndQuizzes.forEach((user, index) => {
                user.rankByScore = index + 1;
            });

            // Sort and rank by total quizzes taken
            usersWithScoresAndQuizzes.sort((a, b) => b.quizCount - a.quizCount);
            usersWithScoresAndQuizzes.forEach((user, index) => {
                user.rankByQuizzes = index + 1;
            });

            this.setState({ usersData: usersWithScoresAndQuizzes, isLoading: false });
        } catch (error) {
            console.error("Error fetching users and quizzes: ", error);
            this.setState({ error, isLoading: false });
        }
    }

    handleSearch = (event) => {
        this.setState({ searchQuery: event.target.value });
    }

    renderLeaderboard(data, title, key, rankKey) {
        const lowercasedQuery = this.state.searchQuery.toLowerCase();
        const filteredData = data
            .filter(user => user.name.toLowerCase().includes(lowercasedQuery))
            .sort((a, b) => {
                // If filtering by average score, maintain the sort by average score
                if (title === 'Average Score Leaderboard') {
                    return parseFloat(b.averageScore) - parseFloat(a.averageScore);
                }
                // If filtering by total quizzes, maintain the sort by quiz count
                if (title === 'Total Quizzes Taken') {
                    return b.quizCount - a.quizCount;
                }
            })
            .map((user, index) => ({
                ...user,
                // Reassign the ranks based on the filter and sort
                [rankKey]: index + 1
            }));

        return (
            <div className="leaderboardSection">
                <h2>{title}</h2>
                <table className="leaderboardTable">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Name</th>
                            <th>{key}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map(user => (
                            <tr key={user.id}>
                                <td>{user[rankKey]}</td>
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

        const activeUsers = usersData.filter(user => user.quizCount > 0);

        return (
            <div className="leaderboardsContainer">
                <div className="searchBar">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={this.state.searchQuery}
                        onChange={this.handleSearch}
                    />
                </div>

                {this.renderLeaderboard(activeUsers, 'Average Score Leaderboard', 'averageScore', 'rankByScore')}
                {this.renderLeaderboard(activeUsers, 'Total Quizzes Taken', 'quizCount', 'rankByQuizzes')}
            </div>
        );
    }
}

export default Leaderboard;
