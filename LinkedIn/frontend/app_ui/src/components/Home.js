import axios from 'axios';
import styles from './Home.module.css'; 
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import like from './like.png';
import comment from './comment.png';
import repeat from './repeat.png';
import send from './send.png';
import Post from './Post';
export default function Home( {user}) {
  const [posts,setPosts] = useState([])
  const [show, setShow] = useState(false)
  const [current_user,setCurrentUser] = useState([])
  const navigate = useNavigate()


const getPosts = async() => {
  const res = await axios.get('https://django-6-0st0.onrender.com/get_posts/')
setPosts(res.data.posts)
setCurrentUser(res.data.current_user)

}

useEffect(() => {
  getPosts();
},[])

const handleBack = () => {
  console.log("ajsfdj")
}

  if (!user) {
    return <h1 className={styles.loading}>LinkedIn</h1>;
  }

  return (
    <div className={styles.main}>
      
       <div className={styles.mainheader}>
 
            {current_user?.length > 0  && (<img style={{'borderRadius' : '50%'}} src={`http://127.0.0.1:8000/media/${current_user[0].pic}`}  alt='profile' width={50} height={50}/> )}
            <button className={styles.postInput} onClick={() => setShow(true)}><strong>Start a post</strong></button>
      
       
     {show &&  <><Post /></>}
      

        </div>
      <div className={styles.divs}>
       
        <ul>
          {posts.map((post) => (
            <div key ={post.id} className={post.feed ? styles.PostImage : styles.PostThoughts}>
             <div className={styles.profileCard}>
            <img className={styles.profile} src={`http://127.0.0.1:8000/${post.profile_pic}`}  width={100}/> 
            
            <div>
            <span  style={{'fontWeight' : '500'}} >{post.username}</span>
            <br></br>
            <span style={{'color' : 'gray', 'fontSize' : '12px'}}>{post.created_at}</span>
            </div>
            </div>
            
            <p  style={{'margin-left' : '10px'}}>{post.caption}</p>
            <div className={styles.Post}>
        {post.feed &&     <li><img  className={styles.image} src={`http://127.0.0.1:8000/${post.feed}`} alt='posted' ></img></li>}
             
            </div>
            
            <div className={styles.icons} >
              <p className={styles.icon}><img  src={like} width={15}/><span>Like</span></p>
               <p className={styles.icon}><img src={comment} width={20}/><span>comment</span></p>
              <p className={styles.icon}><img src={repeat} width={20}/><span>Repost</span></p>
               <p className={styles.icon}><img src={send} width={15}/><span>Send</span></p>
          </div>
           </div>
          )
  )
        }
        </ul>
        </div>
   
        </div>
   
  );
}
