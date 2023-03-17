import {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";

import { auth, googleProvider } from "../firebase/firebase";
import { signInWithPopup, signInWithEmailAndPassword} from "firebase/auth";

function useLogIn () {
    const navigate = useNavigate();


    const [logInErrorMessage, setLogInErrorMessage] = useState("");
    const [logInLoading, setLogInLoading] = useState(false);

    //log in with email
    const logIn = async (email, password) => {

        //輸入驗證
        const specialCharacters = /[`~!#$^&*()=|{}':;',\[\]<>《》\/?~！#￥……&*（）——|{}【】‘；：”“'。，、？ ]/;

        if (specialCharacters.test(email)  || specialCharacters.test(password)) {
            setLogInErrorMessage("請輸入中、英文或數字");
            return;
        };

        setLogInErrorMessage("");
        setLogInLoading(true);
        
        try{
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/home");
            setLogInLoading(false);
        }catch (error) {
            switch (error.code){
                case "auth/invalid-email":
                setLogInErrorMessage("信箱格式不正確");
                break;
                case "auth/user-not-found":
                setLogInErrorMessage("信箱不存在");
                break;
                case "auth/wrong-password":
                setLogInErrorMessage("密碼錯誤");
                break;
                default:
            }
            setLogInLoading(false);
            console.log(error);
        };
    };

    //log in with google
    const logInWithGoogle = async () => {
        setLogInErrorMessage("");
        setLogInLoading(true);
        try{
            await signInWithPopup(auth, googleProvider);
            navigate("/home");
            setLogInLoading(false);
        }catch (error) {
            if (error.code === "auth/popup-closed-by-user") {
                setLogInErrorMessage("用戶關閉視窗，登入失敗，請重新登入。")
            }else{
                setLogInErrorMessage(error.message);
            }
            setLogInLoading(false);
            console.log(error);
        };
    };

    return { logIn, logInWithGoogle, logInLoading, logInErrorMessage }
}
export {useLogIn};