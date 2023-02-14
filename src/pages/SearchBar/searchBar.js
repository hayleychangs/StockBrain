import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, query, getDocs, where, deleteDoc, doc, serverTimestamp, orderBy, onSnapshot } from "firebase/firestore";
import {db} from "../../firebase/firebase";

import styles from "./searchBar.module.css";

import searchIcon from "../../images/search.png"

import MarketData from "./market.json";

function SearchBar (props) {

    //----------取得input值
    const inputRef = useRef(null);

    //--------搜尋欄 feat. filter-------------
    const navigate = useNavigate()
    const search = () => {
        setSearchValue(inputRef.current.value);
        console.log(searchValue);
        //設定querystring
        navigate(`/home/${searchValue}`)
        setSearchValue("");
    }
    //--------------------------------------
 

    //-----處理搜尋結果篩選---------------------
    const [data, setData] = useState(MarketData);
    const [searchValue, setSearchValue] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    const handleFilter = (event) => {
        const searchValue = event.target.value;
        setSearchValue(searchValue);
        setFilteredData(data.filter(item =>
              item.股票代碼.toString().includes(searchValue.toString()) ||
              item.股票名稱.toString().includes(searchValue)
        ));
    }
    //------------------------------------------


    //-----OnFocus & OnBlur & click---------------------
    const [isHidden, setIsHidden] = useState(true);

    const handleOnFocus = (event) => {
        event.target.placeholder="";
        setIsHidden(true);
    }

    const handleOnBlur = (event) => {
        event.target.placeholder="輸入台股名稱或代號搜尋";
        setIsHidden(false);
    }


    const handleClick = (keyword) => {
        console.log("關鍵字", keyword)
        setSearchValue(keyword);
        search();
    }

    //------------------------------------------

    

    return (
      <div>
        <div className={styles.searchBox}>
            <div className={styles.input}>
                <input ref={inputRef}
                    value={searchValue}
                    className="input"
                    type="text"
                    placeholder="輸入台股名稱或代號搜尋"
                    onFocus={handleOnFocus}
                    onBlur={handleOnBlur}
                    onChange={handleFilter}

                />
            </div>
            <button className={styles.searchBtn}>
                <img className={styles.search} src={searchIcon} alt="search" onClick={search} />
            </button>
            {isHidden && searchValue && (
                <div className={styles.searchResults}>
                    {/* data from props或from firestore查詢結果---filteredData */}
                    {filteredData.slice(0, 10).map((value) => {
                        return (
                            <li key={value.股票代碼} className={styles.resultsItem} onClick={() => handleClick(value.股票代碼)}>
                                <span className={styles.itemId}>{value.股票代碼}&emsp;</span>
                                <span className={styles.itemName}>{value.股票名稱}</span>
                            </li>
                        )
                    })}
                </div>
            )}
        </div>
        
      </div>
    );
}

export default SearchBar;