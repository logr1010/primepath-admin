import axios from "axios";

export let _localStorage = {};

export const updateLocalStorage = async (data) => {
  // UPDATE LOCAL STORAGE

  _localStorage = data;

  if (localStorage) {
    localStorage.removeItem("pp_admin");
    window.location.replace("/");
  }
};

// RETURN TOKEN ACCORDING TO CURRENT PANEL USER
const returnToken = () => {
  let token = localStorage.getItem("pp_admin");

  token = token ? JSON.parse(token) : null;
  return token?.pp_admin?.id;
};

export const baseUrl = "https://api.primepathlogistics.in/api/";
// export const baseUrl = `http://192.168.1.41:3100/api/`;

// INTERCEPTORS FOR REQUESTS

axios.interceptors.request.use(
  function (config) {
    config.headers.Authorization = returnToken();
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export const post = async (url, data) => {
  try {
    const res = await axios.post(baseUrl + url, data);
    console.log(res)
    return { statusCode: res?.status, data: res?.data };
  } catch (e) {
    if (e?.response?.data?.error?.statusCode === 401 || e?.response?.status===401) {
      updateLocalStorage();
    }
    return {
      statusCode: e?.response?.data?.error?.statusCode || 404,
      message:
        e?.response?.data === undefined
          ? e?.message
          : e?.response?.data?.error?.message,
    };
  }
};

export const patch = async (url, data) => {
  try {
    const res = await axios.patch(baseUrl + url, data);
    return { statusCode: res?.status, data: res?.data };
  } catch (e) {
    if (e?.response?.data?.error?.statusCode === 401 || e?.response?.status===401) {
      updateLocalStorage();
    }
    return {
      statusCode: e?.response?.data?.error?.statusCode || 404,
      message:
        e?.response?.data === undefined
          ? e?.message
          : e?.response?.data?.error?.message,
    };
  }
};

export const get = async (url) => {
  try {

    const res = await axios.get(baseUrl + url);
    return { statusCode: res?.status, data: res?.data };
  } catch (err) {
    console.log(err)
    if (err?.response?.data?.error?.statusCode === 401 || err?.response?.status===401) {
      updateLocalStorage();
    }
  }
};

export const deletethis = async (url) => {
  try {
    const res = await axios.delete(baseUrl + url);
    return { statusCode: res?.status, data: res?.data };
  } catch (err) {
    if (err?.response?.data?.error?.statusCode === 401 || err?.response?.status===401) {
      updateLocalStorage();
    }
  }
};

export const yyyymmdd = (date) => {
  const _date = {
    y: new Date(date).getFullYear(),
    m:
      new Date(date).getMonth() + 1 < 10
        ? `0${new Date(date).getMonth() + 1}`
        : new Date(date).getMonth(),
    d:
      new Date(date).getDate() < 10
        ? `0${new Date(date).getDate()}`
        : new Date(date).getDate(),
  };

  return `${_date.y}-${_date.m}-${_date.d}`;
};
