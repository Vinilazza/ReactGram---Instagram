import "./LikeContainer.css";
import { BsHeart, BsHeartFill } from "react-icons/bs";

const LikeContainer = ({ photo, user, handleLike, handleDislike }) => {
  // Certifique-se de que photo.likes é um array e user é definido
  const isLiked = (photo.likes || []).includes(user?._id);

  const handleClick = () => {
    if (isLiked) {
      handleDislike(photo); // Chama a função de dislike se já estiver curtido
    } else {
      handleLike(photo); // Chama a função de like se não estiver curtido
    }
  };

  return (
    <div className="like">
      {(photo.likes || []) && user && (
        <>
          {isLiked ? (
            <BsHeartFill onClick={handleClick} /> // Ícone preenchido para curtir
          ) : (
            <BsHeart onClick={handleClick} /> // Ícone vazio para não curtido
          )}
          <p>{(photo.likes || []).length} like(s)</p>
        </>
      )}
    </div>
  );
};

export default LikeContainer;
