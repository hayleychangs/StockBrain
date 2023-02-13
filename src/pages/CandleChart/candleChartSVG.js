import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { collection, addDoc, query, getDocs, deleteDoc, doc, serverTimestamp, orderBy, where } from "firebase/firestore";
import {db, auth} from "../../firebase/firebase";
import { onAuthStateChanged } from 'firebase/auth';

import styles from "./candleChartSVG.module.css";

// import add from "../images/add.png";

//redCandlestick
function redCandlestick(candleStick, candleData, maxPrice, multiplier){
    candleStick.high=40+(maxPrice-candleData.max)*multiplier;
    candleStick.high=parseFloat(candleStick.high.toFixed(2));
    candleStick.low=40+(maxPrice-candleData.min)*multiplier;
    candleStick.low=parseFloat(candleStick.low.toFixed(2));
    candleStick.open=40+(maxPrice-candleData.open)*multiplier;
    candleStick.open=parseFloat(candleStick.open.toFixed(2));
    candleStick.close=40+(maxPrice-candleData.close)*multiplier;
    candleStick.close=parseFloat(candleStick.close.toFixed(2));
    if (candleData.close<candleData.max && candleData.open<candleData.close){   
        candleStick.high=candleStick.high;
        candleStick.low=candleStick.low;
        candleStick.open=candleStick.low+(candleStick.close-candleStick.low)+(candleStick.open-candleStick.close);
        candleStick.close=candleStick.low+(candleStick.close-candleStick.low);
        candleStick.positive=1;
    }else if(candleData.close<candleData.max && candleData.open==candleData.min && candleData.open<candleData.close){
        candleStick.high=candleStick.high;
        candleStick.low=candleStick.low;
        candleStick.open=candleStick.low+(candleStick.high-candleStick.close);
        candleStick.close=candleStick.high;
        candleStick.positive=1;
    }else if(candleData.close==candleData.max && candleData.open<candleData.min){
        candleStick.high=candleStick.high;
        candleStick.low=candleStick.low;
        candleStick.open=candleStick.low;
        candleStick.close=candleStick.low+(candleStick.low-candleStick.open);
        candleStick.positive=1;
    }else if(candleData.close==candleData.max && candleData.open==candleData.close){
        candleStick.high=candleStick.high;
        candleStick.low=candleStick.low;
        candleStick.open=candleStick.close-1; //adjust for line
        candleStick.close=candleStick.close;
        candleStick.positive=0;
    }else if(candleData.close==candleData.max && candleData.open>candleData.min){
        candleStick.high=candleStick.high;
        candleStick.low=candleStick.low;
        candleStick.close=candleStick.high-(candleStick.close-candleStick.open);
        candleStick.open=candleStick.high;
        candleStick.positive=1;
    }else if(candleData.close==candleData.max && candleData.open==candleData.min){
        candleStick.high=candleStick.high;
        candleStick.low=candleStick.low;
        candleStick.open=candleStick.low; 
        candleStick.close=candleStick.high;
        candleStick.positive=1;
    }
    return candleStick;
}

//greenCandlestick
function greenCandlestick(candleStick, candleData, maxPrice, multiplier){
    candleStick.high=40+(maxPrice-candleData.max)*multiplier;
    candleStick.high=parseFloat(candleStick.high.toFixed(2));
    candleStick.low=40+(maxPrice-candleData.min)*multiplier;
    candleStick.low=parseFloat(candleStick.low.toFixed(2));
    candleStick.open=40+(maxPrice-candleData.open)*multiplier;
    candleStick.open=parseFloat(candleStick.open.toFixed(2));
    candleStick.close=40+(maxPrice-candleData.close)*multiplier;
    candleStick.close=parseFloat(candleStick.close.toFixed(2));
    if(candleData.close<candleData.max && candleData.close==candleData.min && candleData.open<candleData.max){
        candleStick.high=candleStick.high;
        candleStick.low=candleStick.low;
        candleStick.open=candleStick.open;
        candleStick.close=candleStick.low;
        candleStick.positive=2;
    }else if (candleData.open==candleData.max && candleData.close==candleData.min){
        candleStick.high=candleStick.high;
        candleStick.low=candleStick.low;
        candleStick.open=candleStick.high;
        candleStick.close=candleStick.low;
        candleStick.positive=2;
    }else if(candleData.close<candleData.max && candleData.close==candleData.min){
        candleStick.high=candleStick.high;
        candleStick.low=candleStick.low;
        candleStick.open=candleStick.low-(candleStick.open-candleStick.close);
        candleStick.close=candleStick.low;
        candleStick.positive=2;
    }
    else if(candleData.close<candleData.max && candleData.open>candleData.close){
        candleStick.high=candleStick.high;
        candleStick.low=candleStick.low;
        candleStick.open=candleStick.high-(candleStick.high-candleStick.open);
        candleStick.close=candleStick.high-(candleStick.high-candleStick.close);
        candleStick.positive=2;
    }else if(candleData.close<candleData.max && candleData.close==candleData.min && candleData.open>candleData.close){ //這段跟5好像重複
        candleStick.high=candleStick.high;
        candleStick.low=candleStick.low;
        candleStick.open=candleStick.high-(candleStick.open-candleStick.close);
        candleStick.close=candleStick.high;
        candleStick.positive=2;
    }
    return candleStick;
}

