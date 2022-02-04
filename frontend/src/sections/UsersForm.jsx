import React, { useEffect, useState } from "react";
import { Layout } from "./Layout";
import { useParams, useNavigate } from "react-router";
import { getUser, saveUser, updateUser } from "../utils/api";
import Lottie from "lottie-react";
import LoadingAnimation from "../anims/loading.json";
import { Header } from "./Header";
import { showStatusAlert } from "../utils/alert";

const UsersForm = () => {
  let params = useParams();
  let navigate = useNavigate();

  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    let mounted = true;

    if (params.id && mounted) {
      getUser(params.id)
        .then(({ data }) => {
          if (mounted) {
            setUser(data.data);
            setLoading(false);
          }
        })
        .catch(({ response }) => {
          if (mounted) {
            if (response.data.errors) {
              setErrors(response.data.errors);
              setError(response.data.message);
            } else if (response.data.error) {
              setError(response.data.error);
            }
            setLoading(false);
          }
        });
    } else {
      setLoading(false);
    }

    return function cleanup() {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (params.id) {
      await updateUser(user)
        .then(({ data }) => {
          setErrors([]);
          setError("");
          setUser(data.data);
          showStatusAlert(1);
          setLoading(false);
        })
        .catch(({ response }) => {
          if (response.data.errors) {
            setErrors(response.data.errors);
            setError(response.data.message);
          } else if (response.data.error) {
            setError(response.data.error);
          }
          showStatusAlert(0);
          setLoading(false);
        });
    } else {
      await saveUser(user)
        .then(({ data }) => {
          setErrors([]);
          setError("");
          setUser(data.data);
          setLoading(false);
          showStatusAlert(1);
          navigate("/users");
        })
        .catch(({ response }) => {
          if (response.data.errors) {
            setErrors(response.data.errors);
            setError(response.data.message);
          } else if (response.data.error) {
            setError(response.data.error);
          }
          showStatusAlert(0);
          setLoading(false);
        });
    }
  };

  return (
    <Layout>
      {!loading ? (
        <>
          <Header title={params.id ? `Editing ${user.name}` : "Create User"} />
          <form className="mt-8 space-y-6">
            {error && (
              <div className="p-4 bg-pink-500 rounded-xl text-white">
                {error}
              </div>
            )}
            <div className="border sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className="pl-3 pr-10 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm border border-gray-300 rounded-md"
                  />
                  {errors.name &&
                    errors.name.map((error) => {
                      return (
                        <p className="mt-2 peer-invalid:visible text-pink-600 text-sm">
                          {error}
                        </p>
                      );
                    })}
                </div>

                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={user.username}
                    className="pl-3 pr-10 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm border border-gray-300 rounded-md"
                    onChange={(e) =>
                      setUser({ ...user, username: e.target.value })
                    }
                  />
                  {errors.username &&
                    errors.username.map((error) => {
                      return (
                        <p className="mt-2 peer-invalid:visible text-pink-600 text-sm">
                          {error}
                        </p>
                      );
                    })}
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={user.email}
                    className="pl-3 pr-10 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm border border-gray-300 rounded-md"
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                  />
                  {errors.email &&
                    errors.email.map((error) => {
                      return (
                        <p className="mt-2 peer-invalid:visible text-pink-600 text-sm">
                          {error}
                        </p>
                      );
                    })}
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="pl-3 pr-10 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm border border-gray-300 rounded-md"
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                  />
                  {errors.password &&
                    errors.password.map((error) => {
                      return (
                        <p className="mt-2 peer-invalid:visible text-pink-600 text-sm">
                          {error}
                        </p>
                      );
                    })}
                </div>
                <div>
                  <label
                    htmlFor="password_confirmation"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password Confirmation
                  </label>
                  <input
                    type="password"
                    name="password_confirmation"
                    id="password_confirmation"
                    className="pl-3 pr-10 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm border border-gray-300 rounded-md"
                    onChange={(e) =>
                      setUser({
                        ...user,
                        password_confirmation: e.target.value,
                      })
                    }
                  />
                  {errors.password_confirmation &&
                    errors.password_confirmation.map((error) => {
                      return (
                        <p className="mt-2 peer-invalid:visible text-pink-600 text-sm">
                          {error}
                        </p>
                      );
                    })}
                </div>
              </div>
              <button
                className="px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded text-right sm:px-6"
                onClick={handleSubmit}
              >
                Save
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className="flex justify-center">
          <Lottie
            animationData={LoadingAnimation}
            height={100}
            width={100}
            loop={true}
            className="w-1/2"
          />
        </div>
      )}
    </Layout>
  );
};

export default UsersForm;
