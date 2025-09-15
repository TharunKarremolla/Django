import { Link } from "react-router-dom";
import styles from "./Main.module.css";


 function Main(){
    
    return (
        <div>
            <nav className={styles.navBar}>
                    <h1 className={styles.header}>LinkedIn</h1>
                    
            </nav>
             <div className={styles.mainDiv}>
                <h1>Welcome to LinkedIn</h1>
                <p>New User ? <Link to ='/Account'>Create Account</Link> </p>
                <p>Existing User ? <Link to ='/Login'>Login</Link> </p>
            </div>
        </div>
    )
}

function Block1(){
    return  ( <nav className={styles.navBar}>
                    <h1 className={styles.header}>LinkedIn</h1>
                    
            </nav>
    )
}

Main.Block1  = Block1

export default Main;