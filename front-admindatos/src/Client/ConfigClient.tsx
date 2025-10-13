import axios from "axios";

const client = axios.create({
  baseURL: "https://localhost:7206",
  headers: {
    "Content-Type": "application/json",
  },
});

export default client;
