import axios from "axios";

export const api = axios.create({
  baseURL: "http://100.54.124.184:5000/api"  
});