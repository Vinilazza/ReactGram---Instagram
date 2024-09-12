import { BsX } from "react-icons/bs";
import { uploads } from "../utils/config";
import "./FollowersModal.css";

const FollowersModal = ({ title, modalUser, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>
          <BsX />
        </span>
        <h2>{title}</h2>
        <ul>
          {modalUser &&
            modalUser.map((modal) => (
              <li key={modal._id}>
                <div className="profile-img">
                  <img
                    src={`${uploads}/users/${modal.profileImage}`}
                    alt={modal.name}
                  />
                  {modal.name}
                </div>
              </li>
            ))}
        </ul>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default FollowersModal;
