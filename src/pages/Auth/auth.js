import React from "react";
import { useNavigate } from "react-router-dom";

import styles from "./auth.module.css";

export const Auth = () => {

    const navigate = useNavigate();

    function handleNavToLogIn() {
        navigate("/login");
    }

    function handleNavToSignUp() {
        navigate("/signup");
    }
    
    return (
        <div className={styles.authCard}>
            <div className={styles.stockBrain}>StockBrain</div>
            <div className={styles.welcomeText}>歡迎使用StockBrain</div>
            <div className={styles.content}>請選擇登入或註冊</div>
            <div className={styles.authBox}>
                <div className={styles.loginBtn} onClick={handleNavToLogIn}>登入</div>
                <div className={styles.signUpBtn} onClick={handleNavToSignUp}>註冊</div>
            </div>
        </div>
    );
};

