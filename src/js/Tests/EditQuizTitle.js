import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from '@mui/material';

function EditQuizDialog({
  isOpen,
  handleClose,
  initialQuizTitle,
  onEditQuizTitle,
}) {
  const [editedTitle, setEditedTitle] = useState('');

  useEffect(() => {
    setEditedTitle(initialQuizTitle);
  }, [initialQuizTitle]);

  const handleSave = () => {
    onEditQuizTitle(editedTitle.trim());
    handleClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Edit Quiz Title</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Enter a New Quiz Title"
          fullWidth
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditQuizDialog;
