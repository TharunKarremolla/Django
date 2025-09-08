import { useState, useEffect } from "react";
import axios from 'axios';
import styles from "./Jobs.module.css";
import Cookies from 'js-cookie';

export default function Jobs(){
    const [jobs,setJobs] = useState([])
    const [applied,setApplied] = useState([])
    const [click,setClick] = useState(false)

    const alreadyApplied = (isApplied) =>{
        setClick(isApplied)
    }

    const fetch_jobs = async () =>{
        const res = await axios.get("http://127.0.0.1:8000/fetch_jobs")
        
        setJobs(res.data.jobs)
    }

    useEffect(() => {
 fetch_jobs();
 applied_jobs();
    },[]);

    const applyForJobs = async(jobId) => {

        try{
        getCSRFToken();
        const csrfToken = Cookies.get("csrftoken")
        const res = await axios.post('http://127.0.0.1:8000/apply/',{jobId},{
            withCredentials : true,
            headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken, // if using Django session auth
        },
        })
        console.log(res.data)
        setApplied(res.data.applied)
       
        // const exists = applied.includes()
    }catch(error){
        console.log("error occurred : ",error)
    }
    }

    const applied_jobs = async() => {
        const res = await axios.get('http://127.0.0.1:8000/applied/')
        setApplied(res.data.applied)
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
        <div className={styles.jobsDiv}>
       
        
        <ul>
        {jobs.map(job => {
            const isApplied = applied.some(item => item.job_id === job.id);
            
            return (
           <li key={job.id} className={styles.card}>
                <h3>{job.title}</h3>
                <p>Company : {job.company}</p>
                <p>Description : {job.description}</p>
                <p>Salary : ${job.salary}</p>
                <p>{job.loxation}</p>
                {/* { (click&&isApplied)  && <p >Already Applied.</p> } */}
               <button className={isApplied ? styles.appliedBtn : styles.applyBtn} onClick={() => !isApplied && applyForJobs(job.id)} disabled = {isApplied}>{isApplied ? "Applied" : "Apply" }</button>
            </li>
            ) })
}     
        </ul>
        </div>        
    )
}