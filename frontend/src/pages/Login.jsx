import React, { useState, useContext } from "react";
import { Layout } from "../sections/Layout";
import { loginUser } from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const { updateUser, updateIsAuthenticated } = useContext(AuthContext);

  let navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    await loginUser({ username, password })
      .then((res) => {
        updateUser(res.data.user);
        updateIsAuthenticated(true);
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      })
      .catch(({ response }) => {
        if (response.data.errors) {
          setErrors(response.data.errors);
          setError(response.data.message);
        } else if (response.data.error) {
          setError(response.data.error);
        }
        setLoading(false);
        setPassword("");
      });
  };

  return (
    <Layout>
      <div className="flex-col space-y-10">
        <h1 className="font-bold text-2xl text-center">
          Login to your account
        </h1>
        <div className="flex justify-center">
          <form className="flex-col w-full md:w-1/2 space-y-6 items-center">
            {error && (
              <div className="p-4 bg-pink-500 rounded-xl text-white">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="block font-bold">Username</label>
              <input
                type="text"
                placeholder="Username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block px-2 py-1 rounded-lg border border-slate-300 shadow-sm placeholder-slate-400 w-full focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              {errors.username && (
                <p className="mt-2 peer-invalid:visible text-pink-600 text-sm">
                  Please provide a valid username.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block font-bold">Password</label>
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block px-2 py-1 rounded-lg border border-slate-300 shadow-sm placeholder-slate-400 w-full focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              {errors.password && (
                <p className="mt-2 peer-invalid:visible text-pink-600 text-sm">
                  Please provide a valid password.
                </p>
              )}
            </div>
            <div className="flex justify-end">
              <button
                className="bg-indigo-500 hover:bg-indigo-600 rounded-xl px-4 py-2 text-white"
                onClick={login}
                disabled={loading || !username || !password}
              >
                {!loading ? "Login" : "Loading..."}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
