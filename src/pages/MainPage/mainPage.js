import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Header from "../Header/header";
import CandleChart from "../CandleChart/candleChart";
import Calculator from "../Calculator/calculator";
import SearchBar from "../SearchBar/searchBar";
import TrackingList from "../TrackingList/trackingList";
import MyNote from "../Note/myNote";
import InfoCard from "../InfoCard/infoCard";
import TradePlan from "../TradePlan/tradePlan";

import styles from "./mainPage.module.css";


function MainPage () {
    const [isMyNoteOpen, setIsMyNoteOpen] = useState(true);
    const handleMyNoteToggle = () => {
        setIsMyNoteOpen(!isMyNoteOpen);
        console.log("19列印", isMyNoteOpen)
    };
      
    const [isTradePlanOpen, setIsTradePlanOpen] = useState(true);
    const handleTradePlanToggle = () => {
        setIsTradePlanOpen(!isTradePlanOpen);
        console.log("28列印", isTradePlanOpen)
    };

    const [isInfoCardOpen, setIsInfoCardOpen] = useState(true);

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
                <div className={styles.myNote}>
                    <MyNote onMenuToggle={handleMyNoteToggle} />
                </div>
                <div className={styles.tradePlan} style={{ marginTop: isMyNoteOpen ? 0 : -330 }}>
                    <TradePlan onMenuToggle={handleTradePlanToggle} />
                </div>
                <div className={styles.infoCard} style={{ marginTop: isMyNoteOpen && isTradePlanOpen ? 0 : isMyNoteOpen && !isTradePlanOpen ? -330 :isMyNoteOpen ? 0 : isTradePlanOpen ? -340 : -660 }}>
                    {<InfoCard />}
                </div>
            </div>
        </>
    )
}

export default MainPage;