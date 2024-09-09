import "./LikeContainer.css";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { useEffect } from "react";

const LikeContainer = ({ photo, user, handleLike }) => {
  return (
    <div className="like-container">
      {photo.likes && photo.likes.includes(user._id) ? (
        // Se o usuário já curtiu a foto, mostrar botão de "Descurtir"
        <button onClick={() => handleLike(photo)}>
          <i className="fas fa-heart"></i> Descurtir
        </button>
      ) : (
        // Se o usuário ainda não curtiu a foto, mostrar botão de "Curtir"
        <button onClick={() => handleLike(photo)}>
          <i className="far fa-heart"></i> Curtir
        </button>
      )}
      <p>{photo.likes ? photo.likes.length : 0} curtidas</p>
    </div>
  );
};

export default LikeContainer;
