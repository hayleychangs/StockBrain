import React, {useState, useEffect, useRef } from "react";

import styles from "./infoCard.module.css";

function InfoCard () {
    const [cardList, setCardList] = useState([
        {id: 1, order: 3, text: (
            <div>
                <div>成交量最大</div>
                <div className={styles.cardItem}>
                    <div>股票代號</div>
                    <div>股票名稱</div>
                    <div>漲跌點</div>
                    <div>漲跌幅</div>
                </div>
                <div className={styles.cardItem}>
                    <div>3481</div>
                    <div>群創</div>
                    <div>0.50</div>
                    <div>3.68%</div>
                </div>
                <div className={styles.cardItem}>
                    <div>2882</div>
                    <div>國泰金</div>
                    <div>0.95</div>
                    <div>2.21%</div>
                </div>
                <div className={styles.cardItem}>
                    <div>2317</div>
                    <div>鴻海</div>
                    <div>0.00</div>
                    <div>0.00%</div>
                </div>
                <div className={styles.cardItem}>
                    <div>2330</div>
                    <div>台積電</div>
                    <div>10.00</div>
                    <div>-1.89%</div>
                </div>
                <div className={styles.cardItem}>
                    <div>1101</div>
                    <div>台泥</div>
                    <div>0.50</div>
                    <div>1.33%</div>
                </div>
            </div>
          )},
        {id: 2, order: 1, text: "測試文字1"},
        {id: 3, order: 2, text: "測試文字2"},
        {id: 4, order: 4, text: "測試文字4"},
    ]);

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

    return(
        <div className={styles.infoCard}>
            <div>市場趨勢</div>
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
    )
}

export default InfoCard;

