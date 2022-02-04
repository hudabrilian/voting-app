import React, { useContext, useEffect, useState } from "react";
import { Layout } from "../sections/Layout";
import { getAllCandidates, voteCandidate } from "../utils/api";
import Lottie from "lottie-react";
import LoadingAnimation from "../anims/loading.json";
import EmptyAnimation from "../anims/empty.json";
import { AuthContext } from "../context/AuthContext";
import DoneAnimation from "../anims/done.json";

const Dashboard = () => {
  const [candidatesMpk, setCandidatesMpk] = useState([]);
  const [candidatesOsis, setCandidatesOsis] = useState([]);
  const [loading, setLoading] = useState(true);

  const [hasVote, setHasVote] = useState(false);
  const [selectedMpk, setSelectedMpk] = useState(null);
  const [selectedOsis, setSelectedOsis] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    let mounted = true;
    getAllCandidates().then((res) => {
      if (mounted) {
        if (!res.data.hasVote) {
          setCandidatesMpk(res.data.mpk);
          setCandidatesOsis(res.data.osis);
        }
        setHasVote(res.data.hasVote);
        setLoading(false);
      }
    });

    return function cleanup() {
      mounted = false;
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const candidates = {
      mpk: selectedMpk,
      osis: selectedOsis,
    };
    voteCandidate(candidates).then((res) => {
      setHasVote(true);
      setLoading(false);
    });
  };

  return (
    <Layout>
      {!loading ? (
        !hasVote ? (
          <div>
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <h2 className="text-center pt-6 text-3xl font-bold">MPK</h2>
              {candidatesMpk.length > 0 ? (
                <div className="md:p-6 grid grid-cols-1 md:grid-cols-4 bg-white border-b border-gray-200">
                  {candidatesMpk.map((candidate) => {
                    return (
                      <div
                        className="h-full p-4"
                        key={candidate.id}
                        onClick={() => {
                          setSelectedMpk(candidate.id);
                        }}
                      >
                        <div
                          className={`border-2 hover:bg-indigo-100 border-gray-200 border-opacity-60 rounded-lg overflow-hidden ${
                            selectedMpk === candidate.id
                              ? "border-5 border-indigo-800 bg-indigo-50"
                              : ""
                          }`}
                        >
                          <img
                            className="lg:h-64 md:h-48 w-full h-full object-cover object-center"
                            src={candidate.image}
                            alt={candidate.name}
                          />
                          <div className="py-6 px-2 divide-solid divide-y-2">
                            <h1 className="title-font text-lg text-gray-900 pb-2 text-center font-bold">
                              {candidate.name}
                              <br />
                              <span className="font-normal text-sm">
                                {candidate.className}
                              </span>
                            </h1>
                            <p className="leading-relaxed pt-4 pb-2">
                              <b>Visi:</b>
                              <br />
                              {candidate.vision}
                            </p>
                            <p className="leading-relaxed pt-4">
                              <b>Misi:</b>
                              <br />
                              {candidate.mission}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex justify-center">
                  <Lottie
                    animationData={EmptyAnimation}
                    height={100}
                    width={100}
                    loop={true}
                    className="mt-3"
                  />
                </div>
              )}
              <h2 className="text-center pt-6 text-3xl font-bold">OSIS</h2>
              {candidatesOsis.length > 0 ? (
                <div className="md:p-6 grid grid-cols-1 md:grid-cols-4 bg-white border-b border-gray-200">
                  {candidatesOsis.map((candidate) => {
                    return (
                      <div
                        className="h-full p-4"
                        key={candidate.id}
                        onClick={() => {
                          setSelectedOsis(candidate.id);
                        }}
                      >
                        <div
                          className={`border-2 hover:bg-indigo-100 border-gray-200 border-opacity-60 rounded-lg overflow-hidden ${
                            selectedOsis === candidate.id
                              ? "border-5 border-indigo-800 bg-indigo-50"
                              : ""
                          }`}
                        >
                          <img
                            className="lg:h-64 md:h-48 w-full h-full object-cover object-center"
                            src={candidate.image}
                            alt={candidate.name}
                          />
                          <div className="py-6 px-2 divide-solid divide-y-2">
                            <h1 className="title-font text-lg text-gray-900 pb-2 text-center font-bold">
                              {candidate.name}
                              <br />
                              <span className="font-normal text-sm">
                                {candidate.className}
                              </span>
                            </h1>
                            <p className="leading-relaxed pt-4 pb-2">
                              <b>Visi:</b>
                              <br />
                              {candidate.vision}
                            </p>
                            <p className="leading-relaxed pt-4">
                              <b>Misi:</b>
                              <br />
                              {candidate.mission}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex justify-center">
                  <Lottie
                    animationData={EmptyAnimation}
                    height={100}
                    width={100}
                    loop={true}
                    className="mt-3"
                  />
                </div>
              )}
            </div>
            <div className="py-6 px-10">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="confirmed"
                    name="confirmed"
                    type="checkbox"
                    checked={confirmed}
                    className="focus:ring-indigo-500 h-6 w-6 text-indigo-600 border-gray-300 rounded"
                    onChange={(e) => setConfirmed(e.target.checked)}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="confirmed"
                    className="font-medium text-gray-700"
                  >
                    Dengan ini, saya <b>{user.name}</b> menyatakan pilihan saya
                    jujur tanpa ada paksaan dari pihak manapun dan telah
                    mengetahui bahwa pilihan saya tidak dapat diubah dengan
                    alasan apapun.
                  </label>
                </div>
              </div>
            </div>
            <div className="py-6">
              <button
                className={`w-full px-4 py-2 rounded-xl ${
                  selectedMpk === null || selectedOsis === null || !confirmed
                    ? "bg-gray-100 text-gray-400"
                    : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white"
                }`}
                disabled={
                  selectedMpk === null || selectedOsis === null || !confirmed
                }
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-col justify-center items-center mt-20">
            <h1 className="font-bold text-2xl text-center animate-bounce">
              You already voted!
            </h1>
            <div className="flex justify-center items-center">
              <Lottie
                animationData={DoneAnimation}
                height={50}
                width={50}
                loop={true}
              />
            </div>
          </div>
        )
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

export default Dashboard;
