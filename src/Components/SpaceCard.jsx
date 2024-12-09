import "../style/card.css";
import { Card, Button } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState, useEffect } from 'react';

function SpaceCard(props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || {};
    setIsFavorite(favorites[props.id] || false);
  }, [props.id]);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    const favorites = JSON.parse(localStorage.getItem('favorites')) || {};
    favorites[props.id] = !isFavorite;
    localStorage.setItem('favorites', JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="cardContainer">
      <Card 
        className={`card ${isFlipped ? 'flipped' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="cardInner">
          <div className="cardFront">
            <div className="imageContainer">
              <img 
                src={props.url} 
                alt="APOD" 
                className="cardImage" 
              />
            </div>
          </div>
          
          <div className="cardBack">
            <div className="cardContent">
              <h2 className="title">{props.title}</h2>
              <div className="date">{props.date}</div>
              <p className="explanation">{props.explanation}</p>
              {props.copyright && (
                <div className="copyright">© {props.copyright}</div>
              )}
            </div>
          </div>
        </div>

        <Button 
          className="like" 
          onClick={toggleFavorite}
        >
          {isFavorite 
            ? <FavoriteIcon className="likeIcon" /> 
            : <FavoriteBorderIcon className="likeIcon" />
          }
        </Button>
      </Card>
    </div>
  );
}

export default SpaceCard;
