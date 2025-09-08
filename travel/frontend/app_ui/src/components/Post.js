import axios from "axios";
import Cookies from 'js-cookie';
import { useState, useEffect, use } from "react";
import styles from './Post.module.css';

export default function Post(){
    const [created_at,setCreatedAt] = useState('')
    const [feed,setFeed] = useState('')
    const [created_by_id,setCreatedById] = useState('')
    const [caption,setCaption] = useState('')

    const handleFileChange = (e) => {
  setFeed(e.target.files[0]); // actual File object
};

    const create_post = async() =>{
    await getCSRFToken();
    const csrfToken = Cookies.get('csrftoken')

      if (!feed) {
      alert("Please select an image first");
      return;
    }

     const formData = new FormData();
    formData.append("Picture", feed);
    formData.append('Caption',caption);

    try{
    const res = await axios.post('http://127.0.0.1:8000/Create_post/',formData,{
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": csrfToken,
        },
        withCredentials: true,
      });
     console.log(res.data)
  }catch(error){
    console.log('error : ',error)
  }
}

        const getCSRFToken = async()=>{
  
          try {
          const res = await axios.get('http://127.0.0.1:8000/csrf/')
          Cookies.set("csrftoken",res.data.csrfToken)
          console.log("csrf jnds : " , res.data)
      }catch(error){
          console.log(error)
      }
  }
    return (
        <div>
        <h1>Create Post</h1>
        <input className={styles.inputs} type="file" placeholder=""   onChange={handleFileChange}/><br/>
        <input className={styles.inputs} type="text" placeholder="caption"  value={caption}  onChange={(e) => setCaption(e.target.value) } /><br></br>    
       <button onClick={create_post}>Post</button>
        </div>

    )
}