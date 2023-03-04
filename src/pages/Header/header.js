import  React, {useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Avatar from 'react-avatar';
import classNames from 'classnames';

import { auth } from "../../firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

import styles from "./header.module.css";
import defaultAvatar from "../../images/default.png";

import { VscSignOut } from "react-icons/vsc";
import { GoSignOut } from "react-icons/go";
import { FiLogOut} from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";

function Header(){
     //user狀態確認
     const [user, setUser] = useState(null);
     const [photoURL, setPhotoURL] = useState("");
 
     useEffect(() => {
         const unsubscribe = onAuthStateChanged(auth, user => {
             if (user) {
             setUser(user);
             const url = user.photoURL;
             setPhotoURL(url || "");
             } else {
             setUser(null);
             setPhotoURL("");
             }
         });
         return () => unsubscribe();
     }, []);

    const navigate = useNavigate();

    //sign out
    async function logOut () {
        try{
            await signOut(auth);
            navigate("/");
            console.log("登出成功")
        }catch (error){
            console.log(error);
        }
    };

    function backToHome () {
        navigate("/home");
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
                <h2 className={styles.theme} onClick={backToHome}>StockBrain</h2>
                <nav ref={popUpRef}>
                    {user ?
                        <div 
                            className={styles.navItem} 
                            onClick={() => setShowPopup(!showPopup)}
                            data-display-name={`Hi! ${user.displayName}` || ''}
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
                            <p><Link to="/signup" style={{ color: "#0f73ee"}}>註冊</Link><span> ｜ </span><Link to="/login" style={{ color: "#0f73ee"}}>登入</Link></p>
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