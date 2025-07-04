import axios from 'axios';

const BASE_API = process.env.NEXT_PUBLIC_BASE_API || "http://localhost:8080/api/v1";
const BASE_SOCKET = process.env.NEXT_PUBLIC_BASE_SOCKET || "ws://localhost:8088";

export const API = axios.create({
  baseURL: BASE_API,
  withCredentials: true
});

export { BASE_API, BASE_SOCKET };