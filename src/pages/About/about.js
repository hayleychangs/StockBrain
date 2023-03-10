import  React from "react";
import { Link } from "react-router-dom";

import styles from "./about.module.css";

import { motion } from "framer-motion";

import { TfiHandPointLeft } from "react-icons/tfi";

function About () {
    const variants = {
        visible: {
          opacity: 1,
          x: 0,
          transition: { duration: 1.2 }
        },
        hidden: {
          opacity: 0,
          x: -50
        }
    }

    return (
        <div>
            <div className={styles.textContainer}>
                <nav className={styles.navContainer}>
                        <div className={styles.navItem}><Link to="/">首頁</Link></div>
                        <div className={styles.navItem}><Link to="/about">關於我們</Link></div>
                        <div className={styles.navItem}><Link to="/contact">聯絡我們</Link></div>
                </nav>
                <motion.div 
                    className={styles.text}
                    variants={variants} 
                    initial="hidden" 
                    animate="visible"
                    mode="wait"
                >
                    <p>在投資市場有無數的數據和資訊需要追蹤，如何才能關閉市場噪音，不再被市場情緒波動左右?</p>
                    <p>有了<Link className={styles.brand} to="/home">StockBrain</Link>，您可以使用一個簡單純淨的K線圖，幫助您關注真正重要的事情： 價格 和 交易量 !</p>
                    <p>應用風報比試算器平衡風險和回報比例，建立一個紀律的交易計畫，只要按下儲存，<Link className={styles.brand} to="/home">StockBrain</Link>幫您紀錄。</p>
                    <p>有了<Link className={styles.brand} to="/home">StockBrain</Link>，您可以培養一個穩定獲利的投資大腦，還在等什麼呢？立即嘗試<Link className={styles.brand} to="/home">StockBrain</Link>！<TfiHandPointLeft className={styles.hand} size={20}/></p>
                </motion.div>
            </div>
            <div className={styles.svgContainer}>
                <svg width="100%" height="120vh" viewBox="0 0 1920 1000" preserveAspectRatio="xMidYMid meet">
                    <path className={styles.curve}
                        d="M0 1920 
                        C-185 520,240 520, 360 700
                        S500 500, 720 600 
                        S960 420, 1080 700
                        S1340 200, 1920 650
                        V1920 Z"

                        strokeWidth="5"
                        fill="rgba(146,205,250)"
                    />
                </svg>
            </div>
        </div>
    )
}

export default About;