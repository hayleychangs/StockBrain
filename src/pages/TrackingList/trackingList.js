import React from "react";
import { useNavigate, Link } from "react-router-dom";

import { useTrackingList } from "../../hooks/useFirestore";
import { useDeleteDoc } from "../../hooks/useFirestore";

import styles from "./trackingList.module.css";

import { RiDeleteBin5Line } from "react-icons/ri";

function TrackingList ({ user }) {
    //read todo
    const { data: trackingList } = useTrackingList(user?.uid);

    //delete todo
    const { handleDeleteDoc } = useDeleteDoc("trackingList");
    async function handleDelete (event, id) {  
        event.stopPropagation();
        await handleDeleteDoc(id);
    }
    
    const navigate = useNavigate ();

    function handleClick (keyword) {
        navigate(`/home/${keyword}`)
    }

    return (
        <div className={styles.trackingList}>
            <div className={styles.title}>我的追蹤</div>
            <div className={styles.container}>
                <div className={styles.subTitle}>
                        <div>股票代號</div>
                        <div>股票名稱</div>
                        <div>收盤價</div>
                        <div>漲跌元</div>
                        <div>漲跌幅</div>
                </div>
                {user ? (
                    <div className={styles.allTrackingList}>
                        {
                            trackingList?.map((track,i)=>(
                                <div className={styles.singleTrack} key={i} onClick={() => handleClick(track.stock_id)}>
                                    <div className={styles.trackText}>
                                        {track.stock_id}
                                    </div>
                                    <div  className={styles.trackText}>
                                        {track.stock_name}
                                    </div>
                                    <div  className={styles.trackText}>
                                        {track.close}
                                    </div>
                                    <div  className={`${styles.trackTextChange} ${track.change > 0 ? styles.red : track.change < 0 ? styles.green : ""}`}>
                                        {track.change}
                                    </div>
                                    <div  className={`${styles.trackTextPercent} ${track.change_percent > 0 ? styles.red : track.change_percent < 0 ? styles.green : ""}`}>
                                        {track.change_percent}%
                                    </div>
                                    <button className={styles.deleteBtn} onClick={(event) =>{handleDelete(event, track.id)}}><RiDeleteBin5Line size={20} /></button>
                                </div>
                            ))
                        }
                    </div>
                ):(
                    <div className={styles.redirectMessageBox}>
                        <p>完整內容，僅限註冊會員使用</p>
                        <p>立即<Link to="/signup" style={{ color: "#0f73ee"}}> 註冊</Link><span> 或 </span><Link to="/login" style={{ color: "#0f73ee"}}>登入<span style={{fontSize:"10px"}}> (測試帳號)</span></Link></p>
                    </div>
                )}
          </div>
        </div>
    );
}
export default TrackingList;


