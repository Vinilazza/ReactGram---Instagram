import "./Home.css";

// Components
import Photoitem from "../../components/PhotoItem";
import { Link } from "react-router-dom";

// Hooks
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

// Redux

import { getPhotos, like } from "../../slices/photoSlice";
import Loading from "../../components/Loading";

const Home = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { photos, loading } = useSelector((state) => state.photo);

  //Load all photos
  useEffect(() => {
    dispatch(getPhotos());
  }, [dispatch]);

  // Like a photo
  const handleLike = (photo) => {
    dispatch(like(photo._id));
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div id="home">
      {photos &&
        photos.map((photo) => (
          <div key={photo._id}>
            <Photoitem photo={photo} user={user} handleLike={handleLike} />
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
