import React, {useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { collection, addDoc, query, getDocs, deleteDoc, doc, serverTimestamp, orderBy, where, onSnapshot, getDoc } from "firebase/firestore";
import {db, auth} from "../../firebase/firebase";

import styles from "./infoCard.module.css";

import { HiArrowTrendingUp, HiArrowTrendingDown, HiChartBar, HiCurrencyDollar,HiOutlinePlusCircle, HiOutlineCheckCircle } from "react-icons/hi2";
import { ImMenu3, ImMenu4 } from "react-icons/im";

function InfoCard () {


    //取得資料-----------------------------------------------------------
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
            
            console.log(maxVolData, maxRiseData, maxFallData, maxAmountData);
            
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
    //-----------------------------------------------------------


    //-----------------------------------------------------------
    const [cardList, setCardList] = useState([]);


    const navigate = useNavigate()
    function handleClick (keyword) {
        navigate(`/home/${keyword}`)
    }

    useEffect(() => {
        if (maxVol.length > 0) {
            setCardList([
                {
                    id: 1,
                    order: 3,
                    text: (
                      <div>
                        <div><HiChartBar size={18} color="#0f73ee"/>成交量最大</div>
                        <div className={styles.cardItem}>
                            <div>股票代號</div>
                            <div>股票名稱</div>
                            <div>收盤價</div>
                            <div>漲跌幅</div>
                        </div>
                        {maxVol.map((item) => (
                          <div key={item.vol} className={styles.cardItem} onClick={() => handleClick(item.stock_id)}>
                            <div>{item.stock_id}</div>
                            <div>{item.name}</div>
                            <div>{item.close}</div>
                            <div>{item.changePercent}</div>
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
                            <div><HiCurrencyDollar size={18} color="#0f73ee"/>成交金額最大</div>
                            <div className={styles.cardItem}>
                                <div>股票代號</div>
                                <div>股票名稱</div>
                                <div>收盤價</div>
                                <div>漲跌幅</div>
                            </div>
                            {maxAmount.map((item) => (
                            <div key={item.amount} className={styles.cardItem} onClick={() => handleClick(item.stock_id)}>
                                <div>{item.stock_id}</div>
                                <div>{item.name}</div>
                                <div>{item.close}</div>
                                <div>{item.changePercent}</div>
                            </div>
                            ))}
                        </div>
                    
                    )
                },
                { 
                    id: 3, 
                    order: 2, 
                    text: (
                        <div>
                            <div><HiArrowTrendingUp size={18} color="red"/>漲幅最大</div>
                            <div className={styles.cardItem}>
                                <div>股票代號</div>
                                <div>股票名稱</div>
                                <div>收盤價</div>
                                <div>漲跌幅</div>
                            </div>
                            {maxRise.map((item) => (
                            <div key={item.changePercent} className={styles.cardItem} onClick={() => handleClick(item.stock_id)}>
                                <div>{item.stock_id}</div>
                                <div>{item.name}</div>
                                <div>{item.close}</div>
                                <div>{item.changePercent}</div>
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
                            <div><HiArrowTrendingDown size={18} color="green"/>跌幅最大</div>
                            <div className={styles.cardItem}>
                                <div>股票代號</div>
                                <div>股票名稱</div>
                                <div>收盤價</div>
                                <div>漲跌幅</div>
                            </div>
                            {maxFall.map((item) => (
                            <div key={item.changePercent} className={styles.cardItem} onClick={() => handleClick(item.stock_id)}>
                                <div>{item.stock_id}</div>
                                <div>{item.name}</div>
                                <div>{item.close}</div>
                                <div>{item.changePercent}</div>
                            </div>
                            ))}
                        </div>
                    )
                },
            ]);
        }
    }, [maxVol]);
    
    const [currentCard, setCurrentCard] = useState(null);

    function handleDragStart(e, card) {
        console.log("drag", card);
        setCurrentCard(card);
    }

    function handleDragEnd(e) {
        console.log("dragend");
    }

    function handleDragLeave(e) {
        console.log("dragleave");
        e.target.style.background="white";
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.target.style.background="lightgray";
    }

    function handleDrop(e, card) {
        e.preventDefault();
        console.log("drop", card);
        setCardList(cardList.map(c =>{
            if (c.id === card.id) {
                return {...c, order: currentCard.order}
            }
            if (c.id === currentCard.id) {
                return {...c, order: card.order}
            }
            return c;
        }))
        e.target.style.background="white";
    }

    const sortCards = (a,b) => {
        if (a.order > b.order) {
            return 1;
        } else {
            return -1;
        }
    }
    //-----------------------------------------------------------


     //menu shoe hide ----------------------------
     const [isOpen, setIsOpen] = useState(true);

     const handleMenuClick = () => {
         setIsOpen(!isOpen);
         onMenuToggle();
     };
 
     //------------------------------------------


    return(
        <div className={styles.infoCard}>
            <div className={styles.title}  onClick={handleMenuClick}>
                {isOpen ? <ImMenu4 /> : <ImMenu3 />}
                <span> 市場趨勢</span>
            </div>
            {isOpen && (
                <div className={styles.cardContainer}>
                    {cardList.sort(sortCards).map(card =>
                        <div 
                            onDragStart={(e) => handleDragStart(e, card)}
                            onDragLeave={(e) => handleDragLeave(e)}
                            onDragEnd={(e) => handleDragEnd(e)}
                            onDragOver={(e) => handleDragOver(e)}
                            onDrop={(e) => handleDrop(e, card)}
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

