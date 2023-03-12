import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from 'react-avatar';
import classNames from 'classnames';

import Header from "../Header/header";
import UseAuth from "../../hooks/useAuth";

import { auth, storage} from "../../firebase/firebase";
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {v4} from "uuid";

import styles from "./memberSettings.module.css";

import defaultAvatar from "../../images/default.png";
import { HiCamera } from "react-icons/hi";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { TbEdit, TbCheckbox } from "react-icons/tb";
import { MdOutlineErrorOutline } from "react-icons/md";
import { BiArrowBack } from "react-icons/bi";

function MemberSettings () {
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

    //*照片上傳-----------------------
    const [imageUpload, setImageUpload] = useState(null);

    const previewImageUrl = imageUpload ? URL.createObjectURL(imageUpload) : null;

    const handleImageUpload = e => {
        const file = e.target.files[0];
        if (file) {
          setImageUpload(e.target.files[0]);
        }
      };

    const handleImageSubmit = () => {
    if (!imageUpload) return;
    const imageName = `${v4()}_${imageUpload.name}`;
    const imageRef = ref(storage, `user_photos/${imageName}`);
    setIsLoading(true);
    uploadBytes(imageRef, imageUpload)
        .then(() => getDownloadURL(imageRef))
        .then(url => {
            setPhotoURL(url);
            updateProfile(user, {
            photoURL: url,
          }).then(() => {
            setIsLoading(false);
            setShowPopup(false);
          }).catch((error) => {
            setIsLoading(false);
            console.error("照片上傳失敗", error);
          });  
        });
    };
    
    //*------------------------------

    //*修改名稱-----------------------
    const [newDisplayName, setNewDisplayName] = useState("");
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showWErrorMessage, setShowErrorMessage] = useState(false);

    const handleChangeDisplayName = () => {
        if (!newDisplayName) return;

        if (newDisplayName.length > 10) {
            setShowErrorMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
                setShowErrorMessage(null);
              }, 3000);
            return;
        }

        updateProfile(user, {
          displayName: newDisplayName,
        })
          .then(() => {
            setShowSuccessMessage(true);
            setNewDisplayName("");
            setTimeout(() => {
                setShowSuccessMessage(false);
                setShowErrorMessage(null);
              }, 3000);
          })
          .catch((error) => {
            console.error("暱稱更新失敗", error);
            setShowErrorMessage("暱稱更新失敗");
          });
      };
    //*------------------------------


    //*修改密碼-----------------------
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChangePassword = (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            setError('新密碼與確認密碼不符');
            return;
        }

        if (newPassword.length < 6) {
            setError("密碼長度需大於6個字");
            return;
        }

        if (newPassword === currentPassword) {
            setError('不得設定與當前密碼相同的新密碼');
            return;
        }
    
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword
        );
    
        reauthenticateWithCredential(user, credential)
          .then(() => {
            updatePassword(user, newPassword);
          })
          .then(() => {
            setSuccess(true);
            setError("");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
            setTimeout(() => {
                setSuccess(false);
                setError(null);
                setChangePasswordPopup(false);
              }, 2000);
          })
          .catch((error) => {
            setError("當前密碼輸入錯誤");
            console.log(error);
          });
    };

    //*------------------------------


    //popup---------------------------------
    const [showPopup, setShowPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [changePasswordPopup, setChangePasswordPopup] = useState(false);

    const Loading = () => {
        return (
            <>
                照片上傳中...
            </>
        )
    };
    //---------------------------------

    //-----OnFocus & OnBlur & click---------------------
    const [memberNickName, setMemberNickName] = useState("");

    const handleOnFocus = (event) => {
        event.target.placeholder="";
    }

    const handleOnBlur = (event) => {
        event.target.placeholder="還沒有暱稱嗎，快來新增!";
        setMemberNickName("");
    }
    //-------------------------------------------------

    const navigate = useNavigate();
    function backToHome () {
        navigate("/home");
    }

    return (
        <div>
            <div className={styles.header}>
                {<Header />}
            </div>
            {user ? (
                <div className={styles.memberSettings}>
                    <div className={styles.memberCard}>
                        <div className={styles.leftSide}>
                            <div className={styles.photoBox}>
                                <div className={styles.avatarBox} onClick={() => setShowPopup(true)}>
                                    <Avatar 
                                        src={photoURL ? photoURL : defaultAvatar}
                                        size={200} round={true} style={{ border: 'none' }} 
                                        alt="上傳的照片" className={classNames(!photoURL ? styles['defaultAvatar'] : styles['original'])}
                                    />
                                    <HiCamera className={styles.cameraICon} size={40} color="white"/>
                                </div>
                                <div className={styles.showNickName}>
                                    {user.displayName || ''}
                                </div>
                                {showPopup && (
                                    <>
                                        <div className={styles.overlay} onClick={() => {setShowPopup(false), setImageUpload(false)}}/>
                                        <div className={styles.popup}>
                                            <div className={styles.popupBox}>
                                                <div className={styles.closeBar}>
                                                    <IoIosCloseCircleOutline className={styles.closeIcon} size={30} onClick={() => {setShowPopup(false), setImageUpload(false)}}/>
                                                </div>
                                                <div className={styles.previewAvatar}>
                                                    <Avatar
                                                        src={previewImageUrl || photoURL || defaultAvatar}
                                                        size={200}
                                                        round={true}
                                                        style={{ border: 'none' }}
                                                        alt="預覽照片"
                                                        className={classNames(previewImageUrl ? styles['preview'] : styles['popUpAvatar'])}
                                                    />
                                                </div>
                                                <div className={styles.buttonBox}>
                                                    <label htmlFor="file-upload">
                                                        <button className={styles.uploadBtn} onClick={() => document.getElementById('file-upload').click()}>選擇檔案</button>
                                                    </label>
                                                    <input id="file-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
                                                    <button className={styles.submitBtn} onClick={handleImageSubmit}>{isLoading ? <Loading /> : "上傳照片"}</button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className={styles.backToHomeBtn} onClick={backToHome}>
                                <BiArrowBack className={styles.arrowBack} size={20} /><span className={styles.backHomeText}> 返回首頁</span>
                            </div>
                        </div>
                        <div className={styles.rightSide}>
                            <div className={styles.title}>StockBrain 會員資料設定</div>
                            <div className={styles.memberInfoBox}>
                                <div className={styles.memberInfo}>
                                    <div className={styles.infoItem}>
                                        會員帳號：
                                    </div>
                                    <span>
                                        <input 
                                            className={styles.memberAccount} 
                                            type="text" 
                                            readOnly 
                                            value={user.email} 
                                        />
                                    </span>
                                </div>
                                <div className={styles.memberInfo}>
                                    <div className={styles.infoItem}>
                                        會員暱稱：
                                    </div>
                                    <span>
                                        <input 
                                            className={styles.memberNickName} 
                                            type="text" 
                                            value={newDisplayName || user.displayName || ''}
                                            placeholder="還沒有暱稱嗎，快來新增!"
                                            onFocus={handleOnFocus}
                                            onBlur={handleOnBlur}
                                            onChange={(e) => setNewDisplayName(e.target.value)}
                                        />
                                    </span>
                                    <button className={styles.nickNameBtn}  onClick={handleChangeDisplayName}>{showSuccessMessage ?<TbCheckbox size={20} color="#0f73ee"/> : <TbEdit size={20} color="#666666"/>}</button>
                                    {showSuccessMessage && <div>暱稱修改成功</div>}
                                    {showWErrorMessage && <div>暱稱需小於10個字</div>}
                                </div>                       
                                <div className={styles.memberInfo}>
                                    <div className={styles.infoItem}>
                                        會員密碼：
                                    </div>
                                    <button className={styles.changePasswordBtn} onClick={() => setChangePasswordPopup(true)}>修改密碼</button>                                     
                                </div>    
                                {changePasswordPopup && (
                                    <>
                                        <div className={styles.overlay} onClick={() => setChangePasswordPopup(false)}/>
                                        <div className={styles.popup}>
                                            <div className={styles.changePasswordBox}>
                                                <div className={styles.changePasswordCloseBar}>
                                                    <IoIosCloseCircleOutline className={styles.closeIcon} size={30} onClick={() => setChangePasswordPopup(false)}/>
                                                </div>
                                                <form onSubmit={handleChangePassword}>
                                                    <div className={styles.formItem}>
                                                        <div className={styles.itemLabel}>
                                                            <label>
                                                                原始密碼：
                                                            </label>
                                                        </div>
                                                        <input  
                                                            className={styles.currentPasswordInput}
                                                            type="password"
                                                            value={currentPassword}
                                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                                        />
                                                    
                                                    </div>
                                                    <div className={styles.formItem}>
                                                        <div className={styles.itemLabel}>
                                                            <label>
                                                                新密碼：
                                                            </label>
                                                        </div>
                                                        <input
                                                            className={styles.newPasswordInput}
                                                            type="password"
                                                            value={newPassword}
                                                            onChange={(e) => setNewPassword(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className={styles.formItem}>
                                                        <div className={styles.itemLabel}>
                                                            <label>
                                                                確認新密碼：
                                                            </label>
                                                        </div>
                                                        <input
                                                            className={styles.confirmNewPasswordInput}
                                                            type="password"
                                                            value={confirmNewPassword}
                                                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                                                        />
                                                    </div>
                                                    <button className={styles.changePasswordSubmitBtn} type="submit">更改密碼</button>
                                                    <div className={styles.changePasswordMsgBox}>
                                                        {success ? 
                                                            <div>
                                                                <TbCheckbox size={15} color="#0f73ee"/>
                                                                <p className={styles.successMsg}>密碼已成功更改</p>
                                                            </div>
                                                            : null 
                                                        }
                                                        {error ? 
                                                            <div>
                                                                <MdOutlineErrorOutline size={15} color="red"/>
                                                                <p className={styles.errorMsg}>{error}</p>
                                                            </div>
                                                            : null 
                                                        }
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                ): (
                    <div>請重新登入</div>
            )}
        </div>
    )
}

export default MemberSettings;
