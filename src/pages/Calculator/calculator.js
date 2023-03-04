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

    const [RRRatio, setRRRatio] = useState("");

    const [tab, setTab] = useState("tabone");

    const handleTabChange = (e) => {
        setTab(e.target.value);
        handleClear();
    };

    let stopLossRatio;
    let stopProfitRatio;
    if ( purchasePrice > stopLossPoint) {
        stopLossRatio = purchasePrice && stopLossPoint ? (purchasePrice - stopLossPoint) / purchasePrice * 100 : null;
        stopProfitRatio = purchasePrice && stopProfitPoint ? (stopProfitPoint - purchasePrice) / purchasePrice * 100 : null;
    } else{
        stopLossRatio = purchasePrice && stopLossPoint ? (stopLossPoint - purchasePrice) / purchasePrice * 100 : null;
        stopProfitRatio = purchasePrice && stopProfitPoint ? (purchasePrice -  stopProfitPoint) / purchasePrice * 100 : null;
    }
    

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
        setErrorMessage("");
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
        }

    }, [purchasePrice, stopLossPoint, stopProfitPoint]);

    const [errorMessage, setErrorMessage] = useState("");
    
    //save plan
    async function handleSaveLong () {
        if (!user) {
            return;
        }
        
        let purchasePriceNum = parseFloat(purchasePrice);
        let stopLossPointNum = parseFloat(stopLossPoint);
        let stopProfitPointNum = parseFloat(stopProfitPoint);

        if (purchasePriceNum < 0 || stopLossPointNum < 0 || stopProfitPointNum  < 0) {
            setErrorMessage("[看多] 輸入值需大於0。");
            return;
        }else if (stopLossPointNum > purchasePriceNum) {
            setErrorMessage("[看多] 停損點須小於進場價，請重新輸入。");
            return;
        } else if ( stopProfitPointNum <= purchasePriceNum) {
            setErrorMessage("[看多] 停利點須大於進場價，請重新輸入。");
            return;
        } else if (!purchasePriceNum || !stopLossPointNum || !stopProfitPointNum) {
            setErrorMessage("[看多] 請輸入完整試算條件。");
            return;
        }

        let stopLossRatio;
        let stopProfitRatio;
        if ( purchasePriceNum < stopLossPointNum) {
            stopLossRatio = purchasePriceNum && stopLossPointNum ? (purchasePriceNum - stopLossPointNum) / purchasePriceNum * 100 : null;
            stopProfitRatio = purchasePriceNum && stopProfitPointNum ? (purchasePriceNum - stopProfitPointNum) / purchasePriceNum * 100  : null;;
        } 
        if ( purchasePriceNum > stopLossPointNum ) {
            stopLossRatio = purchasePriceNum && stopLossPointNum  ? (stopLossPointNum  - purchasePriceNum) / purchasePriceNum * 100 : null;
            stopProfitRatio = purchasePriceNum && stopProfitPointNum ? (purchasePriceNum -  stopProfitPointNum) / purchasePriceNum * -100 : null;
        }
        if (purchasePrice !== "" && stopLossPoint !== "" && stopProfitPoint !== "") {
            try {
                const docRef = await addDoc(collection(db, "tradePlan"), {
                    stock_id: stockId,
                    stock_name: stockName,
                    purchase_price: purchasePrice,
                    stop_loss_point: stopLossPoint,
                    loss_ratio: stopLossRatio,
                    stop_profit_point: stopProfitPoint,
                    profit_ratio: stopProfitRatio,
                    RR_ratio: RRRatio,
                    timestamp: serverTimestamp(),
                    user_id: auth?.currentUser?.uid
                });
                setPurchasePrice("");
                setStopLossPoint("");
                setStopProfitPoint("");
                setRRRatio("");
                setErrorMessage("儲存成功，請至頁面下方查看交易計畫!");
                setTimeout(() => {
                    setErrorMessage("");
                  }, 2500);
                console.log("Document written with ID: ", docRef.id);
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        }
    };

    async function handleSaveShort () {
        if (!user) {
            return;
        }
        
        let purchasePriceNum = parseFloat(purchasePrice);
        let stopLossPointNum = parseFloat(stopLossPoint);
        let stopProfitPointNum = parseFloat(stopProfitPoint);

        if (purchasePriceNum < 0 || stopLossPointNum < 0 || stopProfitPointNum  < 0) {
            setErrorMessage("[看空] 輸入值需大於0。");
            return;
        }else if (stopLossPointNum < purchasePriceNum) {
            setErrorMessage("[看空] 停損點須大於進場價，請重新輸入。");
            return;
        } else if ( stopProfitPointNum >= purchasePriceNum) {
            setErrorMessage("[看空] 停利點須小於進場價，請重新輸入。");
            return;
        } else if (!purchasePriceNum || !stopLossPointNum || !stopProfitPointNum) {
            setErrorMessage("[看空] 請輸入完整試算條件。");
            return;
        } else if (purchasePriceNum < 0 || stopLossPointNum < 0 || stopProfitPointNum  < 0) {
            setErrorMessage("[看空] 輸入值需大於0。");
            return;
        }

        let stopLossRatio;
        let stopProfitRatio;
        if ( purchasePriceNum < stopLossPointNum) {
            stopLossRatio = purchasePriceNum && stopLossPointNum ? (purchasePriceNum - stopLossPointNum) / purchasePriceNum * 100 : null;
            stopProfitRatio = purchasePriceNum && stopProfitPointNum ? (purchasePriceNum - stopProfitPointNum) / purchasePriceNum * 100  : null;;
        } 
        if ( purchasePriceNum > stopLossPointNum ) {
            stopLossRatio = purchasePriceNum && stopLossPointNum  ? (stopLossPointNum  - purchasePriceNum) / purchasePriceNum * 100 : null;
            stopProfitRatio = purchasePriceNum && stopProfitPointNum ? (purchasePriceNum -  stopProfitPointNum) / purchasePriceNum * -100 : null;
        }
        if (purchasePrice !== "" && stopLossPoint !== "" && stopProfitPoint !== "") {
            try {
                const docRef = await addDoc(collection(db, "tradePlan"), {
                    stock_id: stockId,
                    stock_name: stockName,
                    purchase_price: purchasePrice,
                    stop_loss_point: stopLossPoint,
                    loss_ratio: stopLossRatio,
                    stop_profit_point: stopProfitPoint,
                    profit_ratio: stopProfitRatio,
                    RR_ratio: RRRatio,
                    timestamp: serverTimestamp(),
                    user_id: auth?.currentUser?.uid
                });
                setPurchasePrice("");
                setStopLossPoint("");
                setStopProfitPoint("");
                setRRRatio("");
                setErrorMessage("儲存成功，請至頁面下方查看交易計畫!");
                setTimeout(() => {
                    setErrorMessage("");
                }, 2500);
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
                            <div className={styles.RRRatio}>{purchasePrice && stopProfitPoint && purchasePrice == stopProfitPoint ? "0" : purchasePrice == stopLossPoint && (stopProfitPoint > purchasePrice || stopProfitPoint < purchasePrice) ? "0" : purchasePrice && !stopProfitPoint && stopLossPoint ? "0" : purchasePrice && stopProfitPoint && !stopLossPoint ? "0" : stopLossRatio | stopProfitRatio ? `${(stopProfitRatio / stopLossRatio).toFixed(2)}` : ""}</div>
                        </div>
                        <div className={styles.subRow}>
                            <div>預計停損幅度</div>
                            <div className={styles.stopLossRatio}>{purchasePrice && stopLossPoint ? `${((purchasePrice - stopLossPoint) / purchasePrice * -100).toFixed(2)}%` : ""}</div>
                        </div>
                        <div className={styles.subRow}>
                            <div>預計停利幅度</div>
                            <div className={styles.stopProfitRatio}>{purchasePrice && stopProfitPoint ? `${((stopProfitPoint - purchasePrice) / purchasePrice * 100).toFixed(2)}%` : ""}</div>
                        </div>
                    </div>
                </div>
                <div className={styles.errorMessage}>{errorMessage}</div>
                <div className={styles.buttonContainer}>
                    <button className={styles.clearBtn} onClick={handleClear}>清空</button>
                    {user ?
                        <button className={styles.saveBtn} onClick={handleSaveLong}>儲存</button>
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
                            <div>賣 出 價 位 </div>
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
                            <div className={styles.RRRatio}>{purchasePrice && stopLossPoint && purchasePrice == stopLossPoint ? "0" : purchasePrice == stopProfitPoint && (stopProfitPoint > purchasePrice || stopProfitPoint < purchasePrice) ? "0" : purchasePrice && !stopLossPoint && stopProfitPoint ? "0" : stopLossRatio | stopProfitRatio ? `${(stopProfitRatio / stopLossRatio).toFixed(2)}` : ""}</div>
                        </div>
                        <div className={styles.subRow}>
                            <div>預計停損幅度</div>
                            <div className={styles.stopLossRatio}>{purchasePrice && stopLossPoint ? `${((stopLossPoint - purchasePrice) / purchasePrice * -100).toFixed(2)}%` : ""}</div>
                        </div>
                        <div className={styles.subRow}>
                            <div>預計停利幅度</div>
                            <div className={styles.stopProfitRatio}>{purchasePrice && stopProfitPoint ? `${((purchasePrice -  stopProfitPoint) / purchasePrice * 100).toFixed(2)}%` : ""}</div>
                        </div>
                    </div>
                </div>
                <div className={styles.errorMessage}>{errorMessage}</div>
                <div className={styles.buttonContainer}>
                    <button className={styles.clearBtn} onClick={handleClear}>清空</button>
                    {user ?
                        <button className={styles.saveBtn} onClick={handleSaveShort}>儲存</button>
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