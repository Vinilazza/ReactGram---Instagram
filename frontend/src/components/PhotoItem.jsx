import "./PhotoItem.css";
import { uploads } from "../utils/config";
import { Link } from "react-router-dom";
import { getUserDetails } from "../slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import DataPost from "./DataPost";
import LikeContainer from "./LikeContainer";

const PhotoItem = ({ photo, user, handleLike }) => {
  const dispatch = useDispatch();

  const { user: usuario } = useSelector((state) => state.user);

  // Load user data
  useEffect(() => {
    if (photo && photo.userId) {
      dispatch(getUserDetails(photo.userId));
    }
  }, [dispatch, photo]);

  // Verifique se `photo` e `usuario` estão disponíveis antes de tentar acessar suas propriedades
  return (
    <div className="photo-item">
      <div className="photo-title">
        {usuario?.profileImage && (
          <Link to={`/users/${photo.userId}`}>
            <img
              id="img-profileImage"
              src={`${uploads}/users/${usuario.profileImage}`}
              alt={usuario.name}
            />
          </Link>
        )}
        <span className="name-person">{photo?.userName}</span>
      </div>

      {photo?.image && (
        <Link to={`/users/${photo.userId}`}>
          <img src={`${uploads}/photos/${photo.image}`} alt={photo.title} />
        </Link>
      )}
      <LikeContainer photo={photo} user={user} handleLike={handleLike} />
      <div id="userName">
        <span>
          <b>
            <Link to={`/users/${photo.userId}`}>{photo?.userName}</Link>
          </b>{" "}
          <span id="title">{photo?.title}</span>
          <span id="dateTime">
            <DataPost timestamp={photo?.createdAt} />
          </span>
        </span>
      </div>
    </div>
  );
};

export default PhotoItem;
