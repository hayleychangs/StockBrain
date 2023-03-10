import React from "react";
import { Link } from "react-router-dom";

import styles from "./noData.module.css";

function NoData () {

    return(
        <div className={styles.noDataCard}>
            <div className={styles.text}>咦？居然找不到資料！是不是這個股票太低調了呢？換個股票試試吧！</div>
            <div className={styles.semiGroup}>
                <div className={styles.groupTitle}>半導體相關個股</div>
                <div className={styles.stocks}>
                    <div className={styles.stockLink}>
                        <Link to="/home/2330">台積電</Link>
                    </div>
                    <div className={styles.stockLink}>
                        <Link to="/home/2454">聯發科</Link>
                    </div>
                    <div className={styles.stockLink}>
                        <Link to="/home/3034">聯詠</Link>
                    </div>
                    <div className={styles.stockLink}>
                        <Link to="/home/2379">瑞昱</Link>
                    </div>

                </div>
            </div>
            <div className={styles.ecGroup}>
                <div className={styles.groupTitle}>電子零組件相關個股</div>
                <div className={styles.stocks}>
                    <div className={styles.stockLink}>
                        <Link to="/home/2317">鴻海</Link>
                    </div>
                    <div className={styles.stockLink}>
                        <Link to="/home/2382">廣達</Link>
                    </div>
                    <div className={styles.stockLink}>
                        <Link to="/home/2308">台達電</Link>
                    </div>
                    <div className={styles.stockLink}>
                        <Link to="/home/3008">大立光</Link>
                    </div>
                </div>
            </div>
            <div className={styles.financeGroup}>
                <div className={styles.groupTitle}>金融相關個股</div>
                <div className={styles.stocks}>
                    <div className={styles.stockLink}>
                        <Link to="/home/2881">富邦金</Link>
                    </div>
                    <div className={styles.stockLink}>
                        <Link to="/home/2882">國泰金</Link>
                    </div>
                    <div className={styles.stockLink}>
                        <Link to="/home/2890">永豐金</Link>
                    </div>
                    <div className={styles.stockLink}>
                        <Link to="/home/2884">玉山金</Link>
                    </div>
                </div>
            </div>
            <div className={styles.rawGroup}>
                <div className={styles.groupTitle}>原物料相關個股</div>
                <div className={styles.stocks}>
                    <div className={styles.stockLink}>
                        <Link to="/home/1301">台塑</Link>
                    </div>
                    <div className={styles.stockLink}>
                        <Link to="/home/1303">南亞</Link>
                    </div>
                    <div className={styles.stockLink}>
                        <Link to="/home/1101">台泥</Link>
                    </div>
                    <div className={styles.stockLink}>
                        <Link to="/home/2002">中鋼</Link>
                    </div>
                </div>
            </div>
            <div className={styles.telecomGroup}>
                <div className={styles.groupTitle}>電信相關個股</div>
                <div className={styles.stocks}>
                    <div className={styles.stockLink}>
                        <Link to="/home/2412">中華電</Link>
                    </div>
                    <div className={styles.stockLink}>
                        <Link to="/home/4904">遠傳</Link>
                    </div>
                    <div className={styles.stockLink}>
                        <Link to="/home/3045">台灣大</Link>
                    </div>
                </div>
            </div>
            <div className={styles.topicGroup}>
                <div className={styles.groupTitle}>其它題材個股</div>
                <div className={styles.stocks}>
                    <div className={styles.stockLink}>
                        <Link to="/home/2618">長榮航</Link>
                    </div>
                    <div className={styles.stockLink}>
                        <Link to="/home/2912">統一超</Link>
                    </div>
                    <div className={styles.stockLink}>
                        <Link to="/home/3443">創意</Link>
                    </div>
                    <div className={styles.stockLink}>
                        <Link to="/home/2353">宏碁</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default NoData;