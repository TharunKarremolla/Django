import { useEffect, useState } from "react"
import axios from "axios"
import styles from './Inbox.module.css';
import { Link } from "react-router-dom";

export default function Inbox(){
    const [search,setSearch] = useState('')
    const [users,setUsers] = useState([])
    const [current_user,setCurrentUser] = useState('')
   

    const sortedUsers = [...users].sort(
  (a, b) => new Date(b.timestamp) - new Date(a.timestamp) // latest first
);
console.log('sorted : ',sortedUsers)
    const fetch_users = async() => {
        const res = await axios.get("http://127.0.0.1:8000/all_users/",{params : {search : search}})
            console.log(res.data)        
         setUsers(res.data.users)
         setCurrentUser(res.data.current_user)
    }

    useEffect (() =>
    {
  fetch_users();
    },[search]);
  
   const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);


    return (
        <div className={styles.inboxDiv}>
            <h1>Messages</h1>
           <input className ={styles.inputname} type="search" placeholder="search..." value={search} onChange={(e) => setSearch(e.target.value)} ></input>
           <div>
           {sortedUsers.map((user) => (
            <div className={styles.selectUser}>
            <img style = {{'borderRadius' : '50%', 'marginRight' : '15px'}} src={`http://127.0.0.1:8000/${user.pic}`} width={50}  height={50} />
            <div className={styles.nametime}>
            <Link className={styles.links} to='/Message' state={{ user : user, current_user : current_user }} key = {user.id}><strong style = {{'display' : 'inline'}} key={user.id} >{capitalize(user.username)}</strong></Link>
            <span style={{'fontSize' : '12px'}}>{user.month} {user.day}</span>
            </div>
          </div>
          ) )
        
          }

           </div>
            
        </div>
    )
}