import React from "react";
import { useNavigate } from "react-router-dom";

import { auth } from "../../firebase/firebase";
import { signOut } from "firebase/auth";

import styles from "./header.module.css";

function Header(){

    const navigate = useNavigate();

    //sign out
    const logOut = async () => {
        try{
            await signOut(auth);
            navigate("/");
            console.log("登出成功")
        }catch (error){
            console.log(error);
        }
    };

    return (
        <div className={styles.header}>
            <div className={styles.headerContent}>
                <a href="/home">
                    <h2 className={styles.theme}>StockBrain</h2>
                </a>
                <nav>
                    <div className={styles.navItem} onClick={logOut}>登出</div>
                </nav>
            </div>
        </div>
    )
}

export default Header;