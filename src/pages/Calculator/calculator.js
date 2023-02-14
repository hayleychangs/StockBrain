import React, {useState} from "react";

import styles from "./calculator.module.css";

function Calculator () {
    console.log("計算機")

    const [purchasePrice, setPurchasePrice] = useState("");
    const [stopLossPoint, setStopLossPoint] = useState("");
    const [stopProfitPoint, setStopProfitPoint] = useState("");

    const [tab, setTab] = useState("tabone");

    const handleTabChange = (e) => {
        setTab(e.target.value);
        handleClear();
    };

    const stopLossRatio = purchasePrice && stopLossPoint ? (purchasePrice - stopLossPoint) / purchasePrice * 100 : null;
    const stopProfitRatio = purchasePrice && stopProfitPoint ? (stopProfitPoint - purchasePrice) / purchasePrice * 100 : null;

    const handlePurchasePriceChange = (e) => {
        setPurchasePrice(e.target.value);
        console.log(e.target.value)

    };

    const handleStopLossPointChange = (e) => {
        setStopLossPoint(e.target.value);
        console.log(e.target.value)
    };

    const handleStopProfitPointChange = (e) => {
        setStopProfitPoint(e.target.value);
        console.log(e.target.value)
    };

    const handleClear = () => {
        setPurchasePrice("");
        setStopLossPoint("");
        setStopProfitPoint("");
    };

    return (
        <div className={styles.tabs}>
            <input type="radio" name="tabs" id="tabone" value="tabone" onChange={handleTabChange} checked={tab === "tabone"} />
            <label className={styles.tabsLabel1} htmlFor="tabone" style={tab === "tabone" ? { backgroundColor: "#FFCCCC", color: "red" } : {}}>看 多</label>
            <div  className={styles.tab}>
                <div className={styles.row}>
                    <div className={styles.inputBox}>
                        <div className={styles.rowItem}>
                            <div>買 進 價 位 </div>
                            <input className={styles.purchasePrice} value={purchasePrice} onChange={handlePurchasePriceChange}></input>
                        </div>
                        <div className={styles.rowItem}>
                            <div>預計停損點</div>
                            <input className={styles.stopLossPoint} value={stopLossPoint} onChange={handleStopLossPointChange}></input>
                        </div>
                        <div className={styles.rowItem}>
                            <div>預計停利點</div>
                            <input className={styles.stopProfitPoint} value={stopProfitPoint} onChange={handleStopProfitPointChange}></input>
                        </div>
                    </div>
                    <div className={styles.resultBox}>
                        <div className={styles.subRow}>
                            <div>風 險 報 酬 比</div>
                            <div className={styles.RRRatio}>{stopLossRatio && stopProfitRatio ? `${(stopProfitRatio / stopLossRatio).toFixed(2)}` : ""}</div>
                        </div>
                        <div className={styles.subRow}>
                            <div>預計停損幅度</div>
                            <div className={styles.stopLossRatio}>{purchasePrice && stopLossPoint ? `${((purchasePrice - stopLossPoint) / purchasePrice * 100).toFixed(2)}%` : ""}</div>
                        </div>
                        <div className={styles.subRow}>
                            <div>預計停利幅度</div>
                            <div className={styles.stopProfitRatio}>{purchasePrice && stopProfitPoint ? `${((stopProfitPoint - purchasePrice) / purchasePrice * 100).toFixed(2)}%` : ""}</div>
                        </div>
                    </div>
                </div>
                <button className={styles.clearBtn} onClick={handleClear}>清空</button>
            </div>
            


            <input type="radio" name="tabs" id="tabtwo" value="tabtwo" onChange={handleTabChange}/>
            <label className={styles.tabsLabel} htmlFor="tabtwo" style={tab === "tabtwo" ? {backgroundColor: "#CBE3BB", color: "green" } : {}}>看 空</label>
            <div  className={styles.tab}>
                <div className={styles.row}>
                    <div className={styles.inputBox}>
                        <div className={styles.rowItem}>
                            <div>買 進 價 位 </div>
                            <input className={styles.purchasePrice} value={purchasePrice}  onChange={handlePurchasePriceChange}></input>
                        </div>
                        <div className={styles.rowItem}>
                            <div>預計停損點</div>
                            <input className={styles.stopLossPoint} value={stopLossPoint} onChange={handleStopLossPointChange}></input>
                        </div>
                        <div className={styles.rowItem}>
                            <div>預計停利點</div>
                            <input className={styles.stopProfitPoint} value={stopProfitPoint} onChange={handleStopProfitPointChange}></input>
                        </div>
                    </div>
                    <div className={styles.resultBox}>
                        <div className={styles.subRow}>
                            <div>風 險 報 酬 比</div>
                            <div className={styles.RRRatio}>{stopLossRatio && stopProfitRatio ? `${(stopProfitRatio / stopLossRatio).toFixed(2)}` : ""}</div>
                        </div>
                        <div className={styles.subRow}>
                            <div>預計停損幅度</div>
                            <div className={styles.stopLossRatio}>{purchasePrice && stopLossPoint ? `${((stopLossPoint - purchasePrice) / purchasePrice * 100).toFixed(2)}%` : ""}</div>
                        </div>
                        <div className={styles.subRow}>
                            <div>預計停利幅度</div>
                            <div className={styles.stopProfitRatio}>{purchasePrice && stopProfitPoint ? `${((purchasePrice -  stopProfitPoint) / purchasePrice * 100).toFixed(2)}%` : ""}</div>
                        </div>
                    </div>
                </div>
                <button className={styles.clearBtn} onClick={handleClear}>清空</button>
            </div>
        </div>
    )
}

export default Calculator;