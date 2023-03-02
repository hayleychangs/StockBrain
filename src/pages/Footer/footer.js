import React from "react";

import styles from "./footer.module.css";

function Footer(){
    return(
        <div className={styles.footer}>
            <div>
                本網站提供之資訊內容僅供參考，對於資料內容錯誤、更新延誤或傳輸中斷，本網站不負任何法律責任；投資人對任何參考資料仍需自行判斷，一切交易所生之風險或損失均與本網站無關，特此聲明。
            </div>
            
        </div> 
    )
}
export default Footer;