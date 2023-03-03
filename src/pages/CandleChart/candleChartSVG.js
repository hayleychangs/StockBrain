import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";

import { collection, addDoc, query, getDocs, deleteDoc, doc, serverTimestamp, orderBy, where, onSnapshot } from "firebase/firestore";
import {db, auth} from "../../firebase/firebase";
import { onAuthStateChanged } from 'firebase/auth';

import styles from "./candleChartSVG.module.css";
import { BsCheckCircleFill, BsPlusCircle } from "react-icons/bs";

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
    }else if(candleData.close<candleData.max && candleData.close==candleData.min && candleData.open>candleData.close){
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
    const [stockName, setStockName] = useState(data[145].stock_name);
    const [stockId, setStockId] = useState(data[145].stock_id);
    const [stockOpen, setStockOpen] = useState(data[145].open);
    const [stockHigh, setStockHigh] = useState(data[145].max);
    const [stockLow, setStockLow] = useState(data[145].m);
    const [stockClose, setStockClose] = useState(data[145].close);
    const [stockChange, setStockChange] = useState(parseFloat((data[145].close-data[144].close).toFixed(2)));
    const [stockChangePercent, setStockChangePercent] = useState(parseFloat((data[145].spread/data[144].close*100).toFixed(2)));
    const [stockVolume, setStockVolume] = useState(parseInt(data[145].Trading_Volume/1000));
    const [stockAmount, setStockAmount] = useState((data[145].Trading_money/100000000).toFixed(2));
    const [stockDate, setStockDate] = useState(data[145].date);

    useEffect(() => {
        setStockName(data[145].stock_name);
        setStockId(data[145].stock_id);
        setStockOpen(data[145].open);
        setStockHigh(data[145].max);
        setStockLow(data[145].min);
        setStockClose(data[145].close);
        setStockChange(parseFloat((data[145].close-data[144].close).toFixed(2)));
        setStockChangePercent(parseFloat((data[145].spread/data[144].close*100).toFixed(2)));
        setStockVolume(data[145].Trading_Volume/1000);
        setStockAmount((data[145].Trading_money/100000000).toFixed(2));
        setStockDate(data[145].date);
    },[data]);

    const handleMouseMove = (event, i) => {
        // access the data using data[i]
        setStockOpen(data[i+1].open);
        setStockHigh(data[i+1].max);
        setStockLow(data[i+1].min);
        setStockClose(data[i+1].close);
        setStockChange(parseFloat((data[i+1].close-data[i].close).toFixed(2)));
        setStockChangePercent(parseFloat((((data[i+1].close-data[i].close)/data[i].close)*100).toFixed(2)));
        setStockVolume(parseInt(data[i+1].Trading_Volume/1000));
        setStockAmount((data[i+1].Trading_money/100000000).toFixed(2));
        setStockDate(data[i+1].date);
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

        //5MA
        const MA5 = [];
        for (let i = 5; i < data.length; i++) {
            const periodFive = 5;
            const sum = data.slice(i - periodFive + 1, i + 1).reduce((acc, val) => acc + val.close, 0);
            let average = (sum / periodFive).toFixed(2);

            average=parseFloat((40+(maxPrice-average)*multiplier).toFixed(2));

            MA5.push(Number(average));
        }

        //10MA
        const MA10 = [];
        for (let i = 10; i < data.length; i++) {
            const periodTen = 10;
            const sum = data.slice(i - periodTen + 1, i + 1).reduce((acc, val) => acc + val.close, 0);
            let average = (sum / periodTen).toFixed(2);

            average=parseFloat((40+(maxPrice-average)*multiplier).toFixed(2));

            MA10.push(Number(average));
        }
    
        //20MA
        const MA20 = [];
        for (let i = 20; i < data.length; i++) {
            const periodTwenty = 20;
            const sum = data.slice(i - periodTwenty + 1, i + 1).reduce((acc, val) => acc + val.close, 0);
            let average = (sum / periodTwenty).toFixed(2);

            average=parseFloat((40+(maxPrice-average)*multiplier).toFixed(2));

            MA20.push(Number(average));
        }

        return {dataArray, maxAndMinArray, priceScale, volScale, MA5, MA10, MA20}
    }
    const craftedData = DataCrafting(data).dataArray;
    const maxAndMinArray = DataCrafting(data).maxAndMinArray;
    const priceScale = DataCrafting(data).priceScale;
    const volScale =  DataCrafting(data).volScale;     
    const MA5 = DataCrafting(data).MA5;
    const MA10 = DataCrafting(data).MA10;             
    const MA20 = DataCrafting(data).MA20;

    //*build candlestick
    const BuildCandle = () => {
        const spacing = 5;
        let x = 52.5;
        let bottom=520;
        let dividingLine=350;
        let maxVol = maxAndMinArray[0].maxVol;
        const polylineSpacing = 10;
        let xForMA5 = x + 92;
        let xForMA10 = x + 142;
        let xForMA20 = x + 242;

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
                color = "#F2666C";
            } else if (candleData.positive === 2) {
                color = "#68BE8D";
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

        //5MA
        let pointsForMA5 = "";
        for (let i = 0; i < MA5.length; i++){

            const x = xForMA5;
            const y = MA5[i];
            pointsForMA5 += `${x},${y} `;
        
            xForMA5+=polylineSpacing;
        }
        const MA5Line = (
            <polyline
              key="ma5"
              points={pointsForMA5}
              stroke="gold"
              strokeWidth="0.5"
              fill="none"
            />
        );
        
        //10MA
        let pointsForMA10 = "";
        for (let i = 0; i < MA10.length; i++){

            const x = xForMA10;
            const y = MA10[i];
            pointsForMA10 += `${x},${y} `;
           
            xForMA10+=polylineSpacing;
        }
        const MA10Line = (
            <polyline
              key="ma10"
              points={pointsForMA10}
              stroke="#eb7d16"
              strokeWidth="0.5"
              fill="none"
            />
        );

        //20MA
        let pointsForMA20 = "";
        for (let i = 0; i < MA20.length; i++){

            const x = xForMA20;
            const y = MA20[i];
            pointsForMA20 += `${x},${y} `;
           
            xForMA20+=polylineSpacing;
        }
        const MA20Line = (
            <polyline
              key="ma200"
              points={pointsForMA20}
              stroke="#0f73ee"
              strokeWidth="0.5"
              fill="none"
            />
        );

        return [...priceTextLeft, ...priceTextRight, ...volTextLeft, ...volTextRight, ...candleStick, ...tradeVol, fiveMA && MA5Line, tenMA && MA10Line, twentyMA && MA20Line];
    }
    

    //*加入追蹤功能-----------------------------------------------

    //user狀態確認並取得資料庫清單
    const [user, setUser] = useState(null);
    const [trackingList, setTrackingList] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
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

    //取得資料庫的追蹤清單
    const fetchList = async () => {
        if (!user) {
            return;
        }
        try {
            const listRef = collection(db, "trackingList");
            const q = query(listRef, where("userId", "==", user.uid));

            onSnapshot(q, (snapshot) => {
                const newData = [];
                snapshot.docs.forEach((doc) => {
                  newData.push({ ...doc.data(), id: doc.id });
                  setTrackingList(newData);
                  console.log("列印newData", newData)
                });
            })
            
            console.log("列印data", data)
            
            console.log("471列印trackingList", trackingList)
            setIsLoaded(true);
        } catch (error) {
            console.log(error);
        } 

    };

    useEffect(()=>{
        fetchList();

    }, [user, data]); //depends on data update

    console.log("494列印trackingList", trackingList)

    //追蹤狀態判斷，判斷是否有該值
    useEffect(() => {
        if (isLoaded){
            const isStockIdExists = trackingList.some(item => item.stock_id === data[145].stock_id.toString());
            if (isStockIdExists) {
                setTracked(true);
                console.log("檢查text是否存在-true", isStockIdExists)
            }else {
                setTracked(false);
                console.log("檢查text是否存在-false", isStockIdExists)
            }
            console.log("追蹤清單", trackingList);
        }
    }, [isLoaded, data, trackingList]); //depends on trackingList

    
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
            const q = query(listRef, where("userId", "==", auth?.currentUser?.uid), where("stock_id", "==", stockId));
            const data = await getDocs(q);
            const results=data.docs.map((doc) => ({...doc.data(), id:doc.id }));
            await deleteDoc(doc(db, "trackingList", results[0].id));
        }catch (error) {
            console.log(error);
        };
        setTracked(false);
    }
    //*加入追蹤功能-------------------------------------------------------

    //滑鼠事件---------------
    const svgRef = useRef(null);
    const hlineRef = useRef(null);
    const vlineRef = useRef(null);
  
    function handleMouseMove1(e) {
      const svg = svgRef.current;
      const rect = svg.getBoundingClientRect();
      const x = e.nativeEvent.offsetX / rect.width;
      const y = e.nativeEvent.offsetY / rect.height;

      console.log("Y座標0", e.nativeEvent.offsetY);
      console.log("Y座標", y);
  
      // 繪製水平線
      const hline = hlineRef.current;
      hline.x1.baseVal.value = 100;
      hline.y1.baseVal.value = y * rect.height;
      hline.x2.baseVal.value = 1550;
      hline.y2.baseVal.value = y * rect.height;
  
      // 繪製垂直線
      const vline = vlineRef.current;
      vline.x1.baseVal.value = x * rect.width;
      vline.y1.baseVal.value = 20;
      vline.x2.baseVal.value = x * rect.width;
      vline.y2.baseVal.value = 520;
    }
    //---------------

    //scroll default--------------
    const chartRef = useRef({scrollWidth: 0});
    useLayoutEffect(() => {
        const element = chartRef.current;
        element.scrollLeft = element.scrollWidth - element.clientWidth;
    }, []);


    //average line checkbox--------------
    const [fiveMA, setFiveMA] = useState(true);
    const [tenMA, setTenMA] = useState(true);
    const [twentyMA, setTwentyMA] = useState(true);

    return (
        <div className={styles.container}>
            <div className={styles.SVG}>
                <div className={styles.stockNameAndId}>
                    <div className={styles.stockName}>{stockName}</div>
                    <div className={styles.stockId}>{stockId}</div>
                </div>
                <div className={styles.stockBriefInfo}>
                    <div className={styles.open}>
                        <span className={styles.infoTitle}>開盤價：</span>
                        <span className={styles.infoContent}>{stockOpen}</span>
                    </div>
                    <div className={styles.high}>
                        <span className={styles.infoTitle}>最高價：</span>
                        <span className={styles.infoContent}>{stockHigh}</span>
                    </div>
                    <div className={styles.low}>
                        <span className={styles.infoTitle}>最低價：</span>
                        <span className={styles.infoContent}>{stockLow}</span>
                    </div>
                    <div className={styles.close}>
                        <span className={styles.infoTitle}>收盤價：</span>
                        <span className={styles.infoContent}>{stockClose}</span>
                    </div>
                    <div className={styles.change}>
                        <span className={styles.infoTitle}>漲跌元(幅)：</span>
                        <span className={`${styles.infoContent} ${stockChange > 0 ? styles.red : stockChange < 0 ? styles.green : ''}`}>{stockChange} ({stockChangePercent}%)</span>
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
                    <div className={styles.maBox}>
                            <div className={fiveMA ? styles.maFiveActive : styles.maFiveInActive} onClick={() => setFiveMA(!fiveMA)}>5MA</div>
                            <div className={tenMA ? styles.maTenActive : styles.maTenInActive} onClick={() => setTenMA(!tenMA)}>10MA</div>
                            <div className={twentyMA ? styles.maTwentyActive : styles.maTwentyInActive} onClick={() => setTwentyMA(!twentyMA)}>20MA</div>
                    </div>
                </div>
                {user ?
                    tracked ?
                        <div className={styles.trackedBox} onClick={clickToCancel}>
                            <BsCheckCircleFill size={40} color="gold"/>
                        </div>
                        :<div className={styles.trackBtn} onClick={clickToTrack}>
                                <BsPlusCircle size={40} color="#666666"/>
                        </div>
                    :
                    <div className={`${styles.trackBtn} ${styles["tipsForTrack"]}`}>
                        <BsPlusCircle size={40} color="#666666"/>
                    </div>
                }
                <div className={styles.candleChart} ref={chartRef}>
                    <svg 
                        width="1650"
                        height="550"
                        viewBox="0 0 1650 550"
                        xmlns="<http://www.w3.org/2000/svg>"
                        >
                        
                        {/* chart border */}
                        <rect
                            ref={svgRef}
                            onMouseMove={(e) => handleMouseMove1(e)}
                            x="100"
                            y="20"
                            width="1450"
                            height="500"
                            fill="#FFFFFF"
                            stroke="rgb(190, 190, 190)"
                            strokeWidth="0.5"
                        />

                       {/* 繪製水平線 */}
                        <line
                            ref={hlineRef}
                            x1="100"
                            y1="0"
                            x2="1550"
                            y2="0"
                            stroke="gray"
                            strokeWidth="0.5"
                        />

                        {/* 繪製垂直線 */}
                        <line
                            ref={vlineRef}
                            x1="0"
                            y1="20"
                            x2="0"
                            y2="520"
                            stroke="gray"
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

