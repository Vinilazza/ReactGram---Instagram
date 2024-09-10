import "./Photo.css";

import { uploads } from "../../utils/config";
import { useParams } from "react-router-dom";

//COMPONENS
import Message from "../../components/Message";
import { Link } from "react-router-dom";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useResetComponentMessage } from "../../hooks/useResetComponent";
import {
  getPhoto,
  like,
  comment,
  editComment,
  deleteComment,
} from "../../slices/photoSlice";
import PhotoItem from "../../components/PhotoItem";
import Loading from "../../components/Loading";

const Photo = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const resetMessage = useResetComponentMessage(dispatch);

  const { user } = useSelector((state) => state.auth);
  const { photo, loading, error, message } = useSelector(
    (state) => state.photo
  );
  resetMessage();

  //comentarios
  const [commentText, setCommentText] = useState("");
  //load photo data
  useEffect(() => {
    dispatch(getPhoto(id));
  }, [dispatch, id]);

  const handleLike = (photo) => {
    dispatch(like(photo._id));

    resetMessage();
  };

  // LIKE E comentarios

  const handleComment = (e) => {
    e.preventDefault();

    const commentData = {
      comment: commentText,
      id: photo._id,
    };

    dispatch(comment(commentData));
    setCommentText("");

    resetMessage();
  };

  if (loading) {
    return <Loading />;
  }

  const handleEditComment = () => {
    const commentData = {
      comment: commentText,
      id: photo._id,
    };
    dispatch(editComment(commentData));
  };

  const handleDeleteComment = () => {
    const commentData = {
      commentId: user._id,
      id: photo._id,
    };
    dispatch(deleteComment(commentData));
  };

  return (
    <div id="photo">
      <PhotoItem photo={photo} user={user} handleLike={handleLike} />
      <div className="message-container">
        {error && <Message msg={error} type="error" />}
        {message && <Message msg={message} type="success" />}
      </div>
      <div className="comments">
        {photo.comments && (
          <>
            <h2>Comentários: ({photo.comments.length})</h2>
            <form onSubmit={handleComment}>
              <input
                type="text"
                placeholder="Insira seu comentario.."
                onChange={(e) => setCommentText(e.target.value)}
                value={commentText || ""}
              />
              <input type="submit" value="Enviar" />
            </form>
            {photo.comments.length === 0 && <p>Não há comentarios</p>}
            {photo.comments.map((comment) => (
              <div className="comment" key={comment.comment}>
                <div className="author">
                  {comment.userImage && (
                    <img
                      src={`${uploads}/users/${comment.userImage}`}
                      alt={comment.userName}
                    />
                  )}
                  <Link to={`/users/${comment.userId}`}>
                    <p>{comment.userName}</p>
                  </Link>
                </div>
                <p>{comment.comment}</p>
                {comment.userId === user._id && (
                  <div className="comment-actions">
                    <button onClick={() => handleEditComment(comment._id)}>
                      Editar
                    </button>
                    <button onClick={() => handleDeleteComment(comment._id)}>
                      Excluir
                    </button>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Photo;
