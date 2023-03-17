import  React from "react";
import { Link } from "react-router-dom";

import HomeNavigation from "../../components/homeNavigation/HomeNavigation";

import styles from "./about.module.css";

import { motion } from "framer-motion";

import candleChart from "../../images/candleChart.gif";
import note from "../../images/note.gif";
import plan from "../../images/plan.gif";

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
    };

    return (
        <div>
            <div className={styles.textContainer}>
                <HomeNavigation />
            </div>
            <motion.div 
                variants={variants} 
                initial="hidden" 
                animate="visible"
                mode="wait"
                className={styles.introContainer}
            >
                <div className={styles.introCandleChart}>
                    <div className={styles.candleChartTextBox}>
                        <div className={styles.candleChartText}>
                            <h2 className={styles.candleChartTextTitle}>簡單純淨的K線圖</h2>
                            <p>在投資市場有無數的數據和資訊需要追蹤，</p>
                            <p>如何才能關閉市場噪音，不再被市場情緒波動左右?</p>
                            <p>有了<Link className={styles.brand} to="/home">StockBrain</Link>，您可以使用一個簡單純淨的K線圖，</p>
                            <p>幫助您關注真正重要的事情： 價格 和 交易量 !</p>
                        </div>
                    </div>
                    <div className={styles.candleChartGifBox}>
                        <img className={styles.candleChart} src={candleChart} alt="candleChart"></img>
                    </div>
                </div>
                <div className={styles.introNote}>
                    <div className={styles.noteGifBox}>
                        <img className={styles.note} src={note} alt="note"></img>
                    </div>
                    <div className={styles.noteTextBox}>
                        <div className={styles.noteText}>
                            <h2 className={styles.noteTextTitle}>方便的紀錄功能</h2>
                            <p>將有興趣的股票加入追蹤，及時捕捉交易想法及心情，</p>
                            <p>4種背景顏色選擇、可編輯以及刪除功能。</p>
                        </div>
                    </div>  
                </div>
                <div className={styles.introPlan}>
                    <div className={styles.planTextBox}>
                        <div className={styles.planText}>
                            <h2 className={styles.planTextTitle}>風險報酬比試算</h2>
                            <p>應用風報比試算器平衡風險和回報比例，建立一個紀律的交易計畫，</p>
                            <p>只要按下儲存，<Link className={styles.brand} to="/home">StockBrain</Link>幫您紀錄。</p>
                            <p>點擊股票代號或風險報酬比欄位，排序您的交易計畫，</p>
                            <p>點擊單筆交易計畫可以查看該個股的K線圖。</p>
                            <br/>
                            <p className={styles.annotation}>*風險報酬比是什麼? 就是最大報酬和最大虧損的比率，換句話說，你每冒險投資1元可帶來多少潛在報酬。優秀的交易者會尋找最高的潛在上行空間，以及最低的潛在下行空間,十分謹慎地選擇交易機會，用「風險報酬比」決定是否進行交易，是很好的選擇。</p>
                        </div>
                    </div>
                    <div className={styles.planGifBox}>
                        <img className={styles.plan} src={plan} alt="plan"></img>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
export default About;