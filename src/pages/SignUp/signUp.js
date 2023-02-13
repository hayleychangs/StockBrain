import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

import { auth, googleProvider } from "../../firebase/firebase";
import {createUserWithEmailAndPassword, signInWithPopup} from "firebase/auth";

import styles from "./signUp.module.css";

export const SignUp = () => {

    const navigate = useNavigate();

    function handleNavToLogIn() {
        navigate("/login");
    }

    const Loading = () => {
        return (
            <>
                註冊中...
            </>
        )
    };


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    console.log(auth?.currentUser?.email)

    // sign up
    const signUp = async () => {
        setIsLoading(true);
        try{
            await createUserWithEmailAndPassword(auth, email, password);
            navigate("/home");
            setIsLoading(false);
        }catch (error) {
            switch (error.code){
                case "auth/email-already-in-use":
                setErrorMessage("信箱已存在");
                break;
                case "auth/invalid-email":
                setErrorMessage("信箱格式不正確");
                break;
                case "auth/weak-password":
                setErrorMessage("密碼強度不足");
                break;
                default:
            }
            setIsLoading(false);
            console.log(error);
        }
    };

    //sign in with google
    const signInWithGoogle = async () => {
        try{
            await signInWithPopup(auth, googleProvider);
            navigate("/home");
            setIsLoading(false);
        }catch (error) {
            switch (error.code){
                case "auth/email-already-in-use":
                setErrorMessage("信箱已存在");
                break;
                case "auth/invalid-email":
                setErrorMessage("信箱格式不正確");
                break;
                case "auth/weak-password":
                setErrorMessage("密碼強度不足");
                break;
                default:
            }
            setIsLoading(false);
            console.log(error);
        }
    };


    return(
        <div className={styles.signUpCard}>
            <div className={styles.welcomeText}>建立你的帳戶</div>
           <div className={styles.email}>
                <input 
                    type="text"
                    placeholder="請輸入電子郵件信箱"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className={styles.password}>
                <input 
                    type="password"
                    placeholder="請輸入密碼"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
            <button className={styles.signUpBtn} onClick={signUp}>
                {isLoading ? <Loading /> : "註冊"}
            </button>
            <div className={styles.text}>已經有帳戶了？<span className={styles.clickToLogin} onClick={handleNavToLogIn}>點此登入</span></div>
            <hr className={styles.hr}/>
            <div className={styles.googleBox} onClick={signInWithGoogle}>使用Google帳戶登入</div>
        </div>
    )
}