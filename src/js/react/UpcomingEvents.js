import React, { useState, useEffect } from "react";
import EventCardWithDialog from "./EventCard";
import Grid from "@mui/material/Grid";
import { stylesz, styles } from "./Styles";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import SearchIcon from "@mui/icons-material/Search";
import { userRepository } from "../../firebase";
import { useParams } from "react-router-dom";
import { CircularIndeterminate } from "./MySets";

const UpcomingEvents = () => {
  const [filter, setFilter] = useState("Upcoming Events");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { UserId } = useParams();
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSearchChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);

    if (newSearchTerm.trim() === "") {
      setFilteredData(events);
      return;
    }

    const lowercasedSearchTerm = newSearchTerm.toLowerCase();
    const filtered = events.filter((item) => {
      console.log(
        item.name.toLowerCase(),
        lowercasedSearchTerm,
        item.name.toLowerCase().includes(lowercasedSearchTerm)
      );
      return item.name.toLowerCase().includes(lowercasedSearchTerm);
    });

    setFilteredData(filtered);
  };

  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const filtered = events.filter((item) =>
      item.name.toLowerCase().includes(lowercasedSearchTerm)
    );

    setFilteredData(filtered);
  }, [searchTerm, events]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      switch (filter) {
        case "Upcoming Events":
          const upcomingEvents = await userRepository.getUpcomingEvents(UserId);
          setEvents(upcomingEvents);
          break;
        case "Past Events":
          const pastEvents = await userRepository.getPastEvents(UserId);
          setEvents(pastEvents);
          break;
        default:
      }
      return true;
    };
    fetchData().then((res) => {
      console.log("result of fetching data is: ", res);
      setLoading(false);
    });
  }, [filter]);

  const deleteUpcomingEvent = async (id) => {
    await userRepository.removeUpcomingEvent(UserId, id);
    setEvents(events.filter((e) => e.id != id));
    return true;
  };

  return (
    <div style={{ margin: "0 5rem", minWidth: "750px" }}>
      <div style={stylesz.headerContainer}>
        <FormControl style={stylesz.formControl}>
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
            <MenuItem value="Upcoming Events">Upcoming</MenuItem>
            <MenuItem value="Past Events">Past</MenuItem>
          </Select>
        </FormControl>
        <div style={stylesz.searchContainer}>
          <SearchIcon style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search your events"
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

      {!loading && (
        <Grid container>
          {filteredData.map((event, index) => (
            <Grid item xs={5} md={6} lg={4} key={index + 1.5}>
              <EventCardWithDialog
                initialEvent={event}
                onDelete={() => {
                  deleteUpcomingEvent(event.id);
                }}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default UpcomingEvents;
