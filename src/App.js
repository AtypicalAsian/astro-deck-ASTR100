import './style/App.css';
import React, { useState } from 'react';
import SpaceCard from './Components/SpaceCard';
import { connect } from "react-redux";
import { getApod } from "./actions/actions";
import { updateTimeRange } from "./actions/actions";
import { Grid } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

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
  const [valueStart, setValueStart] = React.useState(new Date("01/01/2022"));
  const [valueEnd, setValueEnd] = React.useState(new Date("01/06/2022"));

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
  return (
    <div>
      {/* <header className="header">
        <div className="bodyTitle">AstroDeck</div>
        <div className="bodySubtitle">Explore NASA's stunning space imagery and facts, one flashcard at a time.</div>
      </header> */}
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
            <Button 
              variant="contained" 
              className="searchButton"
              onClick={handleChangeInterval}
              startIcon={<SearchIcon />}
            >
              Explore Space
            </Button>
          </div>
        </LocalizationProvider>
      </section>
      <section>
        {!loading && props.pictures && props.pictures.length > 0 ? <div className="App">
          <Grid container>
            {props.pictures.map((picture, i) => {
              return (
                <Grid item md={4} sm={12} style={{ padding: "0px 16px" }}>
                  <SpaceCard
                    copyright={picture.copyright}
                    date={picture.date}
                    explanation={picture.explanation}
                    title={picture.title}
                    url={picture.url}
                    id={i}
                    handleClickLike={handleClickLike}
                    likePics={likePics} />
                </Grid>
              )
            })}
          </Grid>
        </div>
          :
          <CircularProgress className="progressLoading" />
        }
      </section>
    </div>
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

