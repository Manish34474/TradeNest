import axios from "axios";

const baseURL = "http://localhost:5000";

export default axios.create({
  baseURL: `${baseURL}/ssa/api/v1`,
});
