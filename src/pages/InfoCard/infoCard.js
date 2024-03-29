import React, {useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { collection, query, getDocs, orderBy } from "firebase/firestore";
import {db} from "../../firebase/firebase";

import styles from "./infoCard.module.css";

import { HiArrowTrendingUp, HiArrowTrendingDown, HiChartBar, HiCurrencyDollar } from "react-icons/hi2";
import { ImMenu3, ImMenu4 } from "react-icons/im";

function InfoCard () {


    //取得資料
    const [maxVol, setMaxVol] = useState([]);
    const [maxAmount, setMaxAmount] = useState([]);
    const [maxRise, setMaxRise] = useState([]);
    const [maxFall, setMaxFall] = useState([]);

    async function getData () {
        try {
            const maxVolRef = collection(db, "maxVol");
            const maxAmountRef = collection(db, "maxAmount");
            const maxRiseRef = collection(db, "maxRise");
            const maxFallRef = collection(db, "maxFall");

            const maxVolQuery = query(maxVolRef, orderBy("vol", "desc"));
            const maxAmountQuery = query(maxAmountRef, orderBy("amount", "desc"));
            const maxRiseQuery = query(maxRiseRef, orderBy("changePercent", "desc"));
            const maxFallQuery = query(maxFallRef, orderBy("changePercent", "asc"));
            
            const [maxVolSnapshot, maxAmountSnapshot, maxRiseSnapshot, maxFallSnapshot] = await Promise.all([
                getDocs(maxVolQuery),
                getDocs(maxAmountQuery),
                getDocs(maxRiseQuery),
                getDocs(maxFallQuery)
    
            ]);

            const maxVolData = maxVolSnapshot.docs.map((doc) => ({...doc.data(), id: doc.id}));
            const maxAmountData = maxAmountSnapshot.docs.map((doc) => ({...doc.data(), id: doc.id}));
            const maxRiseData = maxRiseSnapshot.docs.map((doc) => ({...doc.data(), id: doc.id}));
            const maxFallData = maxFallSnapshot.docs.map((doc) => ({...doc.data(), id: doc.id}));
            
            setMaxVol(maxVolData);
            setMaxRise(maxRiseData);
            setMaxFall(maxFallData);
            setMaxAmount(maxAmountData);

        } catch (error) {
            console.log(error);
        };
    }

    useEffect(() => {
        getData();
    },[]);
 

    const [cardList, setCardList] = useState([]);
    const navigate = useNavigate();
    function handleClick (keyword) {
        navigate(`/home/${keyword}`);

        const chartContainer = document.querySelector(".searchBar-module__input___O_uKh");
        const containerOffsetTop = chartContainer.offsetTop;

        window.scrollTo({ top: containerOffsetTop, behavior: "smooth" });
    };

    useEffect(() => {
        if (maxVol.length > 0) {
            setCardList([
                {
                    id: 1,
                    order: 2,
                    text: (
                      <div>
                        <div><HiChartBar size={18} color="#0f73ee"/> 成交量最大</div>
                        <div className={styles.cardItem}>
                            <div>股票代號</div>
                            <div>股票名稱</div>
                            <div>收盤價</div>
                            <div>漲跌幅</div>
                        </div>
                        {maxVol.map((item) => (
                            <div key={item.vol} className={styles.singleItem} onClick={() => handleClick(item.stock_id)}>
                                <div className={styles.itemId}>{item.stock_id}</div>
                                <div className={styles.itemName}>{item.name}</div>
                                <div className={styles.itemClose}>{item.close}</div>
                                <div className={styles.itemChange} style={{color: item.changePercent > 0 ? "#F2666C" : "#68BE8D"}}>{item.changePercent}%</div>
                            </div>
                        ))}
                      </div>
                    )
                },
                { 
                    id: 2, 
                    order: 1, 
                    text: (
                        <div>
                            <div><HiCurrencyDollar size={18} color="#0f73ee"/> 成交金額最大</div>
                            <div className={styles.cardItem}>
                                <div>股票代號</div>
                                <div>股票名稱</div>
                                <div>收盤價</div>
                                <div>漲跌幅</div>
                            </div>
                            {maxAmount.map((item) => (
                                <div key={item.amount} className={styles.singleItem} onClick={() => handleClick(item.stock_id)}>
                                    <div className={styles.itemId}>{item.stock_id}</div>
                                    <div className={styles.itemName}>{item.name}</div>
                                    <div className={styles.itemClose}>{item.close}</div>
                                    <div className={styles.itemChange} style={{color: item.changePercent > 0 ? "#F2666C" : "#68BE8D"}}>{item.changePercent}%</div>
                                </div>
                            ))}
                        </div>
                    
                    )
                },
                { 
                    id: 3, 
                    order: 3, 
                    text: (
                        <div>
                            <div><HiArrowTrendingUp size={18} color="#F2666C"/> 漲幅最大</div>
                            <div className={styles.cardItem}>
                                <div>股票代號</div>
                                <div>股票名稱</div>
                                <div>收盤價</div>
                                <div>漲跌幅</div>
                            </div>
                            {maxRise.map((item) => (
                                <div key={item.stock_id} className={styles.singleItem} onClick={() => handleClick(item.stock_id)}>
                                    <div className={styles.itemId}>{item.stock_id}</div>
                                    <div className={styles.itemName}>{item.name}</div>
                                    <div className={styles.itemClose}>{item.close}</div>
                                    <div className={styles.itemChange} style={{color: item.changePercent > 0 ? "#F2666C" : "#68BE8D"}}>{item.changePercent}%</div>
                                </div>
                            ))}
                        </div>
                    )
                },
                { 
                    id: 4, 
                    order: 4, 
                    text: (
                        <div>
                            <div><HiArrowTrendingDown size={18} color="#68BE8D"/> 跌幅最大</div>
                            <div className={styles.cardItem}>
                                <div>股票代號</div>
                                <div>股票名稱</div>
                                <div>收盤價</div>
                                <div>漲跌幅</div>
                            </div>
                            {maxFall.map((item) => (
                                <div key={item.close} className={styles.singleItem} onClick={() => handleClick(item.stock_id)}>
                                    <div className={styles.itemId}>{item.stock_id}</div>
                                    <div className={styles.itemName}>{item.name}</div>
                                    <div className={styles.itemClose}>{item.close}</div>
                                    <div className={styles.itemChange} style={{color: item.changePercent > 0 ? "#F2666C" : "#68BE8D"}}>{item.changePercent}%</div>
                                </div>
                            ))}
                        </div>
                    )
                },
            ]);
        }
    }, [maxVol]);
    
    const [currentCard, setCurrentCard] = useState(null);

    function handleDragStart (event, card) {
        setCurrentCard(card);
    };

    function handleDragLeave (event) {
        event.target.style.background="rgb(232,240,254)";
    };

    function handleDragOver (event) {
        event.preventDefault();
        event.target.style.background="rgb(232,240,254)";
    };

    function handleDrop (event, card) {
        event.preventDefault();
        setCardList(cardList.map(c => {
            if (c.id === card.id) {
                return {...c, order: currentCard.order}
            };
            if (c.id === currentCard.id) {
                return {...c, order: card.order}
            };
            return c;
        }))
        event.target.style.background="rgb(232,240,254)";
    };

    function handleMouseDown (event) {
        event.target.style.cursor = "grabbing";
    };
      
    function handleMouseUpOrLeave (event) {
        event.target.style.cursor = "grab";
    };
      

    function sortCards (a,b) {
        if (a.order > b.order) {
            return 1;
        } else {
            return -1;
        }
    };

    //menu show hide
    const [isOpen, setIsOpen] = useState(true);

    const handleMenuClick = () => {
        setIsOpen(!isOpen);
        onMenuToggle();
    };

    return(
        <div className={styles.infoCard}>
            <div className={styles.title}  onClick={handleMenuClick}>
                {isOpen ? <ImMenu4 /> : <ImMenu3 />}
                <span> 市場趨勢</span>
            </div>
            {isOpen && (
                <div className={styles.cardContainer}>
                    {cardList.sort(sortCards).map(card =>
                        <div key={card.id}
                            onDragStart={(event) => handleDragStart(event, card)}
                            onDragLeave={(event) => handleDragLeave(event)}
                            onDragOver={(event) => handleDragOver(event)}
                            onDrop={(event) => handleDrop(event, card)}
                            onMouseDown={(event) => handleMouseDown(event)}
                            onMouseUp={(event) => handleMouseUpOrLeave(event)}
                            onMouseLeave={(event) => handleMouseUpOrLeave(event)}
                            draggable={true}
                            className={styles.card}>
                            {card.text}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
export default InfoCard;