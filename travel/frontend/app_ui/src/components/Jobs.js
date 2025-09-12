import { useState, useEffect } from "react";
import axios from 'axios';
import styles from "./Jobs.module.css";
import { Link } from 'react-router-dom';
import JobDetails from "./JobDetails";
export default function Jobs(){
    const [jobs,setJobs] = useState([])
    const [JobId,setJobID] = useState(null)
    
    const fetch_jobs = async () =>{
        const res = await axios.get("http://127.0.0.1:8000/fetch_jobs") 
        setJobs(res.data.jobs)
    }

useEffect(() => {
 fetch_jobs();
    },[]);


return (
        <div className={styles.jobsDiv}>
              <nav style={{textAlign : 'center',position : 'fixed',
           borderBottom : '1px solid #ccc',
                 borderRight : '1px solid #ccc',
             backgroundColor : '#ffffff',
                    fontSize : '30px',                  
                     width : '37%',
                     height : '100px',
                    display: 'flex',
                    justifyContent : 'center',
                    alignItems : 'center',
                    paddingBottom : '10px'
                     }}>
                    Top Job Picks For You</nav>
            <div className={styles.leftDiv}>
              
                    <ul>
                    {jobs.map(job => {
                        return (
                    <li key={job.id} className={styles.card}>
                            <button className={styles.joblink} onClick={() => setJobID(job.id)} >  <h3>{job.title}</h3>
                            <p>{job.company}</p></button>   
                        </li>
                        ) })
            }     
                    </ul>
        </div>
        <div className={styles.rightDiv}>
        <JobDetails JobId = {JobId}/>
        </div>
        </div>        
    )
}