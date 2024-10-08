import "./Profile.css";
import { uploads } from "../../utils/config";
import Message from "../../components/Message";
import { Link } from "react-router-dom";
import { BsFillEyeFill, BsPencilFill, BsXLg } from "react-icons/bs";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useResetComponentMessage } from "../../hooks/useResetComponent";
import Loading from "../../components/Loading";
// Redux
import {
  followUser,
  getUserDetails,
  unfollowUser,
  getFollowers,
  getFollowing,
} from "../../slices/userSlice";
import {
  publishPhoto,
  getUserPhotos,
  deletePhoto,
  updatePhoto,
} from "../../slices/photoSlice";
import FollowersModal from "../../components/FollowersModal";

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const resetComponentMessage = useResetComponentMessage(dispatch);
  const [profileUser, setProfileUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState([]); // Estado para armazenar seguidores
  const [following, setFollowing] = useState([]); // Estado para armazenar seguidos
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para abrir/fechar o modal
  const [modalTitle, setModalTitle] = useState(""); // Para definir o título do modal
  const [modalUsers, setModalUsers] = useState([]); // Para definir a lista de usuários do modal

  const { user: userAuth } = useSelector((state) => state.auth);
  const {
    photos,
    loading: loadingPhoto,
    message: messagePhoto,
    error: errorPhoto,
  } = useSelector((state) => state.photo);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [editId, setEditId] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const newPhotoForm = useRef();
  const editPhotoForm = useRef();

  const toggleModal = (title, users) => {
    setModalTitle(title); // Define o título dinâmico
    setModalUsers(users); // Define a lista de usuários a ser exibida
    setIsModalOpen(!isModalOpen);
  };
  useEffect(() => {
    const loadProfile = async () => {
      // Buscar detalhes do usuário
      const userDetails = await dispatch(getUserDetails(id)).unwrap();
      setProfileUser(userDetails);
      dispatch(getUserPhotos(id));

      // Verificar se o usuário está seguindo o perfil atual
      if (userAuth._id) {
        const isFollowing = userDetails.followers.includes(userAuth._id);
        setIsFollowing(isFollowing);
      }

      // Buscar seguidores e quem o usuário segue
      const userFollowers = await dispatch(getFollowers(id)).unwrap();
      const userFollowing = await dispatch(getFollowing(id)).unwrap();
      setFollowers(userFollowers);
      setFollowing(userFollowing);
    };
    loadProfile();
  }, [dispatch, id, userAuth._id]);

  const handleFile = (e) => {
    const image = e.target.files[0];
    setImage(image);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const photoData = { title, image };
    const formData = new FormData();
    Object.keys(photoData).forEach((key) =>
      formData.append(key, photoData[key])
    );
    dispatch(publishPhoto(formData));
    setTitle("");
    resetComponentMessage();
  };

  const handleDelete = (id) => {
    dispatch(deletePhoto(id));
    resetComponentMessage();
  };

  const hideOrShowForms = () => {
    newPhotoForm.current.classList.toggle("hide");
    editPhotoForm.current.classList.toggle("hide");
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const photoData = { title: editTitle, id: editId };
    dispatch(updatePhoto(photoData));
    resetComponentMessage();
  };

  const handleEdit = (photo) => {
    if (editPhotoForm.current.classList.contains("hide")) {
      hideOrShowForms();
    }
    setEditId(photo._id);
    setEditTitle(photo.title);
    setEditImage(photo.image);
  };

  const handleCancelEdit = () => {
    hideOrShowForms();
  };

  const handleFollow = async (userId) => {
    const userData = { userId, id };
    dispatch(followUser(userData));
    setIsFollowing(true);
  };

  const handleUnfollow = async (userId) => {
    const userData = { userId, id };
    dispatch(unfollowUser(userData));
    setIsFollowing(false);
  };
  useEffect(() => {
    if (id !== userAuth._id) {
      // Atualiza a lista de seguidores e seguidos quando a ação é realizada
      const updateFollowData = async () => {
        const updatedFollowers = await dispatch(getFollowers(id)).unwrap();
        const updatedFollowing = await dispatch(getFollowing(id)).unwrap();

        setFollowers(updatedFollowers);
        setFollowing(updatedFollowing);
      };

      updateFollowData();
    }
  }, [dispatch, id, handleFollow, handleUnfollow]);
  if (loadingPhoto) {
    return <Loading />;
  }
  return (
    <div id="profile">
      {/* Renderização das informações do perfil */}
      <div className="profile-header">
        <div className="profile-content">
          {profileUser?.profileImage && (
            <div className="img">
              <img
                src={`${uploads}/users/${profileUser.profileImage}`}
                alt={profileUser.name}
              />
            </div>
          )}
          <div className="profile-description">
            <h2>{profileUser?.name}</h2>
            <p>{profileUser?.bio}</p>
          </div>
          <div className="followers">
            <h3
              onClick={() => toggleModal("Seguidores", followers)}
              style={{ cursor: "pointer", textAlign: "center" }}
            >
              {followers.length} <br />
              Seguidores
            </h3>
          </div>
          <div
            onClick={() => toggleModal("Seguindo", following)}
            style={{ cursor: "pointer", textAlign: "center" }}
            className="following"
          >
            <h3>
              {following.length} <br />
              Seguindo{" "}
            </h3>
          </div>
          {id !== userAuth._id &&
            (isFollowing ? (
              <button
                id="Seguindo"
                onClick={() => handleUnfollow(userAuth._id)}
              >
                Seguindo
              </button>
            ) : (
              <button id="Seguir" onClick={() => handleFollow(userAuth._id)}>
                Seguir
              </button>
            ))}
        </div>
        <div className="followers-following"></div>
      </div>

      <FollowersModal
        title={modalTitle} // Título dinâmico (Seguidores ou Seguindo)
        modalUser={modalUsers} // Lista dinâmica de seguidores ou seguidos
        isOpen={isModalOpen}
        onClose={toggleModal}
      />

      {id === userAuth._id && (
        <>
          <div className="new-photo" ref={newPhotoForm}>
            <h3>Compartilhe algum momento seu:</h3>
            <form onSubmit={handleSubmit}>
              <label>
                <span>Título para a foto</span>
                <input
                  type="text"
                  placeholder="Insira um título"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title || ""}
                />
              </label>
              <label>
                <span>Imagem:</span>
                <input type="file" onChange={handleFile} />
              </label>
              {!loadingPhoto && <input type="submit" value="Postar" />}
              {loadingPhoto && (
                <input type="submit" value="Aguarde..." disabled />
              )}
            </form>
          </div>
          <div className="edit-photo hide" ref={editPhotoForm}>
            <p>Editando</p>
            {editImage && (
              <img src={`${uploads}/photos/${editImage}`} alt={editTitle} />
            )}
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                placeholder="Insira um título"
                onChange={(e) => setEditTitle(e.target.value)}
                value={editTitle || ""}
              />
              <input type="submit" value="Atualizar" />
              <button className="cancel-btn" onClick={handleCancelEdit}>
                Cancelar edição
              </button>
            </form>
          </div>
          {errorPhoto && <Message msg={errorPhoto} type="error" />}
          {messagePhoto && <Message msg={messagePhoto} type="success" />}
        </>
      )}
      <div className="user-photos">
        <h2>Fotos publicadas:</h2>
        <div className="photos-container">
          {photos &&
            photos.map((photo) => (
              <div className="photo" key={photo._id}>
                {photo.image && (
                  <Link to={`/photos/${photo._id}`}>
                    <img
                      src={`${uploads}/photos/${photo.image}`}
                      alt={photo.title}
                    />
                  </Link>
                )}
                {id === userAuth._id ? (
                  <div className="actions">
                    <Link to={`/photos/${photo._id}`}>
                      <BsFillEyeFill />
                    </Link>
                    <BsPencilFill onClick={() => handleEdit(photo)} />
                    <BsXLg onClick={() => handleDelete(photo._id)} />
                  </div>
                ) : (
                  <></>
                )}
              </div>
            ))}
          {photos.length === 0 && <p>Ainda não há fotos publicadas...</p>}
        </div>
      </div>
    </div>
  );
};

export default Profile;
