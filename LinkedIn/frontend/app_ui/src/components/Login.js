import { useState } from "react";
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { Link } from "react-router-dom";

axios.defaults.withCredentials = true; 

export default function Login({children}){
    const [password,setPassword] = useState('')
    const [email,setEmail] = useState('')
    const navigate = useNavigate();
    const [Error,setError] = useState('')
    
    const handleLogin = async ()=>{
        await get_csrf()
        const csrfToken =  Cookies.get('csrftoken')
     
        try {
                const res = await axios.post('https://django-6-0st0.onrender.com/login/',{email, password},{
                    withCredentials : true,
                    headers : {
                        "Content-Type" : "application/json",
                        "X-CSRFToken": csrfToken,
                    }
                });
                console.log("Login successful");
                navigate("/Home")
            }
        catch(error){
              setError(error)
            console.log("error : ",error)
        }
    }

    const get_csrf = async () => {
            try{
            const res = await axios.get('https://django-6-0st0.onrender.com/csrf/',{
                withCredentials : true
            })
            Cookies.set("csrftoken", res.data.csrfToken);
      console.log("csrf ::",res.data.csrfToken)
        
        }catch(error){
            console.log("csrf error" , error)

        }
    }


    return (
        <div >
           {children}
           <div className={styles.container}>
                <h1 className={styles.header}>Login</h1>
                <input className={styles.inputs} type="text" placeholder="email or username" value={email}  onChange={(e) => setEmail(e.target.value) }/><br/>
                <input className={styles.inputs} type="password" placeholder="password"  value={password}  onChange={(e) => setPassword(e.target.value) } /><br></br>
               
                <button className = {styles.submitBtn} onClick={handleLogin}>Sign in</button><br></br><br></br>
                <span>Doesn't have Account ?</span>&nbsp;<Link to="/Account">Sign Up</Link>
            </div>
        </div>
    )
}
