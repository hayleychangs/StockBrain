import React, {useState} from "react";
import { useNavigate, Link } from "react-router-dom";

import { useTradePlans } from "../../hooks/useFirestore";
import { useDeleteDoc } from "../../hooks/useFirestore";

import styles from "./tradePlan.module.css";

import { ImMenu3, ImMenu4 } from "react-icons/im";
import { RiDeleteBin5Line } from "react-icons/ri";
import { RxTriangleDown, RxTriangleUp } from "react-icons/rx";

function TradePlan ({ onMenuToggle, user }) {
  const [sortedPlans, setSortedPlans] = useState([]);
  
  //read plan
  const { data: plans, loading } = useTradePlans(user?.uid);

  //delete plan
  const { handleDeleteDoc } = useDeleteDoc("tradePlan");
  async function handleDelete (event, id) {
    event.stopPropagation();
    await handleDeleteDoc(id);
  }

  //資料排序
  const [stockIdClickCount, setStockIdClickCount] = useState(0);
  const [RRRatioClickCount, setRRRatioClickCount] = useState(0);

  // id asc
  function handleSortByIdSmall () {
    const sortedPlans = [...plans].sort((a, b) => a.stock_id - b.stock_id);
    setSortedPlans(sortedPlans);
  };

  // id desc
  function handleSortByIdBig () {
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
  function handleSortByRRRatioSmall () {
    const sortedPlans = [...plans].sort((a, b) => a.RR_ratio - b.RR_ratio);
    setSortedPlans(sortedPlans);
  };

  // RRRatio desc
  function handleSortByRRRatioBig () {
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

  // 判斷是否顯示排序後的資料
  const displayPlans = sortedPlans.length ? sortedPlans : plans;

  const navigate = useNavigate();
  function handleSinglePlanClick (keyword) {
      navigate(`/home/${keyword}`)

      const chartContainer = document.querySelector(".searchBar-module__input___O_uKh");
      const containerOffsetTop = chartContainer.offsetTop;

      window.scrollTo({ top: containerOffsetTop, behavior: "smooth" });
  }


  //menu show hide
  const [isOpen, setIsOpen] = useState(true);

  function handleClick () {
    setIsOpen(!isOpen);
    onMenuToggle();
  };

  return (
    <div className={styles.tradePlan}>
      <div className={styles.title} onClick={handleClick}>
      {isOpen ? <ImMenu4 /> : <ImMenu3 />}
        <span> 交易計畫</span>
      </div>
      {isOpen && (
        <div className={styles.container}>
          <div className={styles.planBox}>
            <div className={styles.subTitle}>
              <div className={styles.subTitleStockId} onClick={handleStockIdClick}>
                {stockIdClickCount % 2 === 0 ?  <RxTriangleDown /> : <RxTriangleUp />}股票代號
              </div>
              <div>股票名稱</div>
              <div>預計買進(賣出)價位</div>
              <div>預計停損價位</div>
              <div>預計停損幅度</div>
              <div>預計停利價位</div>
              <div>預計停利幅度</div>
              <div className={styles.subTitleRRRatio} onClick={handleRRRatioClick}>
                {RRRatioClickCount % 2 === 0 ?  <RxTriangleDown /> : <RxTriangleUp />}風險報酬比
              </div>
            </div>
              {user ? (
                <div className={styles.allPlan}>
                    {loading ? (
                        <div className={styles.loadingText}>
                          <p>資料整理中，請稍候...</p>
                        </div>
                      ) : (
                        displayPlans.map((plan)=>(
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
                        ))
                      )
                    }
                </div>
              ) : (
                <div className={styles.redirectMessageBox}>
                    <p>完整內容，僅限註冊會員使用</p>
                    <p>
                      立即<Link to="/signup" style={{ color: "#0f73ee"}}> 註冊</Link><span> 或 </span><Link to="/login" style={{ color: "#0f73ee"}}>登入<span style={{fontSize:"10px"}}> (測試帳號)</span></Link>
                    </p>
                    <></>
                </div>
              )
            }
          </div>
        </div>
      )}
    </div>
  );
}
export default TradePlan;