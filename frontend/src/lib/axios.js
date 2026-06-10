import axios from "axios";

/** 
 * *INFO: withcredentials:true 
 * * because ---  by adding this field browser will send the cookies automatically on every single req to the server ie. automatically 
 * * send the cookie via the http header
 *
*/
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // by adding this field browser will send the cookies to server automatically, on every single req
});
console.log(import.meta.env.VITE_API_URL);
export default axiosInstance;