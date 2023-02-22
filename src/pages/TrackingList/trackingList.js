import React, { useState, useEffect }  from "react";
import { useNavigate } from "react-router-dom";

import styles from "./trackingList.module.css";

import { collection, addDoc, query, getDocs, deleteDoc, doc, serverTimestamp, orderBy, where, onSnapshot } from "firebase/firestore";
import {db, auth} from "../../firebase/firebase";
import { onAuthStateChanged } from 'firebase/auth';


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
                {/* <form className={styles.inputForm} onSubmit={handleSubmit}>
                    <input className={styles.inputText}
                        type="text" 
                        value={inputValue} 
                        onChange={(e) => setInputValue(e.target.value)}
                    />  
                    <button className={styles.addtrackBtn} type="submit">新增紀錄</button> 
                </form> */}
                <div className={styles.subTitle}>
                        <div>股票代號</div>
                        <div>股票名稱</div>
                        <div>收盤價</div>
                        <div>漲跌元</div>
                        <div>漲跌幅</div>
                </div>
                <div className={styles.allTrackingList}>
                    {
                        trackingList?.map((track,i)=>(
                            <div className={styles.singleTrack} key={i} onClick={() => handleClick(track.stock_id)}>
                                <div className={styles.trackText}>
                                    {track.stock_id}
                                </div>
                                 <div>
                                    {track.stock_name}
                                 </div>
                                <div>
                                    {track.close}
                                </div>
                                <div>
                                    {track.change}
                                </div>
                                <div>
                                    {track.change_percent}%
                                </div>
                                <button className={styles.deleteBtn} onClick={() => handleDelete(track.id)}>刪除</button>
                            </div>
                        ))
                    }
                </div>     
          </div>
        </div>
    );
}
export default TrackingList;


