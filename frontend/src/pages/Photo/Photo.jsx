import "./Photo.css";
import { uploads } from "../../utils/config";
import { useParams } from "react-router-dom";
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
import EditCommentModal from "../../components/EditCommentModal";
import Comment from "../../components/Comment";
import { useCallback } from "react";

const Photo = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const resetMessage = useResetComponentMessage(dispatch);

  const { user } = useSelector((state) => state.auth);
  const { photo, loading, error, message } = useSelector(
    (state) => state.photo
  );
  resetMessage();

  // Estado dos comentários
  const [comments, setComments] = useState(photo.comments || []);

  const [commentText, setCommentText] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!photo || photo._id !== id) {
      // Verifique se já temos a foto no estado antes de buscar
      dispatch(getPhoto(id));
    }
  }, [dispatch, id, photo]);

  useEffect(() => {
    setComments(photo.comments || []);
  }, [photo.comments]);

  const handleLike = useCallback(
    (photo) => {
      dispatch(like(photo._id));
      resetMessage();
    },
    [dispatch, resetMessage]
  );
  const handleComment = useCallback(
    (e) => {
      e.preventDefault(); // Previna o comportamento padrão de recarregar a página
      const commentData = {
        comment: commentText,
        id: photo._id,
      };
      dispatch(comment(commentData));
      setCommentText(""); // Limpa o campo de comentário
      resetMessage();
    },
    [dispatch, commentText, photo._id, resetMessage]
  );

  const handleDeleteComment = useCallback(
    (commentId) => {
      const commentData = {
        commentId,
        id: photo._id,
      };
      dispatch(deleteComment(commentData));
      resetMessage(); // Limpa a mensagem após o dispatch
    },
    [dispatch, photo._id, resetMessage]
  );

  const handleEditClick = useCallback((commentText, commentId) => {
    const commentData = {
      comment: commentText,
      commentId: commentId,
    };
    setEditingComment(commentData);
    setIsModalOpen(true);
  }, []);
  const handleSaveComment = useCallback(
    (newCommentText) => {
      if (editingComment) {
        dispatch(
          editComment({
            commentId: editingComment.commentId,
            comment: newCommentText,
            id: photo._id,
          })
        );
        // Atualize o estado local dos comentários
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.commentId === editingComment.commentId
              ? { ...comment, comment: newCommentText }
              : comment
          )
        );
        setIsModalOpen(false);
      }
    },
    [dispatch, editingComment, photo._id]
  );

  if (!photo && loading) {
    return <Loading />;
  }
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
                placeholder="Insira seu comentário..."
                onChange={(e) => setCommentText(e.target.value)}
                value={commentText}
              />
              <input type="submit" value="Enviar" />
            </form>
            {photo.comments.length === 0 && <p>Não há comentários</p>}
            {photo.comments.map((comment) => (
              <Comment
                key={comment.commentId}
                comment={comment}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteComment}
                currentUserId={user._id}
              />
            ))}
          </>
        )}
      </div>
      <EditCommentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveComment}
        initialComment={editingComment ? editingComment.comment : ""}
      />
    </div>
  );
};

export default Photo;
