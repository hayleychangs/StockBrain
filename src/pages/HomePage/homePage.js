import React from "react";
import { useNavigate, Link } from "react-router-dom";

import styles from "./homePage.module.css";

import { motion } from "framer-motion";


function HomeCard() {

    const navigate = useNavigate();
    
    function handleNavToMain() {
      navigate("/home");
    }

    const variants = {
        visible: {
          opacity: 1,
          x: 0,
          transition: { duration: 1.5 }
        },
        hidden: {
          opacity: 0,
          x: -50
        }
    }

    return (
        <div
        >
            <div className={styles.textContainer}>
                <nav className={styles.navContainer}>
                    <div className={styles.navItem}><Link to="/">首頁</Link></div>
                    <div className={styles.navItem}><Link to="/about">關於我們</Link></div>
                    <div className={styles.navItem}><Link to="/contact">聯絡我們</Link></div>
                </nav>
                <motion.div 
                    className={styles.card}
                    variants={variants} 
                    initial="hidden" 
                    animate="visible"
                    mode="wait"
                >
                    <h1 className={styles.title}>StockBrain</h1>
                    <p className={styles.text}>StockBrain是你投資的大腦，一個實用且易於使用的工具。<br/>提供K線圖、市場資訊、風報比試算以及方便的紀錄功能，<br/>讓你快速了解市場動態，及時捕捉交易想法，實現更高的投資回報。</p>
                    <div className={styles.btnContainer}>
                        <button className={styles.loginBtn} onClick={handleNavToMain}>立即體驗</button>
                        {/* <div className={styles.signUp}>註冊帳戶</div> */}
                        <div>
                            <p className={styles.signUp}><Link to="/signup" style={{ color: "#0f73ee"}}>註冊</Link><span> ｜ </span><Link to="/login" style={{ color: "#0f73ee"}}>登入</Link></p>
                        </div>
                    </div>
                </motion.div>
                
            </div>
            <div className={styles.svgContainer}>
                <svg width="100%" height="120vh" viewBox="0 0 1920 1000" preserveAspectRatio="xMidYMid meet">
                    <path className={styles.curve}
                        d="M0 1920 
                        C-185 520,240 620, 360 800
                        S600 480, 820 650 
                        S960 620, 1080 500
                        S1440 880, 1920 300
                        V1920 Z"

                        strokeWidth="5"
                        fill="rgba(146,205,250)"
                    />
                </svg>
            </div>
        </div>
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