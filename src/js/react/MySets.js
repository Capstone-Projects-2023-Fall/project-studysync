import SearchIcon from "@mui/icons-material/Search";
import React from "react";
import { useEffect, useState } from "react";
import { userRepository } from "../../firebase";
import { useParams } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FlashCardSet from "./FlashcardSet";
import EmptySetCompponent from "./EmptySet";
import { styles, stylesz } from "./Styles";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export function CircularIndeterminate() {
  return (
    <Box sx={{ display: "flex" }}>
      <CircularProgress />
    </Box>
  );
}

export default function MySets() {
  const { UserId } = useParams();

  const [users, setUsers] = useState([]);
  const [selectedFlashcardId, setSelectedFlashcardId] = useState(null);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [filter, setFilter] = useState("My Flashcards");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [currentData, setCurrentData] = useState([]);
  const [filteredData, setFilteredData] = useState(currentData);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  //   const handleSearchChange = (event) => {
  //     setSearchTerm(event.target.value);

  //     const filtered = currentData.filter((item) => {
  //       if (item.name != null) {
  //         return item.name.toLowerCase().includes(searchTerm.toLowerCase());
  //       }
  //       if (item.quizName != null) {
  //         console.log("hereee");
  //         return item.quizName.toLowerCase().includes(searchTerm.toLowerCase());
  //       }
  //     });
  //     console.log("filtered from banche is: ", filteredData);
  //   };

  const handleSearchChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);

    if (newSearchTerm.trim() === "") {
      setFilteredData(currentData); // No search term, show all data
      return;
    }

    const lowercasedSearchTerm = newSearchTerm.toLowerCase();
    const filtered = currentData.filter((item) => {
      const itemName = item.name ? item.name.toLowerCase() : "";
      const itemQuizName = item.quizName ? item.quizName.toLowerCase() : "";

      return (
        itemName.includes(lowercasedSearchTerm) ||
        itemQuizName.includes(lowercasedSearchTerm)
      );
    });

    setFilteredData(filtered);
  };

  const handleShareClick = (id, isFlashcard) => {
    if (isFlashcard) {
      setSelectedFlashcardId(id);
      return;
    }
    setSelectedQuizId(id);
  };

  const handleShare = (selectedId, selectedUsers, isFlashcard) => {
    if (isFlashcard) {
      for (const u of selectedUsers) {
        userRepository
          .shareFlashcard(UserId, u, selectedId)
          .then((res) => {
            console.log("Share Flashcard Success: ", res);
          })
          .catch((err) => {
            console.log("Share Flashcard Failure: ", err);
          });
      }
      setSelectedFlashcardId(null);
      return;
    }

    for (const u of selectedUsers) {
      userRepository
        .shareQuiz(UserId, u, selectedId)
        .then((res) => {
          console.log("Share Quiz Success: ", res);
        })
        .catch((err) => {
          console.log("Share Quiz Failure: ", err);
        });
    }
    setSelectedQuizId(null);
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredData(currentData);
    } else {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const filtered = currentData.filter((item) => {
        const itemName = item.name ? item.name.toLowerCase() : "";
        const itemQuizName = item.quizName ? item.quizName.toLowerCase() : "";

        return (
          itemName.includes(lowercasedSearchTerm) ||
          itemQuizName.includes(lowercasedSearchTerm)
        );
      });

      setFilteredData(filtered);
    }
  }, [currentData, searchTerm]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        switch (filter) {
          case "My Flashcards":
            const res1 = await userRepository.getOwnedFlashcards(UserId);
            setCurrentData(res1);
            setFilteredData(res1);
            break;
          case "My Quizzes":
            const res2 = await userRepository.getOwnedQuizzes(UserId);
            setCurrentData(res2);
            setFilteredData(res2);
            break;
          case "Shared Quizzes":
            const res3 = await userRepository.getSharedQuizzes(UserId);
            setCurrentData(res3);
            setFilteredData(res3);
            break;
          case "Shared Flashcards":
            const res4 = await userRepository.getSharedFlashcards(UserId);
            setCurrentData(res4);
            setFilteredData(res4);
            break;
          default:
        }
        return true;
      } catch (error) {
        setCurrentData([]);
        throw new Error("error: ", error);
      }
    };

    fetchData()
      .then(() => {
        console.log("Set loading to false");
        setLoading(false);
      })
      .catch((error) => {
        console.log("error while fetching data");
        console.error(error);
      });
    userRepository.getAllUsers().then((res) => setUsers(res));
  }, [filter]);

  return (
    <div style={{ margin: "0 10rem" }}>
      <div style={stylesz.headerContainer}>
        <FormControl style={stylesz.formControl}>
          {/* The InputLabel is removed since you don't want "Filter" to show up */}
          <Select
            displayEmpty
            value={filter}
            onChange={handleFilterChange}
            style={stylesz.select}
            renderValue={
              filter !== ""
                ? undefined
                : () => <span style={{ color: "grey" }}>Recent</span>
            }
            sx={{
              ".MuiSelect-select": {
                padding: "8px 24px 8px 12px",
              },
              ".MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "& .MuiSvgIcon-root": {
                color: "rgba(0, 0, 0, 0.54)",
              },
              backgroundColor: "white",
              borderRadius: "8px",
            }}
          >
            <MenuItem value="My Flashcards">My Flashcards</MenuItem>
            <MenuItem value="My Quizzes">My Quizzes</MenuItem>
            <MenuItem value="Shared Flashcards">Shared Flashcards</MenuItem>
            <MenuItem value="Shared Quizzes">Shared Quizzes</MenuItem>
          </Select>
        </FormControl>
        <div style={stylesz.searchContainer}>
          <SearchIcon style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search your sets"
            style={stylesz.searchInput}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {loading && (
        <div style={styles.centeredContainerStyle}>
          <CircularIndeterminate />
        </div>
      )}

      {currentData.length == 0 && (
        <div style={styles.centeredContainerStyle}>
          {filter.toLowerCase().includes("shared flashcards") && (
            <EmptySetCompponent isShared={true} userId={UserId} />
          )}
          {filter.toLowerCase().includes("shared quizzes") && (
            <EmptySetCompponent isQuiz={true} isShared={true} userId={UserId} />
          )}
          {filter.toLowerCase().includes("my flashcards") && (
            <EmptySetCompponent isShared={false} />
          )}
          {filter.toLowerCase().includes("my quizzes") && (
            <EmptySetCompponent isShared={false} isQuiz={true} />
          )}
        </div>
      )}

      {!loading && (
        <>
          <div>
            {filteredData.map((item) => {
              let title = "";
              let terms = "";
              let isFlashcard = true;

              if (filter.toLowerCase().includes("quiz")) {
                title = item.quizName;
                terms = item.questionItems
                  ? `${Object.keys(item.questionItems).length} questions`
                  : "";
                isFlashcard = false;
              } else {
                title = item.name;
                terms = item.flashcardItems
                  ? `${Object.keys(item.flashcardItems).length} terms`
                  : "";
              }

              return (
                <FlashCardSet
                  key={item.id}
                  item={item}
                  author={item.author.name}
                  imageURL={item.author.imageURL}
                  title={title}
                  terms={terms}
                  users={users}
                  quizId={item.id}
                  flashcardId={item.id}
                  onShareClick={() => handleShareClick(item.id, isFlashcard)}
                  onShare={(selectedUsers) =>
                    handleShare(item.id, selectedUsers, isFlashcard)
                  }
                  authorId={item.authorId}
                  isFlashcard={isFlashcard}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
