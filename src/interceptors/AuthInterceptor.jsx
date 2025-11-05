import axios from "axios";
import { toast } from "react-toastify";

let isLoggingOut = false;
let interceptorRegistered = false;   // ✅ prevents duplicate interceptors

export const setupAuthInterceptor = (logout) => {
  if (interceptorRegistered) return;
  interceptorRegistered = true;

  axios.interceptors.response.use(
    (res) => res,
    (err) => {
      const status = err.response?.status;
      const code = err.response?.data?.code;

      // ✅ Handle expired/invalid token only once
      if (
        (status === 401 || code === "TOKEN_EXPIRED" || code === "TOKEN_INVALID") &&
        !isLoggingOut
      ) {
        isLoggingOut = true;

        toast.error("Session expired. Please sign in again.");

        logout();  
      }

      return Promise.reject(err);
    }
  );
};
