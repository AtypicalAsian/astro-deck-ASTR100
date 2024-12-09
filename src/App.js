import './style/App.css';
import React, { useState } from 'react';
import SpaceCard from './Components/Tiles';
import { connect } from "react-redux";
import { getApod } from "./actions/query";
import { updateTimeRange } from "./actions/query";
import { Grid, TextField } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { ThemeProvider, createTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import InputAdornment from '@mui/material/InputAdornment';

const AppTitle = () => (
  <div className="titleContainer">
    <h1 className="mainTitle">
      <span className="titleSpan">Astro</span>
      <span className="titleSpan">Deck</span>
    </h1>
    <p className="titleDescription">Discover the wonders of our universe, one flash card at a time</p>
  </div>
);

function App({ pictures, reload, getApod, updateTimeRange }) {
  const [favoriteStates, setFavoriteStates] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(new Date("10/16/2023"));
  const [endDate, setEndDate] = useState(new Date("10/24/2023"));
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFavoritesView, setIsFavoritesView] = useState(false);

  const theme = React.useMemo(
    () => createTheme({
      palette: { mode: isDarkMode ? 'dark' : 'light' },
    }),
    [isDarkMode]
  );

  const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date);
  };

  React.useEffect(() => {
    getApod();
    if (pictures?.length > 0) {
      const initialFavorites = Object.fromEntries(
        pictures.map((_, index) => [index, false])
      );
      setFavoriteStates(initialFavorites);
    }
    setIsLoading(false);
  }, [reload, pictures, getApod]);

  const toggleFavorite = (key) => {
    setFavoriteStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const validateDateRange = () => {
    const currentDate = new Date();
    const minDate = new Date("09/01/2021");

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      alert("Start Date or End Date is invalid!");
      return false;
    }
    if (startDate > endDate) {
      alert("Start Date is greater than End Date");
      return false;
    }
    if (startDate < minDate || startDate > currentDate) {
      alert("Start Date is out of range");
      return false;
    }
    if (endDate < minDate || endDate > currentDate) {
      alert("End Date is out of range");
      return false;
    }
    return true;
  };

  const handleSearch = () => {
    if (!validateDateRange()) return;
    
    const formatDate = (date) => {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    };

    setIsLoading(true);
    updateTimeRange(formatDate(startDate), formatDate(endDate));
  };

  // Filtered pictures logic
  const filteredPictures = React.useMemo(() => {
    const filtered = pictures?.filter(picture => 
      picture?.explanation?.toLowerCase().includes(searchQuery.toLowerCase())
    ) ?? [];
    
    return isFavoritesView
      ? filtered.filter(picture => {
          const favorites = JSON.parse(localStorage.getItem('favorites')) || {};
          return favorites[picture.date];
        })
      : filtered;
  }, [pictures, searchQuery, isFavoritesView]);

  return (
    <ThemeProvider theme={theme}>
      <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="theme-toggle">
          <IconButton onClick={() => setIsDarkMode(!isDarkMode)} color="inherit">
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </div>
        <section className="searchSection">
          <AppTitle />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className="searchContainer">
              <div className="dateInputs">
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} className="datePicker" />
                  )}
                />
                <div className="dateArrow">→</div>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} className="datePicker" />
                  )}
                />
              </div>
              <TextField
                className="filterInput"
                fullWidth
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Try 'galaxy' or 'nebula'..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon className="searchIcon" />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
              <div className="buttonContainer">
                <Button 
                  variant="contained" 
                  className="searchButton"
                  onClick={handleSearch}
                  startIcon={<SearchIcon />}
                >
                  Explore
                </Button>
              </div>
            </div>
          </LocalizationProvider>
        </section>
        <section>
          {!isLoading && filteredPictures.length > 0 ? (
            <div className="App">
              <Button 
                variant="contained" 
                onClick={() => setIsFavoritesView(!isFavoritesView)}
              >
                {isFavoritesView ? "Show All Images" : "Show Favorites"}
              </Button>

              <Grid container>
                {filteredPictures.map((picture, i) => (
                  <Grid item md={4} sm={12} style={{ padding: "0px 16px" }} key={i}>
                    <SpaceCard
                      copyright={picture.copyright}
                      date={picture.date}
                      explanation={picture.explanation}
                      title={picture.title}
                      url={picture.url}
                      id={i}
                      handleClickLike={toggleFavorite}
                      likePics={favoriteStates}
                    />
                  </Grid>
                ))}
              </Grid>
            </div>
          ) : (
            <CircularProgress className="progressLoading" />
          )}
        </section>
      </div>
    </ThemeProvider>
  );
}

const mapStateToProps = ({ pictures }) => {
  return {
    pictures: pictures.pictures,
    reload: pictures.reload,
  };
};

const mapDispatchToProps = {
  getApod,
  updateTimeRange,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

