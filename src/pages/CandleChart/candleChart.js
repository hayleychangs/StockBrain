import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { collection, query, getDocs, orderBy } from "firebase/firestore";
import {db} from "../../firebase/firebase";

import CandleChartSVG from "./candleChartSVG";
import NoData from "./noData";

import styles from "./candleChart.module.css";

import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";

const CandleChart= () => {
    let { stockId } = useParams();
    const [loading, setLoading] = useState(true);
    const [KChartData, setKChartData] = useState([]);

    useEffect(() => {

         // 預設執行getData("2330")
         if (!stockId) {
             stockId = "2330";
         }

        const getData = async (col) => {
            setLoading(true);
            try {
                const kChartDataRef = collection(db, col);
                const q = query(kChartDataRef, orderBy("date", "asc"));
                const data = await getDocs(q);
                const newData = data.docs.map((doc) => ({...doc.data(), id:doc.id }));
                setKChartData(newData); 
            } catch (error) {
                console.log("讀取文件時出錯:", error);
            } finally {
                setLoading(false);
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
            {loading ? (
                <motion.div
                    className={styles.loading}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <FaSpinner size={50} color="#0f73ee"/>
                </motion.div>
            ) : KChartData.length > 0 ? (
                <CandleChartSVG data={KChartData} />
            ) : (
                <NoData />
            )}
        </div>
    )
}
export default CandleChart;