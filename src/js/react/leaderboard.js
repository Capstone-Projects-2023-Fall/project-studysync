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
            this.setState({ usersData: usersWithScoresAndQuizzes, isLoading: false });
        } catch (error) {
            console.error("Error fetching users and quizzes: ", error);
            this.setState({ error, isLoading: false });
        }
    }

    handleSearch = (event) => {
        this.setState({ searchQuery: event.target.value });
    }


    renderLeaderboard(data, title, key) {
        let rank = 0; 
        const filteredData = data.filter(user => user.name.toLowerCase().includes(this.state.searchQuery.toLowerCase()));
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
                            <td>{++rank}</td>
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
        let rank = 0;
        const filteredData = data.filter(user => user.name.toLowerCase().includes(this.state.searchQuery.toLowerCase()));
        return (
            <div className="leaderboardSection">
                <h2>Total Quizzes Taken</h2>
                <table className="leaderboardTable">
                    <thead>
                        <tr>
                            <th>Rank</th> 
                            <th>Name</th>
                            <th>Quizzes Taken</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map(user => (
                            <tr key={user.id}>
                                <td>{++rank}</td>
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

        const activeUsers = usersData.filter(user => user.quizCount > 0);
        const sortedUsersByScore = [...activeUsers].sort((a, b) => parseFloat(b.averageScore) - parseFloat(a.averageScore));
        const sortedUsersByQuizzes = [...activeUsers].sort((a, b) => b.quizCount - a.quizCount);


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
                
                {this.renderLeaderboard(sortedUsersByScore, 'Average Score Leaderboard', 'averageScore')}
                {this.renderTotalQuizzesLeaderboard(sortedUsersByQuizzes)}
            </div>
        );
    }
}

export default Leaderboard;