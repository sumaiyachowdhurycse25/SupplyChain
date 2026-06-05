import axios from "axios";

export const api = axios.create({
  baseURL: "https://supplychain-khaki.vercel.app/api"
});