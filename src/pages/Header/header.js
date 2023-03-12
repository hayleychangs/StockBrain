import  React, {useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Avatar from 'react-avatar';
import classNames from 'classnames';

import UseAuth from "../../hooks/useAuth";

import { auth } from "../../firebase/firebase";
import { signOut } from "firebase/auth";

import styles from "./header.module.css";
import defaultAvatar from "../../images/default.png";

import { FiLogOut} from "react-icons/fi";

function Header(){
    const user = UseAuth();

    const [photoURL, setPhotoURL] = useState("");
 
     useEffect(() => {
             if (user) {
             const url = user.photoURL;
             setPhotoURL(url || "");
             } else {
             setPhotoURL("");
             }
     }, [user]);

    const navigate = useNavigate();

    //sign out
    async function logOut () {
        try{
            await signOut(auth);
            navigate("/");
        }catch (error){
            console.log(error);
        }
    };

    function backToMain () {
        navigate("/home");
    }

    function backToHome () {
        navigate("/");
    }

    const [boxShadow, setBoxShadow] = useState('none');
    const [showPopup, setShowPopup] = useState(false);

    let popUpRef = useRef();

    useEffect(() => {
        const  handler = (e) => {
            if(!popUpRef.current.contains(e.target)){
                setShowPopup(false);
            }
        };
        document.addEventListener("mousedown", handler);

        return() =>{
            document.removeEventListener("mousedown", handler);
        }
    })

    useEffect(() => {
        const handleScroll = () => {
          const scrollPos = window.scrollY;
          if (scrollPos >= 100) {
            setBoxShadow('0 2px 5px rgba(0, 0, 0, 0.2)');
          } else {
            setBoxShadow('none');
          }
        };
        window.addEventListener('scroll', handleScroll);
    
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className={styles.header} style={{ boxShadow }}>
            <div className={styles.headerContent}>
                {user ? 
                    <h2 className={styles.theme} onClick={backToMain}>StockBrain</h2>
                    :
                    <h2 className={styles.theme} onClick={backToHome}>StockBrain</h2>
                }
                <nav ref={popUpRef}>
                    {user ?
                        <div 
                            className={styles.navItem} 
                            onClick={() => setShowPopup(!showPopup)}
                            data-display-name={user.displayName ? `Hi! ${user.displayName}` : '來設定暱稱吧!'}
                        >
                            <Avatar 
                                src={photoURL ? photoURL : defaultAvatar}
                                size={40} round={true} style={{ border: 'none' }} 
                                alt="User"
                                className={styles.userHead}
                            />
                        </div>
                        :
                        <div>
                            <p><Link to="/signup" className={styles.signUpText}>註冊</Link><span className={styles.dividingLine}> ｜ </span><Link to="/login" className={styles.loginInText}>登入</Link></p>
                        </div>
                    }
                        <div className={classNames(!showPopup ? styles['popup-inactive'] : styles['popup-active'])}>
                            <div className={styles.popupContent}>
                                <div className={styles.myAccountLink} onClick={() => navigate("/myaccount")}>
                                    我的帳戶
                                </div>
                                <div className={styles.logOutLink} onClick={logOut}>
                                    <FiLogOut  size={20} color="#666666" /><span className={styles.logOut}>登出</span>
                                </div>
                            </div>
                        </div>
                    
                </nav>
            </div>
            
        </div>
    )
}

export default Header;