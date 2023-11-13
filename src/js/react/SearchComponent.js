// App.js
import React from 'react';
import { userRepository } from '../../firebase';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';


export const SearchComponent = () => {
   
    const [users, setUsers] = useState([])
    const [data, setData] = useState([])
    useEffect(()=>{
        userRepository.getAllUsers().then((u)=>{
            setUsers(u)
            console.log("users are: ",u)

            const dDog = u.map((user)=>{
                if(user.firstName != null){
                    return user.firstName
                }

                if(user.lastName != null){
                    return user.lastName
                }

                if(user.name != null){
                    return user.name
                }

                if(user.email != null){
                    return user.email
                }
                if(user.id != null){
                    return user.id
                }

               
            })
        })
    
    }, [])




    return <MainComponent data={data} />;
};

const MainComponent = ({ data }) => {
    console.log("MainComponent data is: ", data)
  const [filteredData, setFilteredData] = useState(data || []);

  const handleSearch = (searchTerm) => {
    const filtered = data.filter((item) =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <ul>
        {filteredData.map((item, index) => (
          <li key={index}>{item}</li>
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
    <TextField
      label="Search"
      variant="outlined"
      onChange={handleSearch}
    />
  );
};




