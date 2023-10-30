import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import { database } from '../../firebase';
import { QuizRepository } from '../repositories/QuizRepository';
import PositionedMenu from './PositionedMenu';

function QuizList({ selectedSubject }) {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const quizRepository = new QuizRepository(database);
    quizRepository.getAllQuizes()
      .then((quizzes) => {
        const filteredQuizzes = quizzes.filter(quiz => quiz.subject === selectedSubject);
        setQuizzes(filteredQuizzes);
      })
      .catch((error) => {
        console.error('Error retrieving quizzes:', error);
      });
  }, [selectedSubject]);

  const handleRowClick = (quiz) => {
    console.log(`Clicked on quiz with ID ${quiz.id}`);
  };

  const quizRepository = new QuizRepository(database);
  const handleDeleteQuiz = (quizId) => {
    quizRepository.deleteQuiz(quizId)
      .then(() => {
        setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz.id !== quizId));
      })
      .catch((error) => {
        console.error('Error deleting quiz:', error);
      });
  };

  return (
    <div
      style={{
        display: 'flex',
        width: '75%',
        margin: '0 auto',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <TableContainer component={Paper} style={{ width: '100%', maxHeight: '75vh', overflow: 'auto' }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '20%' }}>List of Quiz</TableCell>
              <TableCell sx={{ width: '15%' }} align="right">Question&nbsp;(s)</TableCell>
              <TableCell sx={{ width: '15%' }} align="right">Author</TableCell>
              <TableCell sx={{ width: '10%' }} align="right">Time Limit&nbsp;(mn)</TableCell>
              <TableCell sx={{ width: '20%' }} align="right">Date Created</TableCell>
              <TableCell sx={{ width: '10%' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quizzes.map((quiz) => (
              <TableRow key={quiz.id} onClick={() => handleRowClick(quiz)}>
                <TableCell component="th" scope="row">{quiz.title}</TableCell>
                <TableCell align="right">{quiz.question}</TableCell>
                <TableCell align="right">{quiz.author}</TableCell>
                <TableCell align="right">{quiz.time}</TableCell>
                <TableCell align="right">{quiz.creationDate}</TableCell>
                <TableCell align="right">
                  <PositionedMenu onDelete={handleDeleteQuiz} quizId={quiz.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default QuizList;
