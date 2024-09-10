import "./LikeContainer.css";
import { useState, useEffect } from "react";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import Loading from "./Loading";

const LikeContainer = ({ photo, user, handleLike }) => {
  const [hasLiked, setHasLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(false); // Controla o estado de carregamento

  // Atualizar estado local com base nos dados da foto
  useEffect(() => {
    if (photo && user && photo.likes) {
      setHasLiked(photo.likes.includes(user._id));
      setLikesCount(photo.likes.length);
    }
  }, [photo, user]);

  // Função para lidar com o clique no botão de curtir/descurtir
  const handleClick = async () => {
    if (loading) return; // Evitar múltiplos cliques enquanto está carregando
    setLoading(true); // Define como carregando

    // Atualiza o estado local otimisticamente
    const newLikesCount = hasLiked ? likesCount - 1 : likesCount + 1;
    setHasLiked(!hasLiked);
    setLikesCount(newLikesCount);

    try {
      // Chama a função para curtir/descurtir
      await handleLike(photo);
    } catch (error) {
      // Reverte o estado se houver erro
      setHasLiked(hasLiked);
      setLikesCount(likesCount);
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  // Verifica se `photo.likes` e `user` estão disponíveis antes de renderizar o botão
  if (!photo || !photo.likes || !user) {
    return <Loading />; // Ou você pode renderizar um placeholder enquanto carrega
  }

  return (
    <div className="like-container">
      <button
        className="like-button"
        onClick={handleClick}
        disabled={loading} // Desabilita o botão enquanto carrega
      >
        {hasLiked ? <BsHeartFill /> : <BsHeart />}
      </button>
      <span id="likesCount">
        {likesCount > 1 ? (
          <>{likesCount} Curtidas</>
        ) : (
          <>{likesCount} Curtida</>
        )}
      </span>
    </div>
  );
};

export default LikeContainer;
