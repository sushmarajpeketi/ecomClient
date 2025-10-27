import { createContext, useState ,useEffect} from "react";
import axios from "axios";
import { toast } from "react-toastify";

let userContext = createContext();

let UserProvider = ({ children }) => {
    const [user,setUser] = useState({username:"",email:"",role:"",id:"",mobile:""})
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
 
      toast.error(error.message);
      return;
    }
  };
  return (
    <userContext.Provider value={{ user, setUser, refreshUser:fetchUser }}>
      {children}
    </userContext.Provider>
  );
};

export { userContext, UserProvider };
