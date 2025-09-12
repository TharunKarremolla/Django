import axios from "axios";
import Cookies from 'js-cookie';
import { useState, useEffect } from "react";
import styles from "./JobDetails.module.css";
import { useLocation } from "react-router-dom";

export default function JobDetails(props){
        const location = useLocation();
        const [Job,setJob] = useState([])
        const [applied,setApplied] = useState(false)
  

       const applyForJobs = async(jobId) => {

        try{
        getCSRFToken();
        const csrfToken = Cookies.get("csrftoken")
        const res = await axios.post('http://127.0.0.1:8000/apply/',{jobId},{
            withCredentials : true,
            headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken, 
        },
        })
        setApplied(res.data.applied)
        }catch(error){
        console.log("error occurred : ",error)
    }
    }

        const fetch_job = async () => {
            console.log('props',props.JobId)
            const res = await axios.get("http://127.0.0.1:8000/fetch_jobs",{params : {jobid : props.JobId}})
      
            setJob(res.data.jobs)
            setApplied(res.data.is_applied)
        }


      useEffect(() => {
 fetch_job();

   },[props.JobId]);

    const getCSRFToken = async()=>{

        try {
        const res = await axios.get('http://127.0.0.1:8000/csrf/')
        Cookies.set("csrftoken",res.data.csrfToken)
    }catch(error){
        console.log(error)
    }
}
    if (!Job) {
    return <p>Loading...</p>; 
  }
    return (
        <div className={styles.jobDiv}>
            { Job && <>
            <h2>{Job[0]?.title}</h2>
            <p>Company : {Job[0]?.company}</p>
             
                <p>Salary : {Job[0]?.salary}</p>
                  <p>Location : {Job[0]?.location}</p>
                  </>}
           <button onClick={() => applyForJobs(Job[0].id)} className={applied ? styles.appliedBtn : styles.applyBtn} disabled={applied}>{ applied ? "Applied" : "Apply"} </button>
           <button className={styles.saveBtn}>Save</button>
               <h2>About the Job</h2> 
            <p>{Job[0]?.description}</p>
        </div>

        
     
    )
}