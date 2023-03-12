import React, { useState, useEffect } from "react";

import UseAuth from "../../hooks/useAuth";
import Header from "../Header/header";
import CandleChart from "../CandleChart/candleChart";
import Calculator from "../Calculator/calculator";
import SearchBar from "../SearchBar/searchBar";
import TrackingList from "../TrackingList/trackingList";
import MyNote from "../Note/myNote";
import InfoCard from "../InfoCard/infoCard";
import TradePlan from "../TradePlan/tradePlan";
import Footer from "../Footer/footer";

import styles from "./mainPage.module.css";

function MainPage () {
    const user = UseAuth();

    const [isMyNoteOpen, setIsMyNoteOpen] = useState(true);
    const handleMyNoteToggle = () => {
        setIsMyNoteOpen(!isMyNoteOpen);
    };
      
    const [isTradePlanOpen, setIsTradePlanOpen] = useState(true);
    const handleTradePlanToggle = () => {
        setIsTradePlanOpen(!isTradePlanOpen);
    };

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleScroll = () => {
        if (window.pageYOffset > 20) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className={styles.mainSection}>
            {<Header className={styles.header}/>}
            <div className={styles.container}>
                <div className={styles.searchBar}>
                    {<SearchBar />}
                </div>
                <div className={styles.candleStickChart}>
                    {<CandleChart />}
                </div>
                <div className={styles.trackingList}>
                    {<TrackingList user={user}/>}
                </div>
                <div className={styles.calculator}>
                    {<Calculator user={user}/>}
                </div>
                <div className={styles.myNote}>
                    <MyNote onMenuToggle={handleMyNoteToggle} user={user}/>
                </div>
                <div className={styles.tradePlan} style={{ marginTop: isMyNoteOpen ? 0 : -330 }}>
                    <TradePlan onMenuToggle={handleTradePlanToggle} user={user}/>
                </div>
                <div className={styles.infoCard} style={{ marginTop: isMyNoteOpen && isTradePlanOpen ? 0 : isMyNoteOpen && !isTradePlanOpen ? -330 :isMyNoteOpen ? 0 : isTradePlanOpen ? -340 : -660 }}>
                    {<InfoCard />}
                </div>
            </div>
            <div className={styles.footer}>
                    {<Footer />}
            </div>
            {isVisible && (
                <button className={styles.goToTop} onClick={scrollToTop}>
                    Top
                </button>
            )}
        </div>
    )
}

export default MainPage;