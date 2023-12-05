import React from 'react';

// Sample data
const usersData = [
    { id: 1, name: 'Alice', totalQuizzes: 5, averageScore: 80 },
    { id: 2, name: 'Bob', totalQuizzes: 3, averageScore: 70 },
    { id: 3, name: 'Charlie', totalQuizzes: 8, averageScore: 90 },
    // ... add more users as needed
];

class Leaderboard extends React.Component {
    renderLeaderboard(data, title, key) {
        return (
            <div>
                <h2>{title}</h2>
                <table>
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
        // Sort users by totalQuizzes and averageScore respectively
        const byTotalQuizzes = [...usersData].sort((a, b) => b.totalQuizzes - a.totalQuizzes);
        const byAverageScore = [...usersData].sort((a, b) => b.averageScore - a.averageScore);

        return (
            <div>
                {this.renderLeaderboard(byTotalQuizzes, 'Total Quizzes Leaderboard', 'totalQuizzes')}
                {this.renderLeaderboard(byAverageScore, 'Average Score Leaderboard', 'averageScore')}
            </div>
        );
    }
}

export default Leaderboard;
