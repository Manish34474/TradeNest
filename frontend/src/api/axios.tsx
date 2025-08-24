import axios from "axios";

const baseURL = "http://localhost:5000";

export default axios.create({
  baseURL: `${baseURL}/api/v1`,
});

export const axiosPrivate = axios.create({
  baseURL: `${baseURL}/api/v1`,
  headers: { "Content-Type": "application/json" },
});
