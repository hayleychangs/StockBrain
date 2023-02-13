import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { collection, addDoc, query, getDocs, where, deleteDoc, doc, serverTimestamp, orderBy, onSnapshot } from "firebase/firestore";
import {db} from "../../firebase/firebase";

import CandleChartSVG from "./candleChartSVG";

const CandleChart= () => {
    let { stockId } = useParams();

    const [KChartData, setKChartData] = useState([]);

    useEffect(() => {

         // 預設執行getData("2330")
         if (!stockId) {
             stockId = "2330";
         }

        const getData = async (col) => {
            try {
                const kChartDataRef = collection(db, col);
                const q = query(kChartDataRef, orderBy("date", "asc"));
                const data = await getDocs(q);
                const newData = data.docs.map((doc) => ({...doc.data(), id:doc.id }));
                setKChartData(newData);
            } catch (error) {
                console.log("讀取文件時出錯:", error);
            }
        };

        getData(stockId);

        // 監控參數變動後，呼叫getData
        return () => {
            getData(stockId)
        };

    }, [stockId])

    useEffect(() => {
        // console.log('kChartData changed:', KChartData);
    }, [KChartData]);
 
    return(
        <div>
            <CandleChartSVG data={KChartData} />
        </div>
    )
}
export default CandleChart;