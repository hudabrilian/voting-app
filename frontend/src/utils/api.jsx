import axios from "axios";

const BASE_URL = "http://localhost:8000";
const API_URL = `${BASE_URL}/api`;

const getCSRF = () => {
  return axios.get(`${BASE_URL}/sanctum/csrf-cookie`);
};

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete instance.defaults.headers.common.Authorization;
    }
    return config;
  },

  (error) => Promise.reject(error)
);

export const getUserDetails = async () => {
  return await getCSRF().then(() => {
    return instance.get(`auth/user`);
  });
};

export const loginUser = async (req) => {
  return await getCSRF().then(() => {
    return instance.post(`auth/login`, req);
  });
};

export const logoutUser = async (req) => {
  return await getCSRF().then(() => {
    return instance.post(`auth/logout`, req, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  });
};

//? Users
export const getUsers = async (url = null) => {
  return await getCSRF().then(() => {
    return instance.get(url ? url.url : "users");
  });
};

export const getUser = async (id) => {
  return await getCSRF().then(() => {
    return instance.get(`users/${id}`);
  });
};

export const saveUser = async (user) => {
  return await getCSRF().then(() => {
    return instance.post(`users`, user);
  });
};

export const updateUser = async (user) => {
  return await getCSRF().then(() => {
    return instance.put(`users/${user.id}`, user);
  });
};

export const deleteUser = async (id) => {
  return await getCSRF().then(() => {
    return instance.delete(`users/${id}`);
  });
};

//? Candidates
export const getCandidates = async (url = null) => {
  return await getCSRF().then(() => {
    return instance.get(url ? url.url : "candidates");
  });
};

export const getCandidate = async (id) => {
  return await getCSRF().then(() => {
    return instance.get(`candidates/${id}`);
  });
};

export const saveCandidate = async (candidate) => {
  return await getCSRF().then(() => {
    return instance.post(`candidates`, candidate);
  });
};

export const updateCandidate = async (candidate, id) => {
  return await getCSRF().then(() => {
    return instance.post(`candidates/${id}`, candidate);
  });
};

export const deleteCandidate = async (id) => {
  return await getCSRF().then(() => {
    return instance.delete(`candidates/${id}`);
  });
};

export const getAllCandidates = async () => {
  return await getCSRF().then(() => {
    return instance.get(`candidatesAll`);
  });
};

export const voteCandidate = async (candidates) => {
  return await getCSRF().then(() => {
    return instance.post(`vote`, candidates);
  });
};
