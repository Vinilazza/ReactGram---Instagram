import "./Home.css";

// Components
import Photoitem from "../../components/PhotoItem";
import { Link } from "react-router-dom";

// Hooks
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useResetComponentMessage } from "../../hooks/useResetComponent";

// Redux

import { getPhotos, like } from "../../slices/photoSlice";

const Home = () => {
  const dispatch = useDispatch();
  const resetMessage = useResetComponentMessage(dispatch);

  const { user } = useSelector((state) => state.auth);
  const { photos, loading, success } = useSelector((state) => state.photo);

  //Load all photos
  useEffect(() => {
    dispatch(getPhotos());
  }, [dispatch]);

  // Recarrega as fotos após sucesso no like/dislike
  useEffect(() => {
    if (success) {
      dispatch(getPhotos());
    }
  }, [dispatch, success]);

  // Like a photo
  const handleLike = (photo) => {
    dispatch(like(photo._id));
  };

  if (loading) {
    return <p>Carregando</p>;
  }

  return (
    <div id="home">
      {photos &&
        photos.map((photo) => (
          <div key={photo._id}>
            <Photoitem photo={photo} user={user} handleLike={handleLike} />
            <Link className="btn" to={`/photos/${photo._id}`}>
              Ver mais
            </Link>
          </div>
        ))}
      {photos && photos.length === 0 && (
        <h2 className="no-photos">
          Ainda não há fotos publicadas
          <Link to={`/users/${user.userId}`}></Link>
        </h2>
      )}
    </div>
  );
};

export default Home;
