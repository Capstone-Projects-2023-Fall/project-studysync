import { Paper } from "@mui/material";
import React from "react";

export default function Recents() {
  const recents = [1, 2, 3];
  return (
    <div>
      <h1 style={{ paddingLeft: "1rem" }}> Recents</h1>
      <div style={styles.containerStyle}>
        {recents.map((item) => (
          <SingleFlashcardSet key={item} />
        ))}
      </div>

      <h1 style={{ paddingLeft: "1rem" }}>Popular Flashcards</h1>

      <h1 style={{ paddingLeft: "1rem" }}>Upcoming Quizzes</h1>
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
      <h4>What do the best college students do?</h4>
      <div style={styles.termsStyle}>20 terms</div>
    </Paper>
  );
}

const styles = {
  termsStyle: {
    backgroundColor: "#E0E0E0", // Grey background
    borderRadius: "15px", // Rounded corners
    padding: "0.5rem 0.8rem", // Padding inside the container
    display: "inline-block", // Make the div inline-block to fit the content
  },

  cardStyle: {
    width: "calc(33.333% - 1rem)", // Take one-third of the width minus the gap
    height: "10rem",
    overflow: "auto",
    marginBottom: "1rem", // Add some space at the bottom
    cursor: "pointer", // Changes the cursor to a pointer
    transition: "box-shadow 0.3s ease", // Smooth transition for the shadow
    padding: "0.3rem",
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
};