function CandleChartSVG ({data}) {

    if (!data.length) {
        return null;
    }

    //---------- init briefInfo value --------
    const [stockName ,setStockName] = useState(data[145].stock_name);
    const [stockId ,setStockId] = useState(data[145].stock_id);
    const [stockClose, setStockClose] = useState(data[145].close);
    const [stockChange, setStockChange] = useState(parseFloat((data[145].close-data[144].close).toFixed(2)));
    const [stockChangePercent, setStockChangePercent] = useState(parseFloat((data[145].spread/data[144].close*100).toFixed(2)));
    const [stockVolume, setStockVolume] = useState(parseInt(data[145].Trading_Volume/1000));
    const [stockAmount, setStockAmount] = useState((data[145].Trading_money/100000000).toFixed(2));
    const [stockDate ,setStockDate] = useState(data[145].date);

    useEffect(() => {
        setStockName(data[145].stock_name);
        setStockId(data[145].stock_id);
        setStockClose(data[145].close);
        setStockChange(parseFloat((data[145].close-data[144].close).toFixed(2)));
        setStockChangePercent(parseFloat((data[145].spread/data[144].close*100).toFixed(2)));
        setStockVolume(data[145].Trading_Volume/1000);
        setStockAmount((data[145].Trading_money/100000000).toFixed(2));
        setStockDate(data[145].date);
    },[data]);

    const handleMouseMove = (event, i) => {
        // access the data using data[i]
        setStockClose(data[i].close);
        setStockChange(parseFloat((data[145].close-data[144].close).toFixed(2)));
        setStockChangePercent(parseFloat((((data[i].close-data[i-1].close)/data[i-1].close)*100).toFixed(2)));
        setStockVolume(parseInt(data[i].Trading_Volume/1000));
        setStockAmount((data[i].Trading_money/100000000).toFixed(2));
        setStockDate(data[i].date);
    };


    //horizontal line
    const priceLines = [];
    for (let i = 1; i < 9; i++) {
        const x1 = 100;
        const x2 = 1550;
        const y1 = 20;
        priceLines.push(
        <line
            key={i}
            x1={x1}
            y1={y1 + i * 40}
            x2={x2}
            y2={y1 + i * 40}
            stroke="rgb(190, 190, 190)"
            strokeWidth="0.5"
            strokeDasharray={i < 8 ? "2 2" : null}
        />
        );
    }

    const volLines = [];
    for (let i = 1; i < 4; i++) {
        const x1 = 100;
        const x2 = 1550;
        const y1 = 340 + i * 45;
        const stroke = "rgb(190, 190, 190)";
        const strokeWidth = 0.5;
        const strokeDasharray = "2 2";
        volLines.push(
            <line 
                key={i}
                x1={x1}
                x2={x2}
                y1={y1}
                y2={y1}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
            />
        );
    }

    //*DataCrafting
    const DataCrafting = (data) => {
        let dataArray=[];

        let stickEnd = { 
            high: 0,
            low: 0,
            open: 0,
            close: 0,
            positive: 0,
            vol:0
        }
            
        //get maxPrice, minPrice, maxVol, minVol and multiplier
        let originalData = data.slice(1);;

        let maxPrice = originalData.map((o) => o.max).reduce((a, b) => Math.max(a, b));
        let minPrice = originalData.map((o) => o.min).reduce((a, b) => Math.min(a, b));
        let maxVol = originalData.map((o) => o.Trading_Volume).reduce((a, b) => Math.max(a, b));
        let minVol = originalData.map((o) => o.Trading_Volume).reduce((a, b) => Math.min(a, b));
        maxVol=parseInt(maxVol/1000);
        minVol=parseInt(minVol/1000);

        let maxAndMinArray=[];
        let maxAndMin = { 
            maxPrice: maxPrice,
            minPrice: minPrice,
            maxVol: maxVol,
            minVol: minVol
        }
        maxAndMinArray.push(maxAndMin);

        let multiplier = Math.round((320-40)/(maxPrice-minPrice)*100)/100;
        multiplier = parseFloat(multiplier.toFixed(2));
        
        let inverse = Math.round((maxPrice-minPrice)/(340-20)*100)/100;
        inverse = parseFloat(inverse.toFixed(2));

        let volInverse = Math.round((maxVol-0)/(520-350)*100)/100;
        volInverse = parseFloat(volInverse.toFixed(2));

        //scale text of price
        const priceScale = [];
        const firstPriceScale = minPrice + (inverse*20);
        for (let i = 0 ; i < 8 ; i++){
            let pScale = firstPriceScale + (inverse*40*i);
            pScale = pScale.toFixed(2)
            priceScale.push(pScale)
        }

        //scale text of vol
        const volScale = [];
        for (let i = 1 ; i < 4 ; i++){
            let vScale = volInverse * 45 * i;
            vScale = parseInt(vScale.toFixed(2));
            volScale.push(vScale);
        }

        //candle relocate
        for (let i = 1
            ; i < data.length; i++) {
            
            let candleData = data[i];
          
            //data needed per candlestick
            let candleStick = { 
                high: 0,
                low: 0,
                open: 0,
                close: 0,
                positive: 0,
                vol:0
            }

            //relocate process
            if (candleData.close>candleData.open){
                redCandlestick(candleStick, candleData, maxPrice, multiplier);
            }else if(candleData.close==candleData.open){
                candleStick.high=40+(maxPrice-candleData.max)*multiplier;
                candleStick.high=parseFloat(candleStick.high.toFixed(2));
                candleStick.low=40+(maxPrice-candleData.min)*multiplier;
                candleStick.low=parseFloat(candleStick.low.toFixed(2));
                candleStick.open=40+(maxPrice-candleData.open)*multiplier;
                candleStick.open=parseFloat(candleStick.open.toFixed(2));
                candleStick.close=40+(maxPrice-candleData.close)*multiplier;
                candleStick.close=parseFloat(candleStick.close.toFixed(2));
                
                candleStick.high=candleStick.high;
                candleStick.low=candleStick.low;
                candleStick.open=candleStick.high-(candleStick.high-candleStick.close)-1;
                candleStick.close=candleStick.high-(candleStick.high-candleStick.close);
                candleStick.positive=0;
            }else{
                greenCandlestick(candleStick, candleData, maxPrice, multiplier);
            }

            //trade volume
            candleStick.vol=Math.floor(candleData.Trading_Volume/1000);

            dataArray.push(candleStick);
        }
        dataArray.push(stickEnd);
    
        return {dataArray, maxAndMinArray, priceScale, volScale}
    }
    const craftedData = DataCrafting(data).dataArray;
    const maxAndMinArray = DataCrafting(data).maxAndMinArray;
    const priceScale = DataCrafting(data).priceScale;
    const volScale =   DataCrafting(data).volScale;                                                                                                                            DataCrafting(data).volScale;


    //*build candlestick
    const BuildCandle = () => {
        let spacing = 5;
        let x = 52.5;
        let bottom=520;
        let dividingLine=350;
        let maxVol = maxAndMinArray[0].maxVol;
     
        //price scale
        let priceTextLeft = [];
        let priceTextRight = [];
    
        for (let i = 0; i <priceScale.length-1; i++) {
            let priceScaleData = priceScale[i];
            let x1;
            if (priceScale[6] < 100) {
                x1 = 65;
            } else {
                x1 = 58;
            }
            let x2 = 1555;
            let y = 305 - 40 * i;
    
            priceTextLeft.push(
                <text
                    key={i}
                    x={x1}
                    y={y}
                    fontSize="12"
                    fill="#8592A2"
                >
                    {priceScaleData}
                </text>
            );
    
            priceTextRight.push(
                <text
                    key={i + priceScale.length}
                    x={x2}
                    y={y}
                    fontSize="12"
                    fill="#8592A2"
                >
                    {priceScaleData}
                </text>
            );
        }

        //vol scale
        let volTextLeft = [];
        let volTextRight = [];
        for (let i = 0; i < volScale.length; i++) {
            let volScaleData = volScale[i];
            let x1;
            if(volScale[2]<1000){
                x1 = 60;
            }else if(volScale[2]<100){
                x1 = 70;
            }else if(volScale[2]>100000){
                x1 = 42;
            }else if(volScale[2]>10000){
                x1 = 50;
            }else{
                x1 = 50;
            }
            let x2 = 1555;
            let y = 479 - 45 * i;

            volTextLeft.push(
                <text
                    key={i+23}
                    x={x1}
                    y={y}
                    fontSize="12"
                    fill="#8592A2"
                >
                    {volScaleData + "張"}
                </text>
            );

            volTextRight.push(
                <text
                    key={i + volScale.length+23}
                    x={x2}
                    y={y}
                    fontSize="12"
                    fill="#8592A2"
                >
                    {volScaleData + "張"}
                </text>
            );
        }

        //candle&vol
        let candleStick = [];
        let tradeVol = [];
        for (let i=0,j=1; i < craftedData.length-1; i++,j++) {
            let candleData = craftedData[i];

            let color;
            if (candleData.positive === 1) {
                color = "#F44747";
            } else if (candleData.positive === 2) {
                color = "#18BF69";
            } else {
                color = "#8592A2";
            }

            candleStick.push(
                <g key={i+candleData.high} transform={`translate(${x})`} index={i} onMouseMove={(event) => handleMouseMove(event, i)}>
                    <path
                        stroke="#676767"
                        strokeWidth="1"
                        d={`M ${x},${candleData.high},${x},${candleData.low}`}
                    />
                    <path
                        stroke={color}
                        strokeWidth="5"
                        d={`M ${x},${candleData.open},${x},${candleData.close}`}
                    />
                </g>
            )
            
            tradeVol.push(
                <path
                    key={i+candleData.vol}
                    stroke={color}
                    strokeWidth="5"
                    transform={`translate(${x})`}
                    d={`M ${x},${Math.round(bottom - (candleData.vol / (maxVol / (bottom - dividingLine))))},${x},${bottom}`}
                />
            )
            
            x += spacing;
        }
        
    
        return [...priceTextLeft, ...priceTextRight, ...volTextLeft, ...volTextRight, ...candleStick, ...tradeVol];
    }
    

    //*加入追蹤功能-----------------------------------------------

    //user狀態確認並取得資料庫清單
    const [user, setUser] = useState(null);
    const [trackingList, setTrackingList] = useState([]);
    const [tracked, setTracked] = useState(false);

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

    //進入畫面就取得資料庫的追蹤清單
    const fetchList = async () => {
        if (!user) {
            return;
        }
        try {
            const listRef = collection(db, "trackingList");
            const q = query(listRef, where("userId", "==", user.uid));
            const data = await getDocs(q);
            const newData = data.docs.map((doc) => ({...doc.data(), id:doc.id }));
            setTrackingList(newData);
            console.log("列印data", data)
            console.log("列印newData", newData)
        } catch (error) {
            console.log(error);
        } 
        //finally{
            
        //     console.log("清單item", trackingList) //!空值
        //     console.log("資料股票ID", data[145].stock_id.toString())
        //     if (isStockIdExists) {
        //         setTracked(true);
        //         console.log("檢查text是否存在-true", isStockIdExists)
        //     }else {
        //         setTracked(false);
        //         console.log("檢查text是否存在-false", isStockIdExists)
        //     }
        //     console.log("追蹤清單", trackingList);
        // }
    };

    useEffect(()=>{
        fetchList();
    }, [user]);

    //追蹤狀態判斷，判斷是否有該值
    const isStockIdExists = trackingList.some(item => item.text === data[145].stock_id.toString());
    useEffect(() => {
        if (isStockIdExists) {
            setTracked(true);
            console.log("檢查text是否存在-true", isStockIdExists)
        }else {
            setTracked(false);
            console.log("檢查text是否存在-false", isStockIdExists)
        }
        console.log("追蹤清單", trackingList);
    }, [data]);

    //檢查 stockId 在 trackingList 裡的 text 是否存在
    // const stockcheck = "5";
    // const checkList =trackingList;
    
    //clickToTrack 
    const clickToTrack = async () => {
        try {
            const docRef = await addDoc(collection(db, "trackingList"), {
                stock_id: stockId,
                stock_name: stockName,
                close: stockClose,
                change: stockChange,
                change_percent:stockChangePercent,
                timestamp: serverTimestamp(),
                userId: auth?.currentUser?.uid
            });
            console.log("Document written with ID: ", docRef.id);
            setTracked(true);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    // clickToCancel
    const clickToCancel = async () =>{
        try {
            const listRef = collection(db, "trackingList");
            const q = query(listRef, where("userId", "==", auth?.currentUser?.uid), where("text", "==", stockId));
            const data = await getDocs(q);
            const results=data.docs.map((doc) => ({...doc.data(), id:doc.id }));
            console.log("刪除前查詢結果", results);
            await deleteDoc(doc(db, "trackingList", results[0].id));
        }catch (error) {
            console.log(error);
        };
        setTracked(false);
    }
    //*加入追蹤功能-------------------------------------------------------
    
    return (
        <div className={styles.container}>
            <div className={styles.SVG}>
                <div className={styles.stockNameAndId}>
                    <div className={styles.stockName}>{stockName}</div>
                    <div className={styles.stockId}>{stockId}</div>
                </div>
                <div className={styles.stockBriefInfo}>
                    <div className={styles.close}>
                        <span className={styles.infoTitle}>收盤價：</span>
                        <span className={styles.infoContent}>{stockClose}</span>
                    </div>
                    <div className={styles.change}>
                        <span className={styles.infoTitle}>漲跌幅：</span>
                        <span className={styles.infoContent}>{stockChange} ({stockChangePercent}%)</span>
                    </div>
                    <div className={styles.vol}>
                        <span className={styles.infoTitle}>成交量：</span>
                        <span className={styles.infoContent}>{stockVolume}</span>
                        <span className={styles.infoTitle}> 張</span>
                        
                    </div>
                    <div className={styles.amount}>
                        <span className={styles.infoTitle}>成交金額：</span>
                        <span className={styles.infoContent}>{stockAmount}</span>
                        <span className={styles.infoTitle}> 億</span>    
                    </div>
                    <div className={styles.updateTime}>資料時間: {stockDate}</div>
                </div>
                {tracked ? 
                    <div className={styles.trackedBox} onClick={clickToCancel}>
                        <span className={styles.add}>✔</span>
                        <p>已追蹤</p>
                    </div>
                    :<div className={styles.trackBtn} onClick={clickToTrack}>
                            {/* <img className={styles.add} src={add} alt="add" /> */}
                            <span className={styles.add}>+</span>
                            <p>追蹤</p>
                    </div>
                }
                <div className={styles.candleChart}>
                    <svg 
                        width="1650"
                        height="550"
                        viewBox="0 0 1650 550"
                        xmlns="<http://www.w3.org/2000/svg>"
                        >   {/* overflow="visible"??? */}
                        
                        {/* chart border */}
                        <rect
                            x="100"
                            y="20"
                            width="1450"
                            height="500"
                            fill="#FFFFFF"
                            stroke="rgb(190, 190, 190)"
                            strokeWidth="0.5"
                        />

                        {/* horizontal line */}
                        {priceLines}
                        {volLines}

                        {/* 資料時間yyyy/mm */}
                        <text x="80" y="540" fontSize="12" fill="#8592A2">2022/07</text>
                        <text x="290" y="540" fontSize="12" fill="#8592A2">2022/08</text>
                        <text x="520" y="540" fontSize="12" fill="#8592A2">2022/09</text>
                        <text x="730" y="540" fontSize="12" fill="#8592A2">2022/10</text>
                        <text x="930" y="540" fontSize="12" fill="#8592A2">2022/11</text>
                        <text x="1150" y="540" fontSize="12" fill="#8592A2">2022/12</text>
                        <text x="1370" y="540" fontSize="12" fill="#8592A2">2023/01</text>
                        <text x="1500" y="540" fontSize="12" fill="#8592A2">2022/02</text>

                        <line x1={314} y1={20} x2={314} y2={520} stroke="#8592A2" strokeWidth="0.5" strokeDasharray="2 2"/>
                        <line x1={544} y1={20} x2={544} y2={520} stroke="#8592A2" strokeWidth="0.5" strokeDasharray="2 2"/>
                        <line x1={754} y1={20} x2={754} y2={520} stroke="#8592A2" strokeWidth="0.5" strokeDasharray="2 2"/>
                        <line x1={954} y1={20} x2={954} y2={520} stroke="#8592A2" strokeWidth="0.5" strokeDasharray="2 2"/>
                        <line x1={1174} y1={20} x2={1174} y2={520} stroke="#8592A2" strokeWidth="0.5" strokeDasharray="2 2"/>
                        <line x1={1394} y1={20} x2={1394} y2={520} stroke="#8592A2" strokeWidth="0.5" strokeDasharray="2 2"/>
                        <line x1={1525} y1={20} x2={1525} y2={520} stroke="#8592A2" strokeWidth="0.5" strokeDasharray="2 2"/>

                        {/* candleStick */}
                        {<BuildCandle />}

    
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default CandleChartSVG;

