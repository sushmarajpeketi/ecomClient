import { createContext, useState } from "react";


let userContext = createContext()

let UserProvider = ({children}) =>{
    const [user,setUser] = useState({username:"",email:""})
    return (
        <userContext.Provider value={{user,setUser}}>
            {children}
        </userContext.Provider>
    )
}

export {userContext,UserProvider}
