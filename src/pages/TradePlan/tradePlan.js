import React, {useState, useEffect} from "react";
import { useNavigate, Link } from "react-router-dom";

import { useTradePlans } from "../../hooks/useFirestore";
import { collection, query, deleteDoc, doc, orderBy, where, onSnapshot } from 'firebase/firestore';
import { db } from "../../firebase/firebase";

import styles from "./tradePlan.module.css";

import { ImMenu3, ImMenu4 } from "react-icons/im";
import { RiDeleteBin5Line } from "react-icons/ri";
import { RxTriangleDown, RxTriangleUp } from "react-icons/rx";

function TradePlan ({ onMenuToggle, user }) {
  const [sortedPlans, setSortedPlans] = useState([]);
  
  //!read plan-----------------------------
  // const [loading, setLoading] = useState(false);
  
  // async function fetchPlans () {

  //   if (!user) {
  //     return;
  //   }

  //   setLoading(true);

  //   const plansRef = collection(db, "tradePlan");
  //   const q = query(plansRef, where("user_id", "==", user.uid), orderBy("timestamp", "desc"));

  //   onSnapshot(q, (querySnapshot) => {
  //     const result = [];
  //     querySnapshot.forEach((doc) => {
  //       result.push({...doc.data(), id: doc.id});
  //     });
  //     setPlans(result);
  //     setLoading(false);
  //   });
  // }

  // useEffect(() => {
  //   fetchPlans();
  // }, [user])
  //-------------------------------------

  const { data: plans, loading } = useTradePlans(user?.uid);


  //delete plan-----------------------------
  async function handleDelete (event, id) {
    event.stopPropagation();
    await deleteDoc(doc(db, "tradePlan", id));
  }
  //----------------------------------------


  //θ³ζζεΊ---------------------------------
  const [stockIdClickCount, setStockIdClickCount] = useState(0);
  const [RRRatioClickCount, setRRRatioClickCount] = useState(0);

  // id asc
  const handleSortByIdSmall = () => {
    const sortedPlans = [...plans].sort((a, b) => a.stock_id - b.stock_id);
    setSortedPlans(sortedPlans);
  };

  // id desc
  const handleSortByIdBig = () => {
    const sortedPlans = [...plans].sort((a, b) => b.stock_id - a.stock_id);
    setSortedPlans(sortedPlans);
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
    setSortedPlans(sortedPlans);
  };

  // RRRatio desc
  const handleSortByRRRatioBig = () => {
    const sortedPlans = [...plans].sort((a, b) => b.RR_ratio - a.RR_ratio);
    setSortedPlans(sortedPlans);
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

  // ε€ζ·ζ―ε¦ι‘―η€ΊζεΊεΎηθ³ζ
  const displayPlans = sortedPlans.length ? sortedPlans : plans;


  const navigate = useNavigate()
  function handleSinglePlanClick (keyword) {
      navigate(`/home/${keyword}`)

      const chartContainer = document.querySelector(".searchBar-module__input___O_uKh");
      const containerOffsetTop = chartContainer.offsetTop;

      window.scrollTo({ top: containerOffsetTop, behavior: "smooth" });
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
        <span> δΊ€ζθ¨η«</span>
      </div>
      {isOpen && (
        <div className={styles.container}>
          <div className={styles.planBox}>
            <div className={styles.subTitle}>
              <div className={styles.subTitleStockId} onClick={handleStockIdClick}>
                {stockIdClickCount % 2 === 0 ?  <RxTriangleDown /> : <RxTriangleUp />}θ‘η₯¨δ»£θ
              </div>
              <div>θ‘η₯¨εη¨±</div>
              <div>ι θ¨θ²·ι²(θ³£εΊ)εΉδ½</div>
              <div>ι θ¨εζεΉδ½</div>
              <div>ι θ¨εζεΉεΊ¦</div>
              <div>ι θ¨εε©εΉδ½</div>
              <div>ι θ¨εε©εΉεΊ¦</div>
              <div className={styles.subTitleRRRatio} onClick={handleRRRatioClick}>
                {RRRatioClickCount % 2 === 0 ?  <RxTriangleDown /> : <RxTriangleUp />}ι’¨ιͺε ±ι¬ζ―
              </div>
            </div>
            {loading ? ( user ? (
              <div className={styles.loadingText}>
                <p>θ³ζζ΄ηδΈ­οΌθ«η¨ε...</p>
              </div>) : (
                <div className={styles.redirectMessageBox}>
                  <p>ε?ζ΄ε§ε?ΉοΌειθ¨»εζε‘δ½Ώη¨</p>
                  <p>
                    η«ε³<Link to="/signup" style={{ color: "#0f73ee"}}>θ¨»ε</Link><span>ζ</span><Link to="/login" style={{ color: "#0f73ee"}}>η»ε₯</Link>
                  </p>
                </div>
            )
            ) : (
              user ? (
                <div className={styles.allPlan}>
                  {displayPlans.map((plan)=>(
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
                        <div className={styles.deleteBtn} onClick={(event) =>{handleDelete(event, plan.id)}}><RiDeleteBin5Line size={25} /></div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className={styles.redirectMessageBox}>
                    <p>ε?ζ΄ε§ε?ΉοΌειθ¨»εζε‘δ½Ώη¨</p>
                    <p>η«ε³<Link to="/signup" style={{ color: "#0f73ee"}}>θ¨»ε</Link><span>ζ</span><Link to="/login" style={{ color: "#0f73ee"}}>η»ε₯</Link></p>
                    <></>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default TradePlan;