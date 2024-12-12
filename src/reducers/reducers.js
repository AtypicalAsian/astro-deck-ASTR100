const initialState = {
  loading: true,
  error: "",
  pictures: [],
  //default url
  urlGetApod: `https://api.nasa.gov/planetary/apod?start_date=2023-10-16&end_date=2023-10-24&api_key=g559bl02QPk9uTl6FX3KHshJaZZ9bg72EgHJYPVT`, 
  reload: false,
};

const pictures = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_APOD":
      return {
        ...state,
        loading: false,
        pictures: action.payload.data
      };
    case "UPDATE_RANGE":
      return {
        ...state,
        urlGetApod: `https://api.nasa.gov/planetary/apod?start_date=${action.payload.startDate}&end_date=${action.payload.endDate}&api_key=g559bl02QPk9uTl6FX3KHshJaZZ9bg72EgHJYPVT`,
        reload: !state.reload,
      };
    default:
      return state;
  }
};

export default pictures;