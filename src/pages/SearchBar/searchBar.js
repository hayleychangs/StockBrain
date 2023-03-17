import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./searchBar.module.css";

import { BiSearchAlt } from "react-icons/bi";

import MarketData from "./market.json";

function SearchBar () {
    const [data, setData] = useState(MarketData);
    const [searchInput, setSearchInput] = useState("");
    const [stockId, setStockId] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    const navigate = useNavigate()

    //搜尋欄
    function handleSubmit (event) {
        event.preventDefault();
        navigate(`/home/${stockId}`);
        setFilteredData([]);
        setSearchInput("");
    }

    //處理搜尋結果篩選
    function handleFilter (event) {
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

    //OnFocus & OnBlur & click
    function handleOnFocus (event) {
        event.target.placeholder="";
    }

    function handleOnBlur (event) {
        event.target.placeholder="輸入台股名稱或代號搜尋";
    }

    function handleClick (keyword) {
        navigate(`/home/${keyword}`)
        setFilteredData([]);
        setSearchInput("");
    }
    
    useEffect(() => {
        if (searchInput=="") {
            setFilteredData([]);
        }
    }, [searchInput]);

    let resultRef = useRef();

    useEffect(() => {
        const handler = (e) => {
            if(!resultRef.current.contains(e.target)){
                setSearchInput("");
                setFilteredData([]);
            };
        };

        document.addEventListener("mousedown", handler);

        return() =>{
            document.removeEventListener("mousedown", handler);
        }
    })
    
    return (
        <div className={styles.searchBox} ref={resultRef}>
            <form className={filteredData.length !== 0 ? `${styles.input} ${styles["has-results"]}` : styles.input} onSubmit={handleSubmit}>
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