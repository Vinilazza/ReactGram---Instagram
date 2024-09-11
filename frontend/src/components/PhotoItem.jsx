import "./PhotoItem.css";
import { uploads } from "../utils/config";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getUserDetails } from "../slices/userSlice";
import DataPost from "./DataPost";
import LikeContainer from "./LikeContainer";

const PhotoItem = ({ photo, user, handleLike }) => {
  const dispatch = useDispatch();

  // Estado local para armazenar os detalhes do usuário que postou a foto
  const [photoUser, setPhotoUser] = useState(null);

  // Carregar os dados do usuário do post
  useEffect(() => {
    const loadUserDetails = async () => {
      if (photo && photo.userId) {
        const response = await dispatch(getUserDetails(photo.userId)).unwrap();
        setPhotoUser(response); // Armazena os detalhes do usuário localmente
      }
    };

    loadUserDetails();
  }, [dispatch, photo]);

  return (
    <div className="photo-item">
      <div className="photo-title">
        {photoUser?.profileImage && (
          <Link to={`/users/${photo.userId}`}>
            <img
              id="img-profileImage"
              src={`${uploads}/users/${photoUser.profileImage}`}
              alt={photoUser.name}
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
