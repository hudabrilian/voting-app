import React, { useContext, useEffect, useState } from "react";
import { Layout } from "../sections/Layout";
import { deleteUser, getUsers } from "../utils/api";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Header } from "../sections/Header";
import Lottie from "lottie-react";
import LoadingAnimation from "../anims/loading.json";
import { HiPencil, HiTrash } from "react-icons/hi";
import { AuthContext } from "../context/AuthContext";

const Users = () => {
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);

  const userAuth = useContext(AuthContext).user;

  useEffect(() => {
    let mounted = true;
    getUsers().then((res) => {
      if (mounted) {
        setUsers(res.data);
        setLoading(false);
      }
    });

    return function cleanup() {
      mounted = false;
    };
  }, []);

  const getForPage = (e, link) => {
    e.preventDefault();
    if (!link.url || link.active) return;
    setLoading(true);
    getUsers(link).then((res) => {
      setUsers(res.data);
      setLoading(false);
    });
  };

  return (
    <Layout>
      <Header title="Users List">
        <Link
          to="create"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white"
        >
          Create
        </Link>
      </Header>
      {!loading ? (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 my-10 overflow-scroll">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Username
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users &&
                  users.data.map((user) => {
                    return (
                      <tr className="hover:bg-slate-100" key={user.id}>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">
                              {user.username}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.hasVote
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.hasVote ? "Voted" : "Not Voted"}
                          </span>
                        </td>
                        <td className="flex justify-end space-x-5 px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            to={`${user.id}`}
                            className="p-2 rounded bg-yellow-400 hover:bg-yellow-500 text-white"
                          >
                            <HiPencil />
                          </Link>
                          {user.id !== userAuth.id && (
                            <button
                              className="p-2 rounded bg-red-400 hover:bg-red-500 text-white"
                              onClick={() => {
                                Swal.fire({
                                  title: "Are you sure?",
                                  text: "You won't be able to revert this!",
                                  icon: "warning",
                                  showCancelButton: true,
                                  confirmButtonColor: "#3085d6",
                                  cancelButtonColor: "#d33",
                                  confirmButtonText: "Yes, delete it!",
                                }).then((result) => {
                                  if (result.isConfirmed) {
                                    setLoading(true);
                                    deleteUser(user.id).then((res) => {
                                      getUsers().then((res) => {
                                        setUsers(res.data);
                                        Swal.fire(
                                          "Deleted!",
                                          "User has been deleted.",
                                          "success"
                                        );
                                        setLoading(false);
                                      });
                                    });
                                  }
                                });
                              }}
                            >
                              <HiTrash />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-5">
            <nav className="relative z-0 inline-flex justify-center rounded-md shadow-sm -space-x-px">
              {users.meta.links.map((link, index) => {
                return (
                  <button
                    key={index}
                    disabled={!link.url}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium whitespace-nowrap 
                      ${
                        link.active
                          ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600 "
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50 "
                      }
                      ${index === 0 ? "rounded-l-md " : ""}
                     ${
                       index === users.meta.links.length - 1
                         ? "rounded-r-md"
                         : ""
                     }
                    `}
                    onClick={(e) => getForPage(e, link)}
                  >
                    <>{outputLinkLabel(link.label)}</>
                  </button>
                );
              })}
            </nav>
          </div>
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

const outputLinkLabel = (link) => {
  return link.replace(/&laquo;/g, "<").replace(/&raquo;/g, ">");
};

export default Users;
