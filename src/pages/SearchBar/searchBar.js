import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';

import { collection, addDoc, query, getDocs, where, deleteDoc, doc, serverTimestamp, orderBy, onSnapshot } from "firebase/firestore";
import {db} from "../../firebase/firebase";

import styles from "./searchBar.module.css";

import { BiSearchAlt } from "react-icons/bi";


import MarketData from "./market.json";

function SearchBar () {
    const [data, setData] = useState(MarketData);
    const [searchInput, setSearchInput] = useState("");
    const [stockId, setStockId] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    const navigate = useNavigate()

    //--------搜尋欄-------------
    const handleSubmit = (event) => {
        event.preventDefault();
        //設定querystring
        navigate(`/home/${stockId}`);
        setFilteredData([]);
        setSearchInput("");
    }
    //--------------------------------------
 

    //-----處理搜尋結果篩選---------------------
    const handleFilter = (event) => {
        let searchWord = event.target.value;
        setSearchInput(searchWord);
        let filterResult;
        const searchId = Number(searchWord);

        if(searchId){
            filterResult = data.filter((item) =>{
                return item.股票代碼.toString().includes(searchWord)
            });
            setStockId(searchWord);
        } else {
            filterResult = data.filter( (item) =>{
                return item.股票名稱.includes(searchWord)
            });
            setStockId(filterResult[0].股票代碼);
        }

        if (searchWord === "") {
            setFilteredData([]);
        } else {
            setFilteredData(filterResult);
        }
    }
    //------------------------------------------


    //-----OnFocus & OnBlur & click---------------------
 
    const handleOnFocus = (event) => {
        event.target.placeholder="";
    }

    const handleOnBlur = (event) => {
        event.target.placeholder="輸入台股名稱或代號搜尋";
    }

    function handleClick (keyword) {
        console.log("關鍵字", keyword)
        navigate(`/home/${keyword}`)
        setFilteredData([]);
        setSearchInput("");
    }
    //-------------------------------------------------
    
    useEffect(() => {
        if (searchInput==""){
            setFilteredData([]);
        }
    }, [searchInput]);

    
    let resultRef = useRef();

    useEffect(() => {
        const handler = (e) => {
            if(!resultRef.current.contains(e.target)){
                setSearchInput("");
                setFilteredData([]);
                // console.log(e);
            };
        };

        document.addEventListener("mousedown", handler);

        return() =>{
            document.removeEventListener("mousedown", handler);
        }
    })
    
    return (
        <div className={styles.searchBox} ref={resultRef}>
            <form className={filteredData.length !== 0 ? `${styles.input} ${styles['has-results']}` : styles.input} onSubmit={handleSubmit}>
                <input
                    value={searchInput}
                    type="text"
                    placeholder="輸入台股名稱或代號搜尋"
                    onFocus={handleOnFocus}
                    onBlur={handleOnBlur}
                    onChange={handleFilter}
                />
                <button className={styles.searchBtn}>
                    <BiSearchAlt className={styles.search} size={40} color={"#666666"} />
                </button>
                {filteredData.length !== 0 && (
                    <div className={styles.searchResults}>
                        {filteredData.slice(0, 5).map((value, i) => {
                            return (
                                <li key={i} className={styles.resultsItem} onClick={() => handleClick(value.股票代碼)}>
                                    <span className={styles.itemId}>{value.股票代碼}&emsp;</span>
                                    <span className={styles.itemName}>{value.股票名稱}</span>
                                </li>
                            )
                        })}
                    </div>
                )}
            </form>
        </div>
    );
}

export default SearchBar;