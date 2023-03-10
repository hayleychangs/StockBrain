import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

import { auth, googleProvider } from "../../firebase/firebase";
import { signInWithPopup, signInWithEmailAndPassword} from "firebase/auth";

import styles from "./logIn.module.css";

export const LogIn = () => {

    const navigate = useNavigate();

    function handleNavToSignUp() {
        navigate("/signup");
    }

    const Loading = () => {
        return (
            <>
                登入中...
            </>
        )
    };


    const [email, setEmail] = useState("test@email.com");
    const [password, setPassword] = useState("test1234");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

     //sign in 
     const signIn = async () => {
        setIsLoading(true);
        try{
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/home");
            setIsLoading(false);
        }catch (error) {
            switch (error.code){
                case "auth/invalid-email":
                setErrorMessage("信箱格式不正確");
                break;
                case "auth/user-not-found":
                setErrorMessage("信箱不存在");
                break;
                case "auth/wrong-password":
                setErrorMessage("密碼錯誤");
                break;
                default:
            }
            setIsLoading(false);
            console.log(error);
        }
    };

    //sign in with google
    const signInWithGoogle = async () => {
        setIsLoading(true);
        try{
            await signInWithPopup(auth, googleProvider);
            navigate("/home");
            setIsLoading(false);
        }catch (error){
            console.log(error);
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className={styles.brand}>StockBrain</div>
            <div className={styles.logInCard}>
                <div className={styles.welcomeText}>歡迎回來</div>
                <div className={styles.email}>
                    <input 
                        value={email}
                        type="text"
                        placeholder="請輸入電子郵件信箱"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className={styles.password}>
                    <input 
                        value={password}
                        type="password"
                        placeholder="請輸入密碼"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
                <button className={styles.logInBtn} onClick={signIn}>
                    {isLoading ? <Loading /> : "登入"}
                </button>
                <div className={styles.text}>還沒有帳戶？<span className={styles.clickToSignUp} onClick={handleNavToSignUp}>點此註冊</span></div>
                <hr className={styles.hr}/>
                <div className={styles.googleBox} onClick={signInWithGoogle}>使用Google帳戶登入</div>
            </div>
        </>
    );
}