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

//REDUx
import { logout, reset } from "../slices/authSlice";
import { useEffect, useState } from "react";
import { profile } from "../slices/userSlice";

const Navbar = () => {
  const { auth } = useAuth();
  const { user } = useSelector((state) => state.auth);

  const { user: usuario } = useSelector((state) => state.user);

  const [query, setQuery] = useState("");

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());

    navigate("/login");
  };
  // Load user data
  useEffect(() => {
    dispatch(profile());
  }, [dispatch]);

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
            {user && (
              <>
                <li>
                  <NavLink to={`/users/${user._id}`}>
                    <BsFillCameraFill />
                  </NavLink>
                </li>

                {usuario.profileImage && (
                  <NavLink to="/profile">
                    <img
                      id="img-icon"
                      src={`${uploads}/users/${usuario.profileImage}`}
                      alt={usuario.name}
                    />
                  </NavLink>
                )}
                {!usuario.profileImage && (
                  <li>
                    <NavLink to="/profile">
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
