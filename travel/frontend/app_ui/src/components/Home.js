import axios from 'axios';
import styles from './Home.module.css'; 
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';

export default function Home( {user}) {
  const [posts,setPosts] = useState([])
  const navigate = useNavigate()
  console.log("user : ",user.id)

const handlePost = () => {
  navigate("/Post")
}

const getPosts = async() => {
  const res = await axios.get('http://127.0.0.1:8000/get_posts/')
setPosts(res.data.posts)
}

useEffect(() => {
  getPosts();
},[])

  if (!user) {
    return <h1 className={styles.loading}>LinkedIn</h1>;
  }

  return (
    <div className={styles.home_page}>
      <h1 style={{'textAlign': 'center'}}>Welcome {user}!</h1>
    
      <div className={styles.divs}>
        <div>

        </div>
        <ul>
          {posts.map((post) => (
            <div key ={post.id} className={styles.PostCard}>
             <div className={styles.profileCard}>
            <img className={styles.profile} src={`http://127.0.0.1:8000/${post.profile_pic}`}  width={100}/> <span>{post.username}</span>
            </div>
            <p>{post.caption}</p>
            <div className={styles.Post}>
            <li><img  className={styles.image} src={`http://127.0.0.1:8000/${post.feed}`} alt='posted' ></img></li>
            </div>
           </div>
          )
  )
        }
        </ul>
        </div>
        <button onClick={handlePost}>Post</button>
        </div>
   
  );
}
