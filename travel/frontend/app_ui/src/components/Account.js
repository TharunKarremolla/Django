import { useState, useEffect } from "react";
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import styles from './Account.module.css'

axios.defaults.withCredentials = true; 

export default function Account({ children }){
    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')
    const [email,setEmail] = useState('')
    const [is_recruiter,setRecruiter] = useState(false)
 
    
    const navigate = useNavigate();
    

    const handSubmit = async () => {
        await get_csrf()
        const csrfToken =  Cookies.get('csrftoken')
        console.log(csrfToken)

        try {
        const res = await axios.post("http://127.0.0.1:8000/create_acc/",
            {username,email,password,is_recruiter},
            {
                withCredentials : true,
                headers : {
                    "Content-Type" : "application/json",
                     "X-CSRFToken": csrfToken,

                }
            }
        )
        console.log("Created Account with status :" , res.status)
        navigate("/Login")


    }
    catch(error){
        console.log("error occurred : ",error)
    }
    }

    const get_csrf = async () => {
        try{
        const res = await axios.get("http://127.0.0.1:8000/csrf/",{
            withCredentials : true
        })
          Cookies.set("csrftoken", res.data.csrfToken);
    console.log("CSRF set:", res.data.csrfToken);
    }catch(error){
        console.log("csrf error" , error)

    }}

    useEffect(() => {
        get_csrf();
    },[]);

    return (
        <div>
            {children }
            <div className={styles.accDiv}>
                <h1>Create Account</h1>
                <input  className={styles.inputs} type="text" placeholder="username" value={username}  onChange={(e) => setUsername(e.target.value) }/><br/>
                <input   className={styles.inputs} type="email" placeholder="email" value={email}  onChange={(e) => setEmail(e.target.value) } /><br></br>
                <input  className={styles.inputs} type="password" placeholder="password"  value={password}  onChange={(e) => setPassword(e.target.value) } /><br></br>
                <div className={styles.checkbox}>
                
                    <label>Recruiter</label>
                    <input  className={styles.check} type="checkbox"  onChange={(e) =>setRecruiter(e.target.checked) }></input><br></br>
                
                </div>
                <button className={styles.submitBtn} onClick={handSubmit} disabled={!username || !email || !password}>Submit</button>
            </div>
        
       
        </div>
    )
}