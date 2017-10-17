import axios from "axios";
import Cookie from "js-cookie";
import { API_BASE_URL } from '../config'; //TODO change import depending on node environment dev/prod



export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {'X-CSRFToken': Cookie.get('csrftoken')} // token from server
});

export default api;
