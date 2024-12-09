import './style/App.css';
import React, { useState } from 'react';
import SpaceCard from './Components/SpaceCard';
import { connect } from "react-redux";
import { getApod } from "./actions/actions";
import { updateTimeRange } from "./actions/actions";
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

const AnimatedTitle = () => (
  <div className="titleContainer">
    <h1 className="mainTitle">
      <span className="titleSpan">Astro</span>
      <span className="titleSpan">Deck</span>
    </h1>
    <p className="titleDescription">Discover the wonders of our universe, one flash card at a time</p>
  </div>
);

function App(props) {
  const [likePics, setLikePics] = useState({});
  const [loading, setLoading] = useState(false);
  const [valueStart, setValueStart] = React.useState(new Date("10/16/2023"));
  const [valueEnd, setValueEnd] = React.useState(new Date("10/24/2023"));
  const [darkMode, setDarkMode] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);

  // Create theme based on dark mode state
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
        },
      }),
    [darkMode]
  );

  React.useEffect(() => {

    props.getApod();
    if (props.pictures && props.pictures.length > 0) {
      props.pictures.map((picture, i) => {
        return likePics[i] = false;
      })
    }
    setLikePics({ ...likePics });
  }, [props.reload]);

  React.useEffect(() => {
    setLoading(false);
  }, [props.pictures])


  React.useEffect(() => {
    props.getApod();
    if (props.pictures && props.pictures.length > 0) {
      props.pictures.map((picture, i) => {
        return likePics[i] = false;
      })
    }
    setLikePics({ ...likePics });
  }, [props.reload]);

  React.useEffect(() => {
    setLoading(false);
  }, [props.pictures])

  const handleClickLike = (key) => {
    likePics[key] = !likePics[key];
    setLikePics({ ...likePics });
  }

  //util function to check  valid Date
  const isValidDate = (d) => {
    return d instanceof Date && !isNaN(d);
  }

  const handleChangeInterval = () => {
    if (!isValidDate(valueStart) || !isValidDate(valueEnd)) {
      alert("Start Date or End Date is invalid!");
      return;
    }
    else if (valueStart > valueEnd) {
      alert("Start Date is greater than End Date");
      return;
    }
    else if (valueStart < new Date("09/01/2021") || valueStart > new Date()) {
      alert("Start Date is out of range");
      return;
    }
    else if (valueEnd < new Date("09/01/2021") || valueEnd > new Date()) {
      alert("End Date is out of range");
      return;
    }
    const startDate = String(valueStart.getFullYear()) + '-' + String(valueStart.getMonth() + 1) + '-' + String(valueStart.getDate());
    const endDate = String(valueEnd.getFullYear()) + '-' + String(valueEnd.getMonth() + 1) + '-' + String(valueEnd.getDate());
    props.updateTimeRange(startDate, endDate);
    setLoading(true);
  }

  const filteredPictures = props.pictures ? props.pictures.filter(picture => 
    picture.explanation.toLowerCase().includes(filterText.toLowerCase())
  ) : [];

  // Filter images based on favorite status
  const displayedPictures = showFavorites
    ? props.pictures.filter((picture, i) => {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || {};
        return favorites[i];
      })
    : props.pictures;

  return (
    <ThemeProvider theme={theme}>
      <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
        <div className="theme-toggle">
          <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </div>
        <section className="searchSection">
          <AnimatedTitle />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className="searchContainer">
              <div className="dateInputs">
                <DatePicker
                  label="Start Date"
                  value={valueStart}
                  onChange={(newValue) => setValueStart(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} className="datePicker" />
                  )}
                />
                <div className="dateArrow">→</div>
                <DatePicker
                  label="End Date"
                  value={valueEnd}
                  onChange={(newValue) => setValueEnd(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} className="datePicker" />
                  )}
                />
              </div>
              <TextField
                className="filterInput"
                fullWidth
                variant="outlined"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
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
                  onClick={handleChangeInterval}
                  startIcon={<SearchIcon />}
                >
                  Explore
                </Button>
              </div>
            </div>
          </LocalizationProvider>
        </section>
        <section>
          {!loading && filteredPictures.length > 0 ? (
            <div className="App">
              <Button 
                variant="contained" 
                onClick={() => setShowFavorites(!showFavorites)}
              >
                {showFavorites ? "Show All Images" : "Show Favorites"}
              </Button>

              <Grid container>
                {displayedPictures.map((picture, i) => (
                  <Grid item md={4} sm={12} style={{ padding: "0px 16px" }} key={i}>
                    <SpaceCard
                      copyright={picture.copyright}
                      date={picture.date}
                      explanation={picture.explanation}
                      title={picture.title}
                      url={picture.url}
                      id={i}
                      handleClickLike={handleClickLike}
                      likePics={likePics}
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

