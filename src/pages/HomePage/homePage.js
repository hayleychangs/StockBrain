import React from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "../components/auth";

import styles from "./homePage.module.css";


function HomeCard() {

    const navigate = useNavigate();
    
    function handleSignIn() {
      navigate("/auth");
    }

    function handleNavToHome() {
        navigate("/");
        console.log("click")
    }

    return (
        <>
            <div className={styles.textContainer}>
                <nav className={styles.navContainer}>
                    <div className={styles.navItem} onClick={handleNavToHome}>首頁</div>
                    <div className={styles.navItem}>聯絡我們</div>
                    <div className={styles.navItem}>FAQ</div>
                </nav>
                <div className={styles.card}>
                    <h1 className={styles.title}>StockBrain</h1>
                    <p className={styles.text}>StockBrain是你投資的大腦，一個實用且易於使用的工具。<br/>提供K線圖、市場資訊、風報比試算以及方便的紀錄功能，<br/>讓你快速了解市場動態，及時捕捉交易想法，實現更高的投資回報。</p>
                    <div className={styles.btnContainer}>
                        <button className={styles.loginBtn} onClick={handleSignIn}>開始使用 →</button>
                        {/* <div className={styles.signUp}>註冊帳戶</div> */}
                    </div>
                </div>
                
            </div>
            <div className={styles.svgContainer}>
                <svg width="100%" height="120vh" viewBox="0 0 1920 1000" preserveAspectRatio="xMidYMid meet">
                    <path className={styles.curve}
                        d="M0 1920 
                        C-185 520,240 520, 360 600
                        S600 480, 720 600 
                        S960 620, 1080 400
                        S1440 680, 1920 200
                        V1920 Z"

                        strokeWidth="5"
                        fill="rgba(146,205,250)"
                    />
                </svg>
            </div>
      </>
    );
}

function HomePage () {
    
    return (
        <>
            <HomeCard />
        </>
    );
}

export default HomePage;