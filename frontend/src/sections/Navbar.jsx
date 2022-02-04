import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { logoutUser } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { HiMenuAlt3, HiOutlineX } from "react-icons/hi";

const Navbar = () => {
  const { user, isAuthenticated, updateUser, updateIsAuthenticated } =
    useContext(AuthContext);

  const [menu, setMenu] = useState(false);
  const [navbar, setNavbar] = useState(false);

  let navigate = useNavigate();

  const Link = ({ to, name }) => {
    return (
      <NavLink
        to={to}
        className={({ isActive }) =>
          isActive ? "border-b-2 border-indigo-300 rounded" : ""
        }
        onClick={() => setNavbar(false)}
      >
        {name}
      </NavLink>
    );
  };

  return (
    <nav className="shadow-md bg-white py-10 lg:px-32 flex flex-col md:flex-row items-center justify-center md:justify-between sticky top-0 z-20">
      <div className="flex justify-around md:justify-between w-full">
        <NavLink to="/" className="text-2xl font-bold select-none text-center">
          SISPEKA
        </NavLink>
        <button
          className="text-3xl md:hidden"
          onClick={() => setNavbar(!navbar)}
        >
          {!navbar ? <HiMenuAlt3 /> : <HiOutlineX />}
        </button>
      </div>

      <div className="md:flex md:w-full justify-end space-x-10 items-center hidden relative">
        <Link to="/" name="Home">
          Home
        </Link>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" name="Dashboard">
              Dashboard
            </Link>
            <Link to="/users" name="Users">
              Users
            </Link>
            <Link to="/candidates" name="Candidates">
              Candidates
            </Link>
            <div
              className="ml-6 px-4 py-2 relative bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl cursor-pointer"
              onClick={() => setMenu(!menu)}
            >
              Hi, {user.name && user.name.split(" ")[0]}!
              {menu && (
                <div
                  className="absolute -bottom-14 hover:bg-gray-200 text-black right-0 bg-white rounded-xl border shadow-md px-5 py-2"
                  onClick={async () => {
                    await logoutUser();
                    updateUser({});
                    updateIsAuthenticated(false);
                    localStorage.removeItem("token");
                    navigate("/");
                  }}
                >
                  <button>Logout</button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link to="/login" name="Login">
            Login
          </Link>
        )}
      </div>

      {/* Mobile */}
      {navbar && (
        <div className="md:hidden flex flex-col space-y-4 mt-10 text-center items-center justify-center">
          <Link to="/" name="Home">
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" name="Dashboard">
                Dashboard
              </Link>
              <Link to="/users" name="Users">
                Users
              </Link>
              <Link to="/candidates" name="Candidates">
                Candidates
              </Link>
              <button
                onClick={async () => {
                  await logoutUser();
                  updateUser({});
                  updateIsAuthenticated(false);
                  localStorage.removeItem("token");
                  navigate("/");
                }}
              >
                Logout
              </button>
              <h1 className="bg-indigo-400 rounded-xl text-white px-4 py-2">
                Logged in as {user.name.split(" ")[0]}
              </h1>
            </>
          ) : (
            <Link to="/login" name="Login">
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
