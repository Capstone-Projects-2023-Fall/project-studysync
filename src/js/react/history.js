import React, { useEffect, useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

const QuizHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Replace with the actual API call
    fetch('/api/quiz-history')
      .then(response => response.json())
      .then(data => setHistory(data))
      .catch(error => console.error('Error fetching quiz history:', error));
  }, []);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell>Quiz ID</TableCell>
          <TableCell>Score</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {history.map((record, index) => (
          <TableRow key={index}>
            <TableCell>{record.attemptDate}</TableCell>
            <TableCell>{record.quizId}</TableCell>
            <TableCell>{record.score}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default QuizHistory;
