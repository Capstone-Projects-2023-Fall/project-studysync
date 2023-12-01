export const styles = {
  cardStyle: {
    backgroundColor: "#ffffff", // pure white background for the card
    borderRadius: "8px",
    padding: "10px",
    margin: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.12), 0 6px 20px rgba(0, 0, 0, 0.08)", // enhanced shadow for depth
    transition: "box-shadow 0.3s",
    width: "100%", // take up 80% of the page width
    // maxWidth: "800px", // maximum width of the card
    cursor: "pointer",
    "&:hover": {
      boxShadow:
        "0 8px 16px rgba(0, 0, 0, 0.16), 0 12px 24px rgba(0, 0, 0, 0.12)",
    },
  },
  titleBar: {
    backgroundColor: "#4b9cd3",
    color: "white",
    padding: "5px 10px",
    borderRadius: "4px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  buttonz: {
    borderRadius: "20px",
    textTransform: "none",
    fontWeight: "normal",
    margin: "5px",
  },
  infoText: {
    marginBottom: "10px",
  },
  avatar: {
    marginRight: "10px",
  },
  flexContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1px",
  },
  dialogContent: {
    height: "30rem",
    overflow: "auto",
    width: "30rem",
  },
  listItemHover: {
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      cursor: "pointer",
    },
  },
  leftGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  rightGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  boldText: {
    fontWeight: "bold",
  },
  button: {
    borderRadius: "10px",
    textTransform: "none",
    fontWeight: "bold",
    padding: "8px 16px",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  hoverStyle: {
    boxShadow: "0 8px 15px rgba(128, 90, 213, 0.2)",
  },

  containerStyle: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    minWidth: "400px",
    // padding: "1rem",
  },
  centeredContainerStyle: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
};

export const stylesz = {
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
  },
  formControl: {
    margin: "8px",
    minWidth: "120px",
    border: "1px solid grey",
    borderRadius: "10px",
    width: "20%",
  },
  selectEmpty: {
    marginTop: "16px",
  },
  searchContainer: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "white",
    padding: "8px 16px",
    borderRadius: "20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    width: "50%",
  },
  searchInput: {
    border: "none",
    marginLeft: "8px",
    outline: "none",
    width: "100%",
  },
  searchIcon: {
    color: "rgba(0,0,0,0.54)",
  },
};
