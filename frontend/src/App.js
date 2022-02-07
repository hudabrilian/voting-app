import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Navbar from "./sections/Navbar";
import { AuthContext } from "./context/AuthContext";
import { getUserDetails } from "./utils/api";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Users from "./pages/Users";
import Lottie from "lottie-react";
import LoadingAnimation from "./anims/loading.json";
import UsersForm from "./sections/UsersForm";
import Candidates from "./pages/Candidates";
import CandidatesForm from "./sections/CandidatesForm";
import Votes from "./pages/Votes";

function App() {
  const [user, setUser] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUserDetails()
        .then(({ data }) => {
          setUser(data);
          setIsAuthenticated(true);
          setLoading(false);
        })
        .catch(({ response }) => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        updateUser: setUser,
        isAuthenticated,
        updateIsAuthenticated: setIsAuthenticated,
      }}
    >
      {!loading ? (
        <div className="min-h-screen max-w-screen select-none">
          <Navbar />
          <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Home />} />
            {isAuthenticated ? (
              <>
                <Route path="/dashboard" element={<Dashboard />} />

                <Route path="/users" element={<Users />} />
                <Route path="/users/create" element={<UsersForm />} />
                <Route path="/users/:id" element={<UsersForm />} />

                <Route path="/candidates" element={<Candidates />} />
                <Route path="/candidates/create" element={<CandidatesForm />} />
                <Route path="/candidates/:id" element={<CandidatesForm />} />

                <Route path="/votes" element={<Votes />} />
              </>
            ) : (
              <Route path="/login" element={<Login />} />
            )}
          </Routes>
        </div>
      ) : (
        <div className="w-screen h-screen flex justify-center items-center">
          <Lottie
            animationData={LoadingAnimation}
            height={100}
            width={100}
            loop={true}
            className="w-1/2"
          />
        </div>
      )}
    </AuthContext.Provider>
  );
}

export default App;
