import axios from "axios"
import { useEffect, useState } from "react"
import upload from './upload.png';
import styles from './profile.module.css';
import Cookies from 'js-cookie';
import edit from './edit.png'

axios.defaults.withCredentials = true;

export default function Profile() {
  const [data, setData] = useState({});
  const [bio, setBio] = useState('');
  const [file, setFile] = useState(null); 
  const [preview, setPreview] = useState(null); 
  const [profilePic, setProfilePic] = useState(null); 


  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);

    if (selected) {
      setPreview(URL.createObjectURL(selected));
    }
  };

  // fetch user data
const fetch_user = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/user/");
      setData(res.data.user);
      setBio(res.data.profile[0].bio)
      setProfilePic(res.data.profile[0].pic)
      if (res.data.profile_pic) {
        console.log("profile already set")
        setProfilePic(res.data.profile_pic); 
      }
      
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetch_user();
  }, []);

  // upload file
  const handleUpload = async () => {
    await getCSRFToken();
    const csrfToken = Cookies.get("csrftoken");

    if (!file) {
      alert("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const res = await axios.post("http://127.0.0.1:8000/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": csrfToken,
        },
        withCredentials: true,
      });

  
      setProfilePic(res.data.profile); // update with uploaded pic path
      alert("Profile picture uploaded!");
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const addBio = async() => {
    await getCSRFToken();
    const csrfToken = Cookies.get('csrftoken')
    const res = await axios.post("http://127.0.0.1:8000/addBio/",{bio},{
      withCredentials : true,
      headers : {
          "Content-Type" : "application/json",
            "X-CSRFToken": csrfToken,
      }
    })
    
  }



  // get csrf token
  const getCSRFToken = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/csrf/");
      console.log("csrf :", res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.profDiv}>
      {/* Profile Picture Section */}
<div style={{ textAlign: "center", marginBottom: "20px" }}>

  <img
    src={ `http://127.0.0.1:8000/media/${profilePic}` }
    alt="Profile"
    style={{
      width: "150px",
      height: "150px",
      borderRadius: "50%",
      objectFit: "cover",
      border: "2px solid #ddd"
    }}
  />
</div>


      <input type="text" value={data.username || ""} readOnly />
      <br />
      <input type="text" value={data.email || ""} readOnly />
      <br />
      <input
        type="text"
        placeholder="Bio..."
        value={bio || ""}
        onChange={(e) => setBio(e.target.value)}
      />
      <br />
      <button onClick={addBio} className={styles.editBtn}>Edit Bio</button>
      <br />
    <label htmlFor="upload" style={{cursor : 'pointer'}} >
      <img src={edit} width={60} alt="Upload"></img>
      </label>
      <input type="file" id='upload' onChange={handleFileChange} style={{ display : 'none'}} />
      <br />
      <button onClick={handleUpload}>Save</button>
    </div>
  );
}
