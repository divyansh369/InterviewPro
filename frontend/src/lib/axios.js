import axios from "axios";

/** 
 * *INFO: withcredentials:true 
 * * because ---  by adding this field browser will send the cookies automatically on every single req to the server ie. automatically 
 * * send the cookie via the http header
 *
*/
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true, 
});
