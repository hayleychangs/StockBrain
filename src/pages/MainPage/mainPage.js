import React, { useRef, useState, useEffect } from "react";

import Header from "../Header/header";
import CandleChart from "../CandleChart/candleChart";
import SearchAndGetData from "../SearchBar/searchBar";
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
                    {<SearchAndGetData />}
                </div>
                <div className={styles.candleStickChart}>
                    {<CandleChart />}
                </div>
                <div className={styles.trackingList}>
                    {<TrackingList />}
                </div>
                <div className={styles.calculater}>
                    {<Calculater />}
                </div>
            </div>
        </>
    )
}


export default MainPage;