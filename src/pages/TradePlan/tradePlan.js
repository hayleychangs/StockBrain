import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { collection, addDoc, query, getDocs, deleteDoc, doc, serverTimestamp, orderBy, where, onSnapshot, updateDoc, QuerySnapshot } from 'firebase/firestore';
import {db, auth} from "../../firebase/firebase";
import { onAuthStateChanged } from 'firebase/auth';

import styles from "./tradePlan.module.css";

import { ImMenu3, ImMenu4 } from "react-icons/im";
import { RiDeleteBin5Line } from "react-icons/ri";
import { RxTriangleDown, RxTriangleUp } from "react-icons/rx";

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


  //read plan-----------------------------
  const [plans, setPlans] = useState([]);
  async function fetchPlans () {

    if (!user) {
      return;
    }

    console.log("37-列印", auth?.currentUser?.uid);

    const plansRef = collection(db, "tradePlan");
    const q = query(plansRef, where("user_id", "==", auth?.currentUser?.uid), orderBy("timestamp", "desc"));

    onSnapshot(q, (querySnapshot) => {
      const result = [];
      querySnapshot.forEach((doc) => {
        result.push({...doc.data(), id: doc.id});
      });
      console.log("列印符合條件的交易計畫", result);
      setPlans(result);

    });
  }

  useEffect(() => {
    fetchPlans();
    console.log("53-列印交易計畫", plans);
  }, [user])
  //-------------------------------------


  //delete plan-----------------------------
  async function handleDelete (id) {
    await deleteDoc(doc(db, "tradePlan", id));
  }
  //----------------------------------------


  //資料排序---------------------------------
  const [stockIdClickCount, setStockIdClickCount] = useState(0);
  const [RRRatioClickCount, setRRRatioClickCount] = useState(0);

  // id asc
  const handleSortByIdSmall = () => {
    const sortedPlans = [...plans].sort((a, b) => a.stock_id - b.stock_id);
    setPlans(sortedPlans);
  };

  // id desc
  const handleSortByIdBig = () => {
    const sortedPlans = [...plans].sort((a, b) => b.stock_id - a.stock_id);
    setPlans(sortedPlans);
  };

  function handleStockIdClick () {
    if (stockIdClickCount % 2 === 0) {
      handleSortByIdBig();
    } else {
      handleSortByIdSmall();
    }
    setStockIdClickCount(stockIdClickCount + 1);
  }

  // RRRatio asc
  const handleSortByRRRatioSmall = () => {
    const sortedPlans = [...plans].sort((a, b) => a.RR_ratio - b.RR_ratio);
    setPlans(sortedPlans);
  };

  // RRRatio desc
  const handleSortByRRRatioBig = () => {
    const sortedPlans = [...plans].sort((a, b) => b.RR_ratio - a.RR_ratio);
    setPlans(sortedPlans);
  };

  function handleRRRatioClick () {
    if (RRRatioClickCount % 2 === 0) {
      handleSortByRRRatioBig();
    } else {
      handleSortByRRRatioSmall();
    }
    setRRRatioClickCount(RRRatioClickCount + 1);
  }

  //----------------------------------------


  const navigate = useNavigate()
  function handleSinglePlanClick (keyword) {
      navigate(`/home/${keyword}`)
  }


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
            <div className={styles.subTitle}>
              <div onClick={handleStockIdClick}>
                {stockIdClickCount % 2 === 0 ?  <RxTriangleDown /> : <RxTriangleUp />}股票代號
              </div>
              <div>股票名稱</div>
              <div>預計買進(賣出)價位</div>
              <div>預計停損價位</div>
              <div>預計停損幅度</div>
              <div>預計停利價位</div>
              <div>預計停利幅度</div>
              <div onClick={handleRRRatioClick}>
                {RRRatioClickCount % 2 === 0 ?  <RxTriangleDown /> : <RxTriangleUp />}風險報酬比
              </div>
            </div>
            <div className={styles.allPlan}>
              {plans?
                plans.map((plan)=>(
                <div className={styles.singlePlan} key={plan.id} onClick={() => handleSinglePlanClick(plan.stock_id)}>
                  <div className={styles.stockId}>
                    {plan.stock_id}
                  </div>
                  <div className={styles.stockName}>
                    {plan.stock_name}
                  </div>
                  <div className={styles.purchasePrice}>
                    {plan.purchase_price}
                  </div>
                  <div className={styles.stopLossPoint}>
                    {plan.stop_loss_point}
                  </div>
                  <div className={styles.lossRatio}>
                    {plan.loss_ratio}%
                  </div>
                  <div className={styles.stopProfitPoint}>
                    {plan.stop_profit_point}
                  </div>
                  <div className={styles.ProfitRatio}>
                    {plan.profit_ratio}%
                  </div>
                  <div className={styles.RRRatio}>
                    {plan.RR_ratio}
                  </div>
                  <div className={styles.deleteBtn} onClick={() => handleDelete(plan.id)}><RiDeleteBin5Line size={25} /></div>
                </div>
              ))
              :
              <p>Loading...</p>
            }
            </div>

        </div>
      )}
    </div>
  );
}
export default TradePlan;