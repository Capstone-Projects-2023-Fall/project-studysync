import { TextField } from "@mui/material";
const SearchBar = ({ onSearch, width }) => {
  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    onSearch(searchTerm);
  };

  return (
    <TextField
      label="Search"
      variant="outlined"
      onChange={handleSearch}
      sx={{ width: width }}
    />
  );
};

export default SearchBar;
