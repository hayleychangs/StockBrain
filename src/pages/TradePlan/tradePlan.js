import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";

import { collection, addDoc, query, getDocs, deleteDoc, doc, serverTimestamp, orderBy, where, onSnapshot, updateDoc } from 'firebase/firestore';
import {db, auth} from "../../firebase/firebase";
import { onAuthStateChanged } from 'firebase/auth';

import styles from "./tradePlan.module.css";

import { ImMenu3, ImMenu4 } from "react-icons/im";

function TradePlan ({ onMenuToggle }) {
  //user狀態確認
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

  
    //menu shoe hide ----------------------------
    const [isOpen, setIsOpen] = useState(true);

    const handleClick = () => {
      setIsOpen(!isOpen);
      onMenuToggle();
    };
  
    //------------------------------------------


  return (
    <div className={styles.tradePlan}>
      <div className={styles.title} onClick={handleClick}>
      {isOpen ? <ImMenu4 /> : <ImMenu3 />}
        <span> 交易計畫</span>
      </div>
      {isOpen && (
        <div className={styles.container}>
            <div className={styles.content}>測試123</div>
        </div>
      )}
    </div>
  );
}
export default TradePlan;