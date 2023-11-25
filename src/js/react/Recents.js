import { Paper, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import React from "react";

export default function Recents() {
  const recents = [1, 2, 3];
  return (
    <div>
      <h3 style={styles.header}> Recents</h3>
      <div style={styles.containerStyle}>
        {recents.map((item) => (
          <SingleFlashcardSet key={item} />
        ))}
      </div>

      <h3 style={styles.header}>Popular Flashcards</h3>

      <div style={styles.containerStyle}>
        {recents.map((item) => (
          <SingleFlashcardSet key={item} />
        ))}
      </div>

      <h3 style={styles.header}>Upcoming Quizzes</h3>
    </div>
  );
}

export function SingleFlashcardSet() {
  const studyStyle = {
    color: "#007BFF", // Blue color for the text
    cursor: "pointer", // Changes the cursor to a pointer
    textAlign: "right", // Align the text to the right
    paddingRight: "1rem", // Padding on the right for spacing
    marginTop: "0.5rem", // Margin at the top for spacing from the terms
  };

  const handleStudyClick = () => {
    // Implement the logic to open the card for study
    console.log("Study clicked");
  };
  return (
    <Paper
      elevation={3}
      style={styles.cardStyle}
      onMouseOver={(e) =>
        (e.currentTarget.style.boxShadow = styles.hoverStyle.boxShadow)
      }
      onMouseOut={(e) => (e.currentTarget.style.boxShadow = "")}
    >
      <div>
      <Typography variant="heading4" >What do the best college students do?</Typography>
        <Typography variant="body2" style={styles.flashcardInfo}>
          20 terms
        </Typography>
      </div>

      <div style={{display: "flex", alignItems: 'center', gap:"5px"}}>
       
        <Avatar alt={"Michael Jordan"} src={"bankusrc"} />
        <Typography variant="body2" >
          Michael Scott
        </Typography>
      </div>

    </Paper>
  );
}

const styles = {
  termsStyle: {
    backgroundColor: "#E0E0E0", // Grey background
    borderRadius: "15px", // Rounded corners
    width: "30%"
    
  },

  cardStyle: {
    width: "calc(32.333% - 1rem)", // Take one-third of the width minus the gap
    height: "10rem",
    overflow: "auto",
    marginBottom: "1rem", // Add some space at the bottom
    cursor: "pointer", // Changes the cursor to a pointer
    transition: "box-shadow 0.3s ease", // Smooth transition for the shadow
    padding: "0.3rem",
    
    display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between', // Distribute space between child elements
  border: '1px solid #ccc', // Optional: Add a border for visibility
    

  },

  hoverStyle: {
    boxShadow: "0 8px 15px rgba(128, 90, 213, 0.2)", // Light purple shadow at the bottom
  },

  containerStyle: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between", // Distributes space evenly
    padding: "1rem",
  },

  header:{
     paddingLeft: "1rem",
  },

  centerFlex:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#E0E0E0", // Grey background
    borderRadius: "15px", // Rounded corners
    width: "fit-content",
    height: 'fit-content',
    marginTop:'0.5rem'
  },
  flashcardInfo: {
    backgroundColor: "#E0E0E0",
    borderRadius: "15px",
    padding: "0.5rem", // Add some padding to the info for spacing
    width: 'fit-content'
  }
};
