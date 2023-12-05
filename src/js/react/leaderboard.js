import React, { useState, useEffect } from 'react';
import { database } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const QuizHistory = () => {
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [totalQuizzesTaken, setTotalQuizzesTaken] = useState(0);
  const [averageScore, setAverageScore] = useState(0);

  useEffect(() => {
    const fetchQuizAttempts = async () => {
      const quizAttemptsCollectionRef = collection(database, 'score'); // Adjust if your collection name is different
    

      try {
        const querySnapshot = await getDocs(q);
        const attempts = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          submitDate: doc.data().submitAt.toDate().toLocaleDateString(), // Assuming 'submitAt' is a Firestore Timestamp
          id: doc.id,
        }));

        // Calculate total quizzes taken and average score
        const totalQuizzes = attempts.length;
        const totalScore = attempts.reduce((acc, attempt) => acc + attempt.score, 0);
        const avgScore = totalQuizzes > 0 ? (totalScore / totalQuizzes).toFixed(2) : 0;

        setQuizAttempts(attempts);
        setTotalQuizzesTaken(totalQuizzes);
        setAverageScore(avgScore);
      } catch (error) {
        console.error('Fetching quiz attempts failed:', error);
      }
    };

    fetchQuizAttempts();
  }, [userId]); // Depend on userId to refetch when it changes

  return (
    <div>
      <h2>Leaderboard</h2>
      <div>
        <strong>Total Quizzes Taken:</strong> {totalQuizzesTaken}
      </div>
      <div>
        <strong>Average Score:</strong> {averageScore}%
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Quiz Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {quizAttempts.map((attempt, index) => (
            <tr key={index}>
              <td>{attempt.submitDate}</td>
              <td>{attempt.quizName}</td>
              <td>{attempt.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuizHistory;
