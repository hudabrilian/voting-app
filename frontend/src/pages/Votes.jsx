import React, { useEffect, useState } from "react";
import { Layout } from "../sections/Layout";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { getVotes } from "../utils/api";
import Lottie from "lottie-react";
import LoadingAnimation from "../anims/loading.json";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Votes = () => {
  const [votesData, setVotesData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getVotes().then((res) => {
      if (mounted) {
        setVotesData(res.data);
        setLoading(false);
      }
    });

    return function cleanup() {
      mounted = false;
    };
  }, []);

  const optionsMpk = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "MPK Votes",
      },
    },
  };
  const optionsOsis = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "OSIS Votes",
      },
    },
  };
  const dataMpk = {
    labels: votesData.dataNameMpk,
    datasets: [
      {
        label: "votes",
        data: votesData.dataCountMpk,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  const dataOsis = {
    labels: votesData.dataNameOsis,
    datasets: [
      {
        label: "votes",
        data: votesData.dataCountOsis,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const getForPage = (e, link) => {
    e.preventDefault();
    if (!link.url || link.active) return;
    setLoading(true);
    getVotes(link).then((res) => {
      setVotesData(res.data);
      setLoading(false);
    });
  };

  return (
    <Layout>
      {!loading ? (
        <div className="mt-10 mx-10">
          <div className="flex flex-wrap justify-around my-4 text-center bg-white overflow-hidden shadow-md sm:rounded-lg">
            <div className="p-4 sm:w-1/4 w-1/2">
              <h2 className="title-font font-medium sm:text-4xl text-3xl text-gray-900">
                {votesData.userTotal}
              </h2>
              <p className="leading-relaxed">Users</p>
            </div>
            <div className="p-4 sm:w-1/4 w-1/2">
              <h2 className="title-font font-medium sm:text-4xl text-3xl text-gray-900">
                {votesData.userVoted}
              </h2>
              <p className="leading-relaxed">User voted</p>
            </div>
            <div className="p-4 sm:w-1/4 w-1/2">
              <h2 className="title-font font-medium sm:text-4xl text-3xl text-gray-900">
                {votesData.userNoVoted}
              </h2>
              <p className="leading-relaxed">User not voted</p>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-md sm:rounded-lg p-5">
            <div className="flex divide-x-2 justify-between items-center">
              <div className="w-1/2 px-4">
                <Bar options={optionsMpk} data={dataMpk} />
              </div>
              <div className="w-1/2 px-4">
                <Bar options={optionsOsis} data={dataOsis} />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto shadow-md rounded-lg mt-10">
            <table className="min-w-full divide-y divide-gray-200">
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
                    Candidate MPK
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Candidate OSIS
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {votesData.votes.data &&
                  votesData.votes.data.map((vote) => {
                    return (
                      <tr className="hover:bg-slate-100" key={vote.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="ml-4">
                            <div className="text-sm">{vote.user}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="ml-4">
                            <div className="text-sm">{vote.candidateMpk}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="ml-4">
                            <div className="text-sm">{vote.candidateOsis}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="ml-4">
                            <div className="text-sm">{vote.time}</div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-5">
            <nav className="relative z-0 inline-flex justify-center rounded-md shadow-sm -space-x-px">
              {votesData.votes.meta.links.map((link, index) => {
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
                     index === votesData.votes.meta.links.length - 1
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
        </div>
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

export default Votes;
