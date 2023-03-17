import React from "react";
import { useNavigate, Link } from "react-router-dom";

import styles from "./homeNavigation.module.css";

function HomeNavigation () {

    const navigate = useNavigate();

    function handleNavToHome () {
        navigate("/");
    };

    return (
        <>
        <nav className={styles.navContainer}>
            <div className={styles.logo} onClick={handleNavToHome}>StockBrain</div>
            <div className={styles.navItem}><Link to="/">首頁</Link></div>
            <div className={styles.navItem}><Link to="/about">關於我們</Link></div>
            <div className={styles.navItem}><Link to="/contact">聯絡我們</Link></div>
        </nav>
      </>
    );
  }
  
  export default HomeNavigation;