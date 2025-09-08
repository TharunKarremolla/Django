import { Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function ProtectedRoute({ children }) {
  const [authData, setAuthData] = useState({isAuth : null, user : null});
  
  console.log("authdata : ",authData)
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/verify/",
          { withCredentials: true }
        );

        if (res.data.authenticated) {
          setAuthData({isAuth : true, user : res.data.username});
          console.log("Verify response1:",  res.data);

        } else {
          setAuthData({isAuth : false, user : res.data.username});
        }
      } catch (error) {
        setAuthData({isAuth : false, user : null}); // 401 or network error → not authenticated
      }
    };

    verifyUser();
  }, []);

  if (authData.isAuth === null) {
    return <h1 style={{ 'color': '#0077B5','marginLeft' : '43%', 'marginTop' : '20%'}}>LinkedIn...</h1>; // loading screen
  }

  return authData.isAuth ? React.cloneElement(children, {user : authData.user }) : <Navigate to="/Login" replace />;
}
