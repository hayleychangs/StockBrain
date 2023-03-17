import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

import { useLogIn } from "../../hooks/useLogIn";

import styles from "./logIn.module.css";

import { motion } from "framer-motion";

import google from "../../images/google.png";

export const LogIn = () => {

    const navigate = useNavigate();

    function handleNavToSignUp () {
        navigate("/signup");
    };

    function handleNavToHome () {
        navigate("/");
    };

    function Loading () {
        return (
            <>
                登入中...
            </>
        )
    };

    const { logIn, logInWithGoogle, logInLoading, logInErrorMessage} = useLogIn();

    const [email, setEmail] = useState("test@email.com");
    const [password, setPassword] = useState("test1234");
 
    //log in with email
    function handleLogIn () {
        logIn(email, password);
    };

    //log in with google
    function handleLogInWithGoogle () {
        logInWithGoogle(email, password);
    };

    const variants = {
        visible: {
          opacity: 1,
          x: 0,
          transition: { duration: 1.2 }
        },
        hidden: {
          opacity: 0,
          x: -50
        }
    };

    return (
        <motion.div
            variants={variants} 
            initial="hidden" 
            animate="visible"
            mode="wait" 
        >
            <div className={styles.brand} onClick={handleNavToHome}>StockBrain</div>
            <div className={styles.logInCard}>
                <div className={styles.welcomeText}>歡迎回來</div>
                <div className={styles.email}>
                    <input 
                        value={email}
                        type="text"
                        placeholder="請輸入電子郵件信箱"
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>
                <div className={styles.password}>
                    <input 
                        value={password}
                        type="password"
                        placeholder="請輸入密碼"
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>
                {logInErrorMessage && <div className={styles.errorMessage}>{logInErrorMessage}</div>}
                <button className={styles.logInBtn} onClick={handleLogIn}>
                    {logInLoading ? <Loading /> : "登入"}
                </button>
                <div className={styles.text}>還沒有帳戶？<span className={styles.clickToSignUp} onClick={handleNavToSignUp}>點此註冊</span></div>
                <hr className={styles.hr}/>
                <div className={styles.googleBox} onClick={handleLogInWithGoogle}>
                    <img className={styles.googleLogo} src={google} alt="Google Logo"/>
                    使用Google帳戶登入
                </div>
            </div>
        </motion.div>
    );
}