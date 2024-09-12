import "./Navbar.css";
import { uploads } from "../utils/config";
import { NavLink, Link } from "react-router-dom";
import {
  BsSearch,
  BsHouseDoorFill,
  BsFillPersonFill,
  BsFillCameraFill,
} from "react-icons/bs";
import { useAuth } from "../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, reset } from "../slices/authSlice";
import { useEffect, useState } from "react";
import { getUserDetails } from "../slices/userSlice";

const Navbar = () => {
  const { auth } = useAuth();
  const { user: userAuth } = useSelector((state) => state.auth); // Usuário autenticado

  const [query, setQuery] = useState("");
  const [profileImage, setProfileImage] = useState(null); // Estado local para imagem de perfil
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
  };

  useEffect(() => {
    if (userAuth && userAuth._id) {
      const fetchUserDetails = async () => {
        try {
          const result = await dispatch(getUserDetails(userAuth._id)).unwrap();
          // Atualize o estado local com a imagem de perfil do usuário autenticado
          setProfileImage(result.profileImage);
        } catch (error) {
          console.error("Failed to fetch user details:", error);
        }
      };

      fetchUserDetails();
    }
  }, [dispatch, userAuth]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query) {
      return navigate(`/search?q=${query}`);
    }
  };

  return (
    <nav id="nav">
      <Link to={"/"}>ViniSocialMedia</Link>
      <form id="search-form" onSubmit={handleSearch}>
        <BsSearch />
        <input
          type="text"
          placeholder="Pesquisar"
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
      <ul id="nav-links">
        {auth ? (
          <>
            <li>
              <NavLink to={"/"}>
                <BsHouseDoorFill />
              </NavLink>
            </li>
            {userAuth && (
              <>
                <li>
                  <NavLink to={`/users/${userAuth._id}`}>
                    <BsFillCameraFill />
                  </NavLink>
                </li>
                {profileImage ? (
                  <NavLink to={`/profile`}>
                    <img
                      id="img-icon"
                      src={`${uploads}/users/${profileImage}`}
                      alt={userAuth.name}
                    />
                  </NavLink>
                ) : (
                  <li>
                    <NavLink to={`/users/${userAuth._id}`}>
                      <BsFillPersonFill />
                    </NavLink>
                  </li>
                )}
              </>
            )}
            <li>
              <span onClick={handleLogout}>Sair</span>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to={"/login"}>Entrar</NavLink>
            </li>
            <li>
              <NavLink to={"/register"}>Cadastrar</NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
