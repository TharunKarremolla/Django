import { useState, useEffect } from "react";
import styles from './Home.module.css';

import Jobs from "./Jobs";
import Inbox from "./Inbox";

export default function Home( {user}) {
  
console.log("username : ", user)
  if (!user) {
    return <h1>Loading...</h1>;
  }


  return (
    <div className={styles.home_page}>
      {/* <h1>Welcome {user}!</h1> */}
      <div className={styles.divs}>
      
          <Jobs />
        </div>
        </div>
   
  );
}
