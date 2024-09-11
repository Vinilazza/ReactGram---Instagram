import React from "react";
import { Link } from "react-router-dom";
import { uploads } from "../utils/config";

const Comment = React.memo(
  ({ comment, onEditClick, onDeleteClick, currentUserId }) => {
    return (
      <div className="comment" key={comment.commentId}>
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
        {comment.userId === currentUserId && (
          <div className="comment-actions">
            <button
              onClick={() => onEditClick(comment.comment, comment.commentId)}
            >
              Editar
            </button>
            <button onClick={() => onDeleteClick(comment.commentId)}>
              Excluir
            </button>
          </div>
        )}
      </div>
    );
  }
);

export default Comment;
