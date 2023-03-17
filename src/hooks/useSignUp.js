import {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";

import { auth } from "../firebase/firebase";
import {createUserWithEmailAndPassword } from "firebase/auth";

function useSignUp () {
    const navigate = useNavigate();

    //輸入驗證
    const EmailRegex = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
    const PasswordRegex=/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/;

    const [signUpErrorMessage, setSignUpErrorMessage] = useState("");
    const [signUpLoading, setSignUpLoading] = useState(false);

    // sign up
    const signUp = async (email, password) => {

        if (password=="" || email=="") {
            setSignUpErrorMessage("請輸入完整的註冊資訊！");
            return;
        };

        if (!EmailRegex.test(email)) {
            setSignUpErrorMessage("請填寫正確的Email格式：stock123@example.com");
            return;
        };

        if (!PasswordRegex.test(password)) {
            setSignUpErrorMessage("密碼長度須介於8~12字，且包含數字及英文字");
            return;
        };

        setSignUpErrorMessage("");
        setSignUpLoading(true);

        try{
            await createUserWithEmailAndPassword(auth, email, password);
            navigate("/home");
            setSignUpLoading(false);
        }catch (error) {
            switch (error.code){
                case "auth/email-already-in-use":
                setSignUpErrorMessage("信箱已存在");
                break;
                case "auth/invalid-email":
                setSignUpErrorMessage("請填寫正確的Email格式：stock123@example.com");
                break;
                case "auth/weak-password":
                setSignUpErrorMessage("密碼強度不足，長度需大於6個字");
                break;
                default:
            }
            setSignUpLoading(false);
            console.log(error);
        };
    };

    return {signUp, signUpLoading, signUpErrorMessage}
}
export {useSignUp};