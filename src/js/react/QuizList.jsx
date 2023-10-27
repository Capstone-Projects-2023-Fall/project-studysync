import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack'; // Added Stack component
import Button from '@mui/material/Button';

import { useEffect, useState } from 'react';
import { database } from '../../firebase'; // Import your Firebase configuration
import { QuizRepository } from '../repositories/QuizRepository'; // Import your QuizRepository class

// Import the PositionedMenu component
import PositionedMenu from './PositionedMenu';

function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    // Create an instance of QuizRepository
    const quizRepository = new QuizRepository(database);

    // Call the getAllQuizes function to retrieve the quizzes
    quizRepository
      .getAllQuizes()
      .then((quizzes) => {
        quizzes.forEach((quiz) => {
          if (quiz.dateCreated) {
            const timestamp = quiz.dateCreated.toDate(); // Convert Firestore timestamp to Date
            quiz.creationDate = timestamp.toLocaleString(); // Convert to a string
          } else {
            quiz.creationDate = '';
          }
        });
        setQuizzes(quizzes);
      })
      .catch((error) => {
        console.error('Error retrieving quizzes:', error);
      });
  }, []);

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
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
    '&:hover': {
      cursor: 'pointer',
    },
    // Define CSS transition properties
    transition: 'background-color 0.3s ease',
  }));

  const handleRowClick = (quiz) => {
    // Handle the click on a row, e.g., show more details or navigate to a new page
    console.log(`Clicked on quiz with ID ${quiz.id}`);
    console.log(`Quiz Date ${quiz.dateCreated}`);
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
              <StyledTableCell sx={{ width: '20%' }} align="right">
                Question&nbsp;(s)
              </StyledTableCell>
              <StyledTableCell sx={{ width: '20%' }} align="right">
                Author
              </StyledTableCell>
              <StyledTableCell sx={{ width: '20%' }} align="right">
                Date Created
              </StyledTableCell>
              <StyledTableCell sx={{ width: '20%' }} align="right">
                Actions
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quizzes.map((quiz) => (
              <StyledTableRow
                key={quiz.id}
                onClick={() => handleRowClick(quiz)}
                style={{
                  backgroundColor: selectedRow === quiz.id ? '#333' : 'transparent',
                }}
              >
                <StyledTableCell component="th" scope="row">
                  {quiz.title}
                </StyledTableCell>
                <StyledTableCell align="right">{quiz.question}</StyledTableCell>
                <StyledTableCell align="right">{quiz.author}</StyledTableCell>
                <StyledTableCell align="right">
                {quiz.creationDate}
                </StyledTableCell>
                <StyledTableCell align="right">
                  <PositionedMenu /> {/* Add the PositionedMenu component */}
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
