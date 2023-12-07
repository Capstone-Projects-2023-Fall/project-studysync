import React from "react";

import empty from "../../empty.png";
import { useNavigate } from "react-router-dom";

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
    fontFamily: '"Arial", sans-serif',
  },
  header: {
    color: "#333",
    fontWeight: "bold",
    fontSize: "24px",
    marginBottom: "10px",
  },
  subtext: {
    color: "#666",
    fontSize: "18px",
    marginBottom: "20px",
  },
  button: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "white",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "5px",
    padding: "10px 20px",
    cursor: "pointer",
    outline: "none",
  },
};

function EmptySetCompponent({ isQuiz, isShared, userId }) {
  const word = isQuiz ? "quizzes" : "flashcard sets";
  const buttonText = isShared === true ? "Find Friends" : "Create a set";
  const path = isShared === true ? `/socials/${userId}` : `/flashcard`;
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <img
        src={empty}
        alt="Study Set Placeholder"
        style={{ maxWidth: "100%", height: "auto" }}
      />
      {isShared === false && (
        <>
          <p style={styles.header}>You haven't created any {word} yet</p>
          <p style={styles.subtext}>
            Create a study set on anything you need to study
          </p>
        </>
      )}

      {isShared === true && (
        <>
          <p style={styles.header}>You have no shared {word} at the moment</p>
          <p style={styles.subtext}>
            Add more friends if you want more shared sets!
          </p>
        </>
      )}

      <button
        style={styles.button}
        onClick={() => {
          console.log("Set creation flow triggered");
          navigate(path);
        }}
      >
        {buttonText}
      </button>
    </div>
  );
}

export default EmptySetCompponent;