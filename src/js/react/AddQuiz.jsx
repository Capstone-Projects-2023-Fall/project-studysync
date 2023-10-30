import * as React from 'react';
import { useEffect, useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { database } from '../../firebase';
import { QuizRepository } from '../repositories/QuizRepository';
import {Button,TableContainer,Paper,Dialog,DialogTitle,DialogContent,DialogContentText,TextField,DialogActions,Select,MenuItem,} from '@mui/material';

function AddQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [newSubject, setNewSubject] = useState(''); //store new object
  const [quizTitle, setQuizTitle] = useState('');
  const [numQuestions, setNumQuestions] = useState(0);
  const [dialogStep, setDialogStep] = useState(1); //check step of the daiologs 
  const [open, setOpen] = useState(false);

  useEffect(() => {
    //instance for quiz repo
    const quizRepository = new QuizRepository(database);

    //function to get quizeees
    quizRepository.getAllQuizes()
      .then((quizzes) => {
        //update the state with the retrieved quizzes
        setQuizzes(quizzes);
      })
      .catch((error) => {
        console.error('Error retrieving quizzes:', error);
      });
    },
     []
  );

  //getr subject 
  const uniqueSubjects = [...new Set(quizzes.map((quiz) => quiz.subject))]; 

  const handleAddQuizSubject = () => {
    if (selectedSubject || (dialogStep === 1 && newSubject)) {
      setDialogStep(2); //move to the next dialog}
    };

  const handleAddQuiz = () => {
    if (quizTitle && numQuestions > 0) {
      const quizzesCollection = collection(database, 'quizzes');
      let subjectToAdd = dialogStep === 1 ? newSubject : selectedSubject;
      if (subjectToAdd === 'custom') {
        subjectToAdd = newSubject;
      }
  
      //capture the current date
      const currentDate = new Date();
  
      addDoc(quizzesCollection, {
        subject: subjectToAdd,
        title: quizTitle,
        question: numQuestions,
        dateCreated: currentDate, 
      }
      )
        .then((quizDocRef) => {
          console.log('Quiz added with ID: ', quizDocRef.id);
          setNewSubject(''); //clear the new subject input
          setSelectedSubject(''); //clear the selected subject
          setQuizTitle('');
          setNumQuestions('');
          setDialogStep(1); //reset the dialog step
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
        {/* constrcution fo thable*/}
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
              //subject selection step
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
                  <MenuItem value="custom">Add New Subject</MenuItem> {/*custom Subject option */}
                </Select>
                {selectedSubject === 'custom' && ( //display new subject input when Custom Subject is selected
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
                      setNewSubject(''); //clear the new subject input
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
              //quiz details step
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
}
export default AddQuiz;
