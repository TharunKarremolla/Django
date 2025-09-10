import axios from "axios";
import { useNavigate  } from "react-router-dom";
import styles from "./Layout.module.css"
import React from "react";
import logout from './logout.png'
import { Link } from "react-router-dom";
import add from "./add.png";
import profile from "./profile.png";
import chat from "./chat.png";
import home from "./home.png";
import suitcase from './suitcase.png';


export default function Layout( {children , user}){
   
    const navigate = useNavigate()
 const handleLogout = async () => {

    try {
           const res = await axios.post(
        "http://127.0.0.1:8000/logout/",
        {},
        {
          withCredentials: true,
         
        }
      );

      console.log(res.data.message); // "Logged out successfully"
      navigate("/Login");
    } catch (error) {
      console.log("Logout error:", error.response?.data || error.message);
    };
}


    return (
        <div>
          <nav className={styles.navbar}>
                <h1 className={styles.appname}>LinkedIn</h1>
                
                 <div className={styles.links}>
                                <Link to="/home"><img src={home} alt="home icon" width="30" /></Link>
                                <Link to="/Jobs"><img src={suitcase} alt="jobs icon" width="30" /></Link>       
                             {user.is_staff && <Link to="/New_job"><img src={add} alt="add icon" width="30" /></Link>  }
                                <Link to="/Profile"><img src={profile} alt="profile icon" width="30" /></Link>  
                                <Link to='/Inbox' ><img src={chat} alt="chat icon" width={30} /></Link>
                              </div>
                <div className={styles.logout}>
                <a onClick={handleLogout}><img src={logout}  width={15}/>Logout</a>
                </div>
               
            </nav>
          
            {React.cloneElement(children , {user})}  
        </div>
    )
}