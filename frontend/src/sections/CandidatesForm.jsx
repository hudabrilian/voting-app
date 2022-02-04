import React, { useEffect, useState } from "react";
import { Layout } from "./Layout";
import { useParams } from "react-router";
import { getCandidate, saveCandidate, updateCandidate } from "../utils/api";
import { showStatusAlert } from "../utils/alert";
import { Header } from "./Header";
import Lottie from "lottie-react";
import LoadingAnimation from "../anims/loading.json";

const CandidatesForm = () => {
  let params = useParams();

  const [candidate, setCandidate] = useState({
    name: "",
    class: "",
    type: "mpk",
    vision: "",
    mission: "",
    status: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState([]);

  const [changeImage, setChangeImage] = useState(false);

  useEffect(() => {
    let mounted = true;

    if (params.id && mounted) {
      getCandidate(params.id)
        .then(({ data }) => {
          if (mounted) {
            setCandidate(data.data);
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

    const candidateData = new FormData();
    candidateData.append("id", candidate.id);
    candidateData.append("name", candidate.name);
    candidateData.append("class", candidate.class);
    candidateData.append("type", candidate.type);
    candidateData.append("vision", candidate.vision);
    candidateData.append("mission", candidate.mission);
    candidateData.append("status", candidate.status === true ? 1 : 0);
    if (changeImage) {
      candidateData.append("image", candidate.image);
    }

    if (params.id) {
      candidateData.append("_method", "PUT");

      await updateCandidate(candidateData, candidate.id)
        .then(({ data }) => {
          setErrors([]);
          setError("");
          setChangeImage(false);
          setCandidate(data.data);
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
      await saveCandidate(candidateData)
        .then(({ data }) => {
          setErrors([]);
          setError("");
          setChangeImage(false);
          setCandidate(data.data);
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
    }
  };

  return (
    <Layout>
      {!loading ? (
        <>
          <Header
            title={params.id ? `Editing ${candidate.name}` : "Create Candidate"}
          />
          <form className="mt-8 space-y-6" id="formCandidate">
            {error && (
              <div className="p-4 bg-pink-500 rounded-xl text-white">
                {error}
              </div>
            )}
            <div className="border sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                <div>
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Image
                  </label>
                  <div className="mt-1 flex items-cent">
                    {candidate.image ? (
                      <img
                        src={
                          changeImage
                            ? URL.createObjectURL(candidate.image)
                            : candidate.image
                        }
                        alt="candidate"
                        className="w-32 h-32 rounded-full"
                      />
                    ) : (
                      <span className="flex items-center justify-center h-32 w-32 rounded-full overflow-hidden bg-gray-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-[80%] w-[80%] text-gray-300"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                    <button
                      type="button"
                      className="relative overflow-hidden ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <input
                        type="file"
                        name="image"
                        className="absolute left-0 top-0 right-0 bottom-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          setChangeImage(true);
                          setCandidate({
                            ...candidate,
                            image: e.target.files[0],
                          });
                        }}
                      />
                      Change
                    </button>
                  </div>
                </div>

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
                    value={candidate.name}
                    onChange={(e) =>
                      setCandidate({ ...candidate, name: e.target.value })
                    }
                    className="pl-3 pr-10 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm border border-gray-300 rounded-md"
                  />
                  {errors.name && (
                    <p className="mt-2 peer-invalid:visible text-pink-600 text-sm">
                      Please provide a valid name.
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="class"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Class
                  </label>
                  <input
                    type="text"
                    name="class"
                    id="class"
                    value={candidate.class}
                    onChange={(e) =>
                      setCandidate({ ...candidate, class: e.target.value })
                    }
                    className="pl-3 pr-10 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm border border-gray-300 rounded-md"
                  />
                  {errors.class && (
                    <p className="mt-2 peer-invalid:visible text-pink-600 text-sm">
                      Please provide a valid class.
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Type
                  </label>
                  <div className="mt-1 relative">
                    <select
                      name="type"
                      id="type"
                      className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      onChange={(e) =>
                        setCandidate({ ...candidate, type: e.target.value })
                      }
                      defaultValue={candidate.type}
                    >
                      <option key="mpk" value="mpk">
                        MPK
                      </option>
                      <option key="osis" value="osis">
                        OSIS
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="vision"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Vision
                  </label>
                  <textarea
                    rows={3}
                    name="vision"
                    id="vision"
                    value={candidate.vision}
                    onChange={(e) =>
                      setCandidate({ ...candidate, vision: e.target.value })
                    }
                    className="pl-3 pr-10 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                  />
                  {errors.vision && (
                    <p className="mt-2 peer-invalid:visible text-pink-600 text-sm">
                      Please provide a valid vision.
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="mission"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mission
                  </label>
                  <textarea
                    rows={3}
                    name="mission"
                    id="mission"
                    value={candidate.mission}
                    onChange={(e) =>
                      setCandidate({ ...candidate, mission: e.target.value })
                    }
                    className="pl-3 pr-10 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                  />
                  {errors.mission && (
                    <p className="mt-2 peer-invalid:visible text-pink-600 text-sm">
                      Please provide a valid mission.
                    </p>
                  )}
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="status"
                      name="status"
                      type="checkbox"
                      checked={candidate.status}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      onChange={(e) =>
                        setCandidate({ ...candidate, status: e.target.checked })
                      }
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="status"
                      className="font-medium text-gray-700"
                    >
                      Active
                    </label>
                  </div>
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

export default CandidatesForm;
