import React, { useState, useEffect }  from "react";
import { useNavigate, Link } from "react-router-dom";

import styles from "./trackingList.module.css";

import { collection, addDoc, query, getDocs, deleteDoc, doc, serverTimestamp, orderBy, where, onSnapshot } from "firebase/firestore";
import {db, auth} from "../../firebase/firebase";
import { onAuthStateChanged } from 'firebase/auth';

import { RiDeleteBin5Line } from "react-icons/ri";

const TrackingList = () => {
    
    //add todo
    const [inputValue, setInputValue] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (inputValue !== "") {
            try {
                const docRef = await addDoc(collection(db, "trackingList"), {
                    text: inputValue,  
                    timestamp: serverTimestamp(),
                    userId: auth?.currentUser?.uid
                    //!用auth功能取得登入UID後，這邊加入UID
                });
                setInputValue("");
                console.log("Document written with ID: ", docRef.id);
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        }
        fetchList();
    };

    //read todo
    const [trackingList, setTrackingList] = useState([]);
    // const [isLoading, setIsLoading] = useState(false);
    const fetchList = async () => {
        // if (inputValue !== "") {
        //     setIsLoading(false);
        // }else if (isClicked) {
        //     setIsLoading(false);
        // }else{
        //     setIsLoading(true);
        // };

        if (!user) {
            return;
        }

        try {
            const listRef = collection(db, "trackingList");
            // console.log("使用者ID", auth?.currentUser?.uid);
            const q = query(listRef, where("userId", "==", auth?.currentUser?.uid), orderBy("timestamp", "desc"));
           
            onSnapshot(q, (snapshot) => {
                const newData = []
                snapshot.docs.forEach((doc) => {
                    newData.push({...doc.data(), id:doc.id})
                })
                console.log(newData);
                setTrackingList(newData);
            })

        } catch (error) {
            console.log(error);
        }; 
    };
        
    //!user狀態確認
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
          if (user) {
            setUser(user);
          } else {
            setUser(null);
          }
        });
      
        return () => unsubscribe();
    }, []);

    useEffect(()=>{
        fetchList();
        
    }, [user]);

    //delete todo
    const [isClicked, setIsClicked] = useState(true);
    const handleDelete = async (id) => {
        setIsClicked(true);
        await deleteDoc(doc(db, "trackingList", id));
        fetchList();
    }
    
    const navigate = useNavigate()
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
                                    <div  className={`${styles.trackText} ${track.change > 0 ? styles.red : track.change < 0 ? styles.green : ''}`}>
                                        {track.change}
                                    </div>
                                    <div  className={`${styles.trackText} ${track.change_percent > 0 ? styles.red : track.change_percent < 0 ? styles.green : ''}`}>
                                        {track.change_percent}%
                                    </div>
                                    <button className={styles.deleteBtn} onClick={() => handleDelete(track.id)}><RiDeleteBin5Line size={20} /></button>
                                </div>
                            ))
                        }
                    </div>
                ):(
                    <div className={styles.redirectMessageBox}>
                        <p>完整內容，僅限註冊會員使用</p>
                        <p>立即<Link to="/signup" style={{ color: "#0f73ee"}}>註冊</Link><span>或</span><Link to="/login" style={{ color: "#0f73ee"}}>登入</Link></p>
                        <></>
                    </div>
                )}
          </div>
        </div>
    );
}
export default TrackingList;


