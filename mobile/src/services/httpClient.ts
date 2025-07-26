import axios from "axios";

export const httpClient = axios.create({
  baseURL: "https://70ccx9c2v5.execute-api.us-east-1.amazonaws.com",
});
