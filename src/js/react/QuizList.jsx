import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { QuizRepository } from '../repositories/QuizRepository';
import { database } from '../../firebase';
import PositionedMenu from './PositionedMenu';
import { useEffect, useState } from 'react';

function QuizList({ quizzes, fetchData }) {

  const [newQuiz, setQuizzes] = useState([]);
  
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
    '&:hover': {
      cursor: 'pointer',
    },
    transition: 'background-color 0.3s ease',
  }));

  const handleRowClick = (quiz) => {
    console.log(`Clicked on quiz with ID ${quiz.id}`);
    console.log(`Quiz Date ${quiz.dateCreated}`);
  };

  const quizRepository = new QuizRepository(database);

  const handleDeleteQuiz = (quizId) => {
    quizRepository
      .deleteQuiz(quizId)
      .then(() => {
        // Remove the deleted quiz from the state
        // Assuming that the `quizzes` prop is not modified directly, you can filter it
        const updatedQuizzes = quizzes.filter((quiz) => quiz.id !== quizId);
        // Update the parent component's state using a callback
        fetchData();
      })
      .catch((error) => {
        console.error('Error deleting quiz:', error);
      });
  };

  return (
    <div
      style={{
        display: 'flex',
        maxWidth: '50%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ width: '20%' }}>List of Quiz</StyledTableCell>
              <StyledTableCell sx={{ width: '15%' }} align="right">
                Question&nbsp;(s)
              </StyledTableCell>
              <StyledTableCell sx={{ width: '15%' }} align="right">
                Author
              </StyledTableCell>
              <StyledTableCell sx={{ width: '10%' }} align="right">
                Time Limit&nbsp;(mn)
              </StyledTableCell>
              <StyledTableCell sx={{ width: '20%' }} align="right">
                Date Created
              </StyledTableCell>
              <StyledTableCell sx={{ width: '10%' }} align="right">
                Actions
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quizzes.map((quiz) => (
              <StyledTableRow
                key={quiz.id}
                onClick={() => handleRowClick(quiz)}
              >
                <StyledTableCell component="th" scope="row">
                  {quiz.title}
                </StyledTableCell>
                <StyledTableCell align="right">{quiz.question}</StyledTableCell>
                <StyledTableCell align="right">{quiz.author}</StyledTableCell>
                <StyledTableCell align="right">{quiz.time}</StyledTableCell>
                <StyledTableCell align="right">{quiz.creationDate}</StyledTableCell>
                <StyledTableCell align="right">
                  <PositionedMenu onDelete={() => handleDeleteQuiz(quiz.id)} quizId={quiz.id} />
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default QuizList;
