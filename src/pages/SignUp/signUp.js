import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

import { useSignUp } from "../../hooks/useSignUp";
import { useLogIn } from "../../hooks/useLogIn";

import styles from "./signUp.module.css";

import { motion } from "framer-motion";

import google from "../../images/google.png";

export const SignUp = () => {

    const navigate = useNavigate();

    function handleNavToLogIn () {
        navigate("/login");
    }

    function handleNavToHome () {
        navigate("/");
    }

    function Loading () {
        return (
            <>
                註冊中...
            </>
        )
    };


    const { signUp, signUpLoading, signUpErrorMessage} = useSignUp();
    const { logInWithGoogle, logInErrorMessage} = useLogIn();
    const errorMessage = signUpErrorMessage || logInErrorMessage;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");   

    function handleClick () {
        signUp(email, password);
    }

    function handleLogInWithGoogle () {
        logInWithGoogle(email, password);
    }

    //OnFocus & OnBlur & click
    function handleOnFocus (event) {
        event.target.placeholder="";
    }

    function handleOnBlur (event) {
        event.target.placeholder="請輸入電子郵件信箱";
    }

    function handleOnBlurPassword (event) {
        event.target.placeholder="請輸入密碼";
    }

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
    }

    return(
        <motion.div 
            variants={variants} 
            initial="hidden" 
            animate="visible"
            mode="wait"
        >
            <div className={styles.brand} onClick={handleNavToHome}>StockBrain</div>
            <div className={styles.signUpCard}>
                <div className={styles.welcomeText}>建立你的帳戶</div>
                <div className={styles.email}>
                    <input 
                        type="text"
                        placeholder="請輸入電子郵件信箱"
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={handleOnFocus}
                        onBlur={handleOnBlur}
                />
                </div>
                <div className={styles.password}>
                    <input 
                        type="password"
                        placeholder="請輸入密碼"
                        onChange={(event) => setPassword(event.target.value)}
                        onFocus={handleOnFocus}
                        onBlur={handleOnBlurPassword}
                    />
                </div>
                {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
                <button className={styles.signUpBtn} onClick={handleClick}>
                    {signUpLoading ? <Loading /> : "註冊"}
                </button>
                <div className={styles.text}>已經有帳戶了？<span className={styles.clickToLogin} onClick={handleNavToLogIn}>點此登入</span></div>
                <hr className={styles.hr}/>
                <div className={styles.googleBox} onClick={handleLogInWithGoogle}>
                    <img className={styles.googleLogo} src={google} alt="Google Logo"/>
                    使用Google帳戶登入
                </div>
            </div>
        </motion.div>
    )
}