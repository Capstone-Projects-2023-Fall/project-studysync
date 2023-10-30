import * as React from 'react';
import { useEffect, useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { database } from '../../firebase';
import { QuizRepository } from '../repositories/QuizRepository';
import {
  Button,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Select,
  MenuItem,
} from '@mui/material';

function AddQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [newSubject, setNewSubject] = useState(''); // To store the new subject
  const [quizTitle, setQuizTitle] = useState('');
  const [numQuestions, setNumQuestions] = useState(0);
  const [dialogStep, setDialogStep] = useState(1); // Track the step of the dialog
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Create an instance of QuizRepository
    const quizRepository = new QuizRepository(database);

    // Call the getAllQuizes function to retrieve the quizzes
    quizRepository.getAllQuizes()
      .then((quizzes) => {
        // Update the state with the retrieved quizzes
        setQuizzes(quizzes);
      })
      .catch((error) => {
        console.error('Error retrieving quizzes:', error);
      });
  }, []);

  // Extract unique subjects
  const uniqueSubjects = [...new Set(quizzes.map((quiz) => quiz.subject))]; 

  const handleAddQuizSubject = () => {
    if (selectedSubject || (dialogStep === 1 && newSubject)) {
      setDialogStep(2); // Move to the next step
    }
  };

  const handleAddQuiz = () => {
    if (quizTitle && numQuestions > 0) {
      const quizzesCollection = collection(database, 'quizzes');
      let subjectToAdd = dialogStep === 1 ? newSubject : selectedSubject;
      
      if (subjectToAdd === 'custom') {
        subjectToAdd = newSubject;
      }
  
      // Capture the current date
      const currentDate = new Date();
  
      addDoc(quizzesCollection, {
        subject: subjectToAdd,
        title: quizTitle,
        question: numQuestions,
        dateCreated: currentDate, // Insert the current date
      })
        .then((quizDocRef) => {
          console.log('Quiz added with ID: ', quizDocRef.id);
          setNewSubject(''); // Clear the new subject input
          setSelectedSubject(''); // Clear the selected subject
          setQuizTitle('');
          setNumQuestions('');
          setDialogStep(1); // Reset the dialog step
          setOpen(false);
        })
        .catch((error) => {
          console.error('Error adding quiz: ', error);
        });
    }
  };

  return (
    <div>
       <div
      style={{
        display: 'flex',
        maxWidth: '50%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <TableContainer component={Paper} style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {/* ... Table structure */}
      </TableContainer>
    </div>

      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setOpen(true);
          }}
        >
          Add Quiz
        </Button>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>
            {dialogStep === 1
              ? 'Add a New Subject'
              : 'Add Quiz Details'
            }
          </DialogTitle>
          <DialogContent>
            {dialogStep === 1 ? (
              // Subject selection step
              <div>
                <DialogContentText>
                  Please select the subject for the new quiz or add a new subject:
                </DialogContentText>
                <Select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  fullWidth
                >
                  {uniqueSubjects.map((subject) => (
                    <MenuItem key={subject} value={subject}>
                      {subject}
                    </MenuItem>
                  ))}
                  <MenuItem value="custom">Add New Subject</MenuItem> {/* Custom Subject option */}
                </Select>
                {selectedSubject === 'custom' && ( // Display new subject input when Custom Subject is selected
                  <TextField
                    margin="dense"
                    label="New Subject"
                    type="text"
                    fullWidth
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                  />
                )}
                <DialogActions>
                  <Button
                    onClick={() => {
                      setOpen(false);
                      setSelectedSubject('');
                      setNewSubject(''); // Clear the new subject input
                      setQuizTitle('');
                      setNumQuestions('');
                    }}
                    color="primary"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddQuizSubject} color="primary">
                    Next
                  </Button>
                </DialogActions>
              </div>
            ) : (
              // Quiz details step
              <div>
                <DialogContentText>
                  Please enter the quiz title and number of questions:
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Quiz Title"
                  type="text"
                  fullWidth
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                />
                <TextField
                  margin="dense"
                  label="Number of Questions"
                  type="number"
                  fullWidth
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                />
                <DialogActions>
                  <Button onClick={() => setDialogStep(1)} color="primary">
                    Previous
                  </Button>
                  <Button onClick={handleAddQuiz} color="primary">
                    Add
                  </Button>
                </DialogActions>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default AddQuiz;