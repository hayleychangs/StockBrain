import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";

import { collection, addDoc, query, getDocs, deleteDoc, doc, serverTimestamp, orderBy, where, onSnapshot } from "firebase/firestore";
import {db, auth} from "../../firebase/firebase";
import { onAuthStateChanged } from 'firebase/auth';

import MarketData from "./market.json";

import styles from "./calculator.module.css";

function Calculator () {

    const [purchasePrice, setPurchasePrice] = useState("");
    const [stopLossPoint, setStopLossPoint] = useState("");
    const [stopProfitPoint, setStopProfitPoint] = useState("");

    const [lossRatio, setLossRatio] = useState("");
    const [profitRatio, setProfitRatio] = useState("");
    const [RRRatio, setRRRatio] = useState("");

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

    //user狀態確認---------------------------
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
          if (user) {
            setUser(user);
          } else {
            setUser(null);
          }
        });
      
        return () => unsubscribe();
    }, []);
    //---------------------------------------


    //儲存及渲染---------------------------------
    const [data, setData] = useState(MarketData);
    const [stockName, setStockName] = useState("");

    let { stockId } = useParams();

    if (!stockId) {
        stockId = "2330";
    }
    function getStockName () {
        let result;

        if(stockId){
            result = data.filter((item) =>{
                return item.股票代碼.toString().includes(stockId)
            });
            setStockName(result[0].股票名稱);
        }
    }


    //state不同步解法
    useEffect(() => {
        if (purchasePrice !== "" && stopLossPoint !== "" && stopProfitPoint !== ""){
            getStockName();
                
            setRRRatio((stopProfitRatio / stopLossRatio).toFixed(2));
            if (purchasePrice > stopProfitPoint) {
                setLossRatio(stopLossRatio.toFixed(2));
                setProfitRatio(stopProfitRatio.toFixed(2));
            } else {
                setLossRatio(((stopLossPoint - purchasePrice) / purchasePrice * 100).toFixed(2));
                setProfitRatio(((purchasePrice -  stopProfitPoint) / purchasePrice * 100).toFixed(2));
            }
        }
        console.log("119-列印", stockName);
        console.log("120-列印RR", RRRatio);
        console.log("121-列印Loss", lossRatio);
        console.log("122-列印Profit", profitRatio);

    }, [purchasePrice, stopLossPoint, stopProfitPoint]);

    
    //save plan
    async function handleSave () {
        if (!user) {
            return;
        }
        
        if (purchasePrice !== "" && stopLossPoint !== "" && stopProfitPoint !== "") {
            try {
                const docRef = await addDoc(collection(db, "tradePlan"), {
                    stock_id: stockId,
                    stock_name: stockName,
                    purchase_price: purchasePrice,
                    stop_loss_point: stopLossPoint,
                    loss_ratio: lossRatio,
                    stop_profit_point: stopProfitPoint,
                    profit_ratio: profitRatio,
                    RR_ratio: RRRatio,
                    timestamp: serverTimestamp(),
                    user_id: auth?.currentUser?.uid
                });
                setPurchasePrice("");
                setStopLossPoint("");
                setStopProfitPoint("");
                setLossRatio("");
                setProfitRatio("");
                setRRRatio("");
                console.log("Document written with ID: ", docRef.id);
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        }
    };
   
    //-------------------------------------

    return (
        <>
        <div className={styles.title}>風險報酬比試算</div>
        <div className={styles.tabs}>
            <input type="radio" name="tabs" id="tabone" value="tabone" onChange={handleTabChange} checked={tab === "tabone"} />
            <label className={styles.tabsLabel1} htmlFor="tabone" style={tab === "tabone" ? { backgroundColor: "#FFCCCC", color: "#F2666C" } : {}}>看 多</label>
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
                <div className={styles.buttonContainer}>
                    <button className={styles.clearBtn} onClick={handleClear}>清空</button>
                    {user ?
                        <button className={styles.saveBtn} onClick={handleSave}>儲存</button>
                        :
                        <button className={`${styles.saveBtn} ${styles["tipsForSavePlan"]}`}>儲存</button>
                    }
                </div>
            </div>
            


            <input type="radio" name="tabs" id="tabtwo" value="tabtwo" onChange={handleTabChange}/>
            <label className={styles.tabsLabel} htmlFor="tabtwo" style={tab === "tabtwo" ? {backgroundColor: "#CDE6C7", color: "#68BE8D" } : {}}>看 空</label>
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
                <div className={styles.buttonContainer}>
                    <button className={styles.clearBtn} onClick={handleClear}>清空</button>
                    {user ?
                        <button className={styles.saveBtn} onClick={handleSave}>儲存</button>
                        :
                        <button className={`${styles.saveBtn} ${styles["tipsForSavePlan"]}`}>儲存</button>
                    }
                </div>
            </div>
        </div>
        </>
    )
}

export default Calculator;