import { createContext, useState ,useEffect} from "react";
import axios from "axios";

let userContext = createContext();

let UserProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user,setUser] = useState({username:"",email:"",role:"",id:"",mobile:"",img:""})
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const userDetails = await axios.get(
        "http://localhost:3000/users/user-info",
        {
          withCredentials: true,
        }
      );
      setUser(userDetails.data);
      return;
    } catch (error) {
       if (error.response?.status === 401) {
      // Token expired or no token: this is normal, not an error
      console.log("No valid user session.");
      setUser({ username: "", email: "", role: "", id: "", mobile: "" });
      return;
    }
      return;
    }finally{
        setLoading(false)
    }
  };
  return (
    <userContext.Provider value={{ user, setUser,fetchUser,loading,setLoading}}>
      {children}
    </userContext.Provider>
  );
};

export { userContext, UserProvider };
