import { useLocation } from "react-router-dom";
import { useState,useEffect } from "react";
import styles from "./Message.module.css";
import Cookies from 'js-cookie';
import axios from "axios";
import { useRef } from "react";

export default function Message() {
    const [message,setMessage] = useState('')
    const location = useLocation();
    const { user,current_user } = location.state || {};
    const [old_msgs,setOldMsgs] = useState([])
    console.log(user,current_user)
   

    const display_Msgs = async() => {
        const res = await axios.get('http://127.0.0.1:8000/display_Msgs/',{ params : {receiver : user.id}})

        setOldMsgs(res.data.output)
    }
   useEffect(() => {
    display_Msgs(); 

    const interval = setInterval(() => {
      display_Msgs(); // fetch every 3 seconds
    }, 3000);

    return () => clearInterval(interval); // cleanup
  }, [user.id]);

    const handleSend = async(receiver) => {
        if (message.trim() === ""){
            return;
        }
        try {
        await get_csrf();
        const csrfToken = Cookies.get('csrftoken')
        const res = await axios.post("http://127.0.0.1:8000/send_message/",{receiver,message},{
           withCredentials : true,
                    headers : {
                        "Content-Type" : "application/json",
                        "X-CSRFToken": csrfToken,
                    }
        } )
        display_Msgs();
        setMessage("")
    }catch(error){
        console.log("errorrr : ",error)
    }}

     const get_csrf = async () => {
            try{
            const res = await axios.get('http://127.0.0.1:8000/csrf/',{
                withCredentials : true
            })
            Cookies.set("csrftoken", res.data.csrfToken);
        console.log("CSRF set:", res.data.csrfToken);
        
        }catch(error){
            console.log("csrf error" , error)

        }}

        const handleChange = async(e) =>{
            setMessage(e.target.value)

        }
        const messagesEndRef = useRef(null);

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [old_msgs]);

    return (
    <div className={styles.msgsDiv}>
     
        {user ? (
            <>
            <h2 style = {{'padding':'30px'}}>{user.username}</h2>
            <h2>{user.bio}</h2>
            </> ) : (
                <>
                <p>No user data</p>
                </>
            )
          }

          {old_msgs && <ul>{old_msgs.map((msg) => (
            <div key = {msg.id} >
                <li className={styles.time}>{msg.timestamp.slice(11,16)}</li>
            <li className={`${current_user === msg.sender_id ? styles.sender : styles.receiver}`}>{msg.message}</li>
            
            
            </div>
          ))}</ul>

          }

          <div className={styles.sendDiv}>
          <input className={styles.inputmsg} type="text"  placeholder="send message" value={message} onChange={(e) => setMessage(e.target.value)} />
          <button  className={styles.sendButton} onClick={() => {handleSend(user.id); display_Msgs(user.id); }}>Send</button>
          </div>
    </div>
    )
}