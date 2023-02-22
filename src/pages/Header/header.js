import  React, {useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { auth } from "../../firebase/firebase";
import { signOut } from "firebase/auth";

import styles from "./header.module.css";

import { VscSignOut } from "react-icons/vsc";
import { GoSignOut } from "react-icons/go";
import { FiLogOut} from "react-icons/fi";

function Header(){

    const navigate = useNavigate();

    //sign out
    const logOut = async () => {
        try{
            await signOut(auth);
            navigate("/");
            console.log("登出成功")
        }catch (error){
            console.log(error);
        }
    };

    const [boxShadow, setBoxShadow] = useState('none');
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
                <a href="/home">
                    <h2 className={styles.theme}>StockBrain</h2>
                </a>
                <nav>
                    <div className={styles.navItem} onClick={logOut}><FiLogOut  size={25} color="#666666" /></div>
                </nav>
            </div>
        </div>
    )
}

export default Header;