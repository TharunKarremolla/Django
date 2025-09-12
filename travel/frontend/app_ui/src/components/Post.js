import axios from "axios";
import Cookies from 'js-cookie';
import { useState, useEffect, use } from "react";
import imageicon from './imageicon.png';


export default function Post(){
    const [feed,setFeed] = useState('')
    const [caption,setCaption] = useState('')


    const handleFileChange = (e) => {
  setFeed(e.target.files[0]); 
};

    const handleSubmit = async() =>{
    await getCSRFToken();
    const csrfToken = Cookies.get('csrftoken')

    //   if (!feed) {
    //   alert("Please select an image first");
    //   return;
    // }

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
        setCaption('')
     
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
         <div
           style={{
             position: "fixed",
             top: "0",
             left: "0",
             width: "100%",
             height: "100%",
            backgroundColor: "rgba(0,0,0,0.6)",
             display: "flex",
            justifyContent: "center",
             alignItems: "center",
             zIndex: 1000,
           }}
         >
           <div
             style={{
               width: "500px",
               background: "white",
               borderRadius: "10px",
               padding: "20px",
              display: "flex",
               flexDirection: "column",
            }}
           >
            <h3>Create a post  </h3>
            
             <textarea
               rows="6"
               value={caption}
              onChange={(e) => setCaption(e.target.value)}
               placeholder="What do you want to talk about?"
               style={{
                 marginTop: "10px",
                 padding: "10px",
                borderRadius: "8px",
                 border: "1px solid #ccc",
                 resize: "none",
              }}
             />
             <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "15px" }}>
              <div>
              <label htmlFor="file-upload"  style={{ cursor: "pointer" }}>
                <img src = {imageicon} width={40} alt="Upload" style={{ width: "30px", height: "30px" }}/>
              </label>
              <input type="file" id='file-upload'  style={{ display: "none" }}  onChange={handleFileChange}/>

               {/* <div style={{ marginTop: "10px" }}>
          <img src={feed.name} alt="Preview" style={{ width: "100px", borderRadius: "8px" }} />
        </div> */}
              </div>
             
               <button
                 // onClick={handleClose}
                style={{
                  marginRight: "10px",
                   padding: "8px 14px",
                   borderRadius: "6px",
                   border: "none",
                   background: "#eee",
                   cursor: "pointer",
                 }}
              >
                 Cancel
               </button>
               <button
                 onClick={handleSubmit}
                 style={{
                   padding: "8px 14px",
                   borderRadius: "6px",
                  border: "none",
                   background: "#0a66c2",
                   color: "white",
                   cursor: "pointer",
                 }}
               >
                 Post
               </button>
             </div>
           </div>
         </div>
       

    )
}