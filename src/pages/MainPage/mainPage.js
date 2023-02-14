import React, { useRef, useState, useEffect } from "react";

import Header from "../Header/header";
import CandleChart from "../CandleChart/candleChart";
import Calculator from "../Calculator/calculator";
import SearchBar from "../SearchBar/searchBar";
import TrackingList from "../TrackingList/trackingList";

import styles from "./mainPage.module.css";


function MainPage () {

    return (
        <>
            <div className={styles.mainSection}>
                <div>
                    {<Header />}
                </div>
                <div className={styles.searchBar}>
                    {<SearchBar />}
                </div>
                <div className={styles.candleStickChart}>
                    {<CandleChart />}
                </div>
                <div className={styles.trackingList}>
                    {<TrackingList />}
                </div>
                <div className={styles.calculator}>
                    {<Calculator />}
                </div>
            </div>
        </>
    )
}


export default MainPage;