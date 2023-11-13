// App.js
import React from "react";
import { userRepository } from "../../firebase";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import SingleUserComponent from "./SingleUserComponent";

export const SearchComponent = () => {};

export const MainComponent = ({ data }) => {
  const [filteredData, setFilteredData] = useState(data || []);

  const handleSearch = (searchTerm) => {
    const filtered = data.filter((item) => {
      if (item.name != null) {
        return item.toLowerCase().includes(searchTerm.toLowerCase());
      }
    });
    setFilteredData(filtered);
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <ul>
        {filteredData.map((item, index) => (
          //   <li key={index}>{item}</li>
          // <SingleUserComponent key={index} />
          <></>
        ))}
      </ul>
    </div>
  );
};

const SearchBar = ({ onSearch }) => {
  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    onSearch(searchTerm);
  };

  return (
    <TextField label="Search" variant="outlined" onChange={handleSearch} />
  );
};
