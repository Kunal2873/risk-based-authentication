import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

export const startTransaction = async (data) => {
  return axios.post(`${BASE_URL}/transaction`, data);
};

export const saveTransaction = async (data) => {
  return axios.post(`${BASE_URL}/transaction/save`, data);
};

export const verifyStep = async (data) => {
  return axios.post(`${BASE_URL}/auth/verify`, data);
};
