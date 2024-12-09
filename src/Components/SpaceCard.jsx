import "../style/card.css";
import Button from '@mui/material/Button';
import { Card } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState } from 'react';

function SpaceCard(props) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="cardContainer">
      <Card 
        className={`card ${isFlipped ? 'flipped' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="cardInner">
          <div className="cardFront">
            <img src={props.url} alt="APOD" className="cardImage" />
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
          onClick={(e) => { 
            e.stopPropagation(); 
            props.handleClickLike(props.id);
          }}
        >
          {!props.likePics[props.id] 
            ? <FavoriteBorderIcon sx={{ fontSize: 28 }} /> 
            : <FavoriteIcon sx={{ fontSize: 28, color: "red" }} />
          }
        </Button>
      </Card>
    </div>
  );
}

export default SpaceCard;
