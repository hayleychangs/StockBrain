import  React from "react";

import HomeNavigation from "../../components/homeNavigation/HomeNavigation";

import styles from "./contact.module.css";

import { motion } from "framer-motion";

function Contact () {

    //OnFocus & OnBlur
    function handleOnFocusName (event) {
        event.target.placeholder="";
    };

    function handleOnBlurName (event) {
        event.target.placeholder="請填寫姓名";
    };

    function handleOnFocusEmail (event) {
        event.target.placeholder="";
    };

    function handleOnBlurEmail (event) {
        event.target.placeholder="請填寫Email";
    };

    function handleOnFocusMsg (event) {
        event.target.placeholder="";
    };

    function handleOnBlurMsg (event) {
        event.target.placeholder="請填寫您想說的話";
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
       <div>
            <div className={styles.textContainer}>
                <HomeNavigation />
                <motion.div 
                    className={styles.text}
                    variants={variants} 
                    initial="hidden" 
                    animate="visible"
                    mode="wait"
                >
                    <div className={styles.contactUs}>聯絡我們</div>
                    <div className={styles.form}>
                        <div className={styles.formItem}>
                            <div className={styles.formTitle}>姓名</div>
                            <div className={styles.formElement}>
                                <input type="text" placeholder="請填寫姓名" onFocus={handleOnFocusName} onBlur={handleOnBlurName} />
                            </div>
                        </div>
                        <div className={styles.formItem}>
                            <div className={styles.formTitle}>Email</div>
                            <div className={styles.formElement}>
                                <input type="email" placeholder="請填寫Email" onFocus={handleOnFocusEmail} onBlur={handleOnBlurEmail}/>
                            </div>
                        </div>
                        <div className={styles.formItem}>
                            <div className={styles.formTitle}>訊息</div>
                            <div className={styles.formElement}>
                                <input type="text" placeholder="請填寫您想說的話" onFocus={handleOnFocusMsg} onBlur={handleOnBlurMsg} />
                            </div>
                        </div>
                        <button className={styles.btn}>發送訊息</button>
                    </div>
                </motion.div>
            </div>
            <div className={styles.svgContainer}>
                <svg width="100%" height="120vh" viewBox="0 0 1920 1000" preserveAspectRatio="xMidYMid meet">
                    <path className={styles.curve}
                        d="M0 1920 
                        C-185 520,240 520, 360 700
                        S500 500, 720 600 
                        S960 420, 1080 700
                        S1340 200, 1920 650
                        V1920 Z"

                        strokeWidth="5"
                        fill="rgba(146,205,250)"
                    />
                </svg>
            </div>
        </div>
    )
}
export default Contact;