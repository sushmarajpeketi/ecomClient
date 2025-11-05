import { createContext, useState, useEffect, useRef } from "react";
import axios from "axios";
// import { setupAuthInterceptor } from "../interceptors/AuthInterceptor";

export const userContext = createContext();

export const UserProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // ✅ logout function used by interceptor
  const logout = () => {
    axios
      .get("http://localhost:3000/users/logout", { withCredentials: true })
      .catch(() => {})
      .finally(() => {
        setUser(null);
        window.location.href = "/sign-in";
      });
  };

  // ✅ Setup interceptor ONLY once
  // const interceptorAdded = useRef(false);

  // useEffect(() => {
  //   if (!interceptorAdded.current) {
  //     setupAuthInterceptor(logout);  // ✅ only runs once
  //     interceptorAdded.current = true;
  //   }
  // }, []);

  // ✅ Fetch user on load
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/users/user-info",
        { withCredentials: true }
      );

      setUser(res.data);
      return;
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("Session expired or not logged in.");
        setUser(null);
        return;
      }

      console.error("Fetch user failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <userContext.Provider value={{ user, setUser, fetchUser, loading, logout }}>
      {children}
    </userContext.Provider>
  );
};
