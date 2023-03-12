import React, {useState, useEffect} from "react";
import { useParams, Link } from "react-router-dom";

import { useNotes } from "../../hooks/useFirestore";

import { collection, addDoc, query, deleteDoc, doc, serverTimestamp, orderBy, where, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from "../../firebase/firebase";

import styles from "./myNote.module.css";

import { FaThumbtack, FaCircle } from "react-icons/fa";
import { BiSave } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { ImMenu3, ImMenu4 } from "react-icons/im";
import { TbCircleHalf2 } from "react-icons/tb";

function MyNote ({ onMenuToggle, user }) {
  let { stockId } = useParams();

  if (!stockId) {
    stockId = "2330";
  }

  //add note
  const [inputValue, setInputValue] = useState('');
  const [moodValue, setMoodValue] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [inputBackgroundColor, setInputBackgroundColor] = useState('white');

  async function handleAddItem() {
    if (!inputValue) {
      setInputValue("捕捉交易想法及心情...");
    }

    if (!moodValue) {
      setMoodValue("0");
    }

    try {
      const docRef = await addDoc(collection(db, 'myNote'), {
        stock_id: stockId,
        text: inputValue,
        mood: moodValue,
        time: serverTimestamp(),
        user_id: user.uid
      });

      setInputValue('');
      setMoodValue('');
      setSelectedColor(null);
      setInputBackgroundColor('white');
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }


  function handleInputChange(event) {
      setInputValue(event.target.value);
  }

  function getMoodValue(value) {
    setMoodValue(value);
    if (value === 0) {
      setInputBackgroundColor('#FFDEAD');
    } else if (value === 1) {
      setInputBackgroundColor('#E6E6FA');
    } else if (value === 2) {
      setInputBackgroundColor('#CDE6C7');
    } else if (value === 3) {
      setInputBackgroundColor('#FFE4E1');
    } else {
      setInputBackgroundColor('rgb(232, 232, 232)');
    };
    
    if (selectedColor === value) {
      setSelectedColor(null);
      setInputBackgroundColor('white');
    } else {
      setSelectedColor(value);
    }

  }
  //---------------------------------------------

  //!read note---------
  // const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(loading);
  // async function fetchNotes () {

  //   if (!user) {
  //     return;
  //   }



  //   setIsLoading(true);
    
  //   const notesRef = collection(db, "myNote");
  //   const q = query(notesRef, where("user_id", "==", user.uid), where("stock_id", "==", stockId), orderBy("time", "desc"));

  //   onSnapshot(q, (querySnapshot) => {
  //     const result = [];
  //     querySnapshot.forEach((doc) => {
  //       result.push({...doc.data(), id: doc.id});
  //     });
  //     setNotes(result);
  //     setIsLoading(false);
  //   });
  // }

  // useEffect(() => {
  //   fetchNotes();
  // }, [user, stockId])
  //----------------------

  const { data: notes, loading: loading } = useNotes(user?.uid, stockId);

  //update note
  const [editableContent, setEditableContent] = useState("");

  function handleEditableChange(event) {
    setEditableContent(event.target.textContent);
  }

  async function handleUpdateNote(id) {
    setIsLoading(true);
    try {
      const noteRef = doc(db, "myNote", id);
      await updateDoc(noteRef, 
        { text: editableContent,
          time: serverTimestamp()
        }
      );
      setEditableContent("");
    } catch (e) {
      console.log("Error updating document", e);
    } finally {
      setIsLoading(false);
    }
  };

  async function handleMoodClick(moodValue, id) {
    setIsLoading(true);
    try {
      const noteRef = doc(db, "myNote", id);
      updateDoc(noteRef, 
        { mood: moodValue,
          time: serverTimestamp()
        }
      );
    } catch (e) {
      console.error("Error updating mood value:", e);
    } finally {
      setIsLoading(false);
    }
  }

  //set background color
  function setBackgroundColor(mood) {
    if (mood === 0) {
      return '#FFDEAD';
    }else if (mood === 1) {
      return '#E6E6FA';
    } else if (mood === 2) {
      return '#CDE6C7';
    } else if (mood === 3) {
      return '#FFE4E1';
    } else {
      return 'rgb(232, 232, 232)';
    }
  }

  //delete note
  async function handleDeleteNote(id) {
    const noteRef = doc(db, "myNote", id);
    await deleteDoc(noteRef);
  }

  //-----OnFocus & OnBlur ---------------------
  const [isHidden, setIsHidden] = useState(true);

  const handleOnFocus = (event) => {
      event.target.placeholder="";
      setIsHidden(true);
  }

  const handleOnBlur = (event) => {
      event.target.placeholder="隨時紀錄交易想法及心情...";
      setIsHidden(false);
  }
  //------------------------------------------

  //menu shoe hide ----------------------------
  const [isOpen, setIsOpen] = useState(true);

  const handleClick = () => {
    setIsOpen(!isOpen);
    onMenuToggle();
  };

  //------------------------------------------


  return (
    <div className={styles.myNote}>
      <div className={styles.title} onClick={handleClick}>
        {isOpen ? <ImMenu4 /> : <ImMenu3 />}
        <span> 想法捕捉</span>
      </div>
      {isOpen && (
        <div className={styles.container}>
          <div className={styles.inputCard}>
              <div className={styles.input}>
                <input type="text" value={inputValue} placeholder="隨時紀錄交易想法及心情..." onChange={handleInputChange} onFocus={handleOnFocus} onBlur={handleOnBlur} style={{ backgroundColor: inputBackgroundColor }} />
              </div>
              {user ?
                  <div className={styles.addIcon} onClick={handleAddItem}><FaThumbtack size={25} color="#0f73ee" style={{ transform: 'rotate(20deg)' }}/></div>
                :
                <div className={`${styles.addIcon} ${styles["tipsForAddNote"]}`}><FaThumbtack size={25} color="#0f73ee" style={{ transform: 'rotate(20deg)' }} /></div>
              }
              <div className={styles.moodInput}>
                <div className={styles.moodIcon} value="0" onClick={() => getMoodValue(0)} >
                  {selectedColor === 0 ? (
                    <FaCircle size={16} color={"#eb7d16"} />
                  ) : (
                    <TbCircleHalf2 size={16} color={"#eb7d16"} />
                  )}
                </div>
                <div className={styles.moodIcon} value="1" onClick={() => getMoodValue(1)}  >
                  {selectedColor === 1 ? (
                    <FaCircle size={16} color={"#9966FF"} />
                  ) : (
                    <TbCircleHalf2 size={16} color={"#9966FF"} />
                  )}
                </div>
                <div className={styles.moodIcon}  value="2" onClick={() => getMoodValue(2)} >
                  {selectedColor === 2 ? (
                    <FaCircle size={16} color={"#68BE8D"} />
                  ) : (
                    <TbCircleHalf2 size={16} color={"#68BE8D"} />
                  )}
                </div>
                <div className={styles.moodIcon}  value="3" onClick={() => getMoodValue(3)} >
                  {selectedColor === 3 ? (
                    <FaCircle size={16} color={"#F2666C"} />
                  ) : (
                    <TbCircleHalf2 size={16} color={"#F2666C"} />
                  )}
                </div>
              </div>
          </div>
          {isLoading ? ( user ? (
            <div className={styles.loadingText}>
              <p>筆記整理中，請稍候...</p>
            </div>) : (
              <div className={styles.redirectMessageBox}>
                <p>完整內容，僅限註冊會員使用</p>
                <p>
                  立即<Link to="/signup" style={{ color: "#0f73ee"}}>註冊</Link><span>或</span><Link to="/login" style={{ color: "#0f73ee"}}>登入</Link>
                </p>
            </div>
            )
          ) : (
            user ? (
              <div className={styles.notes}>
                {notes.map((note) => (
                  <div className={styles.singleNoteCard} key={note.id}>
                    <div className={styles.singleNote} style={{ backgroundColor: setBackgroundColor(note.mood) }} contentEditable onInput={handleEditableChange}>
                        {note.text}
                    </div>
                    <div className={styles.updateIcon} onClick={() => handleUpdateNote(note.id)}><BiSave size={25} color={"#0f73ee"} /></div>
                    <div className={styles.deleteIcon} onClick={() => handleDeleteNote(note.id)}><RiDeleteBin5Line size={22} color={"#acacac"} /></div>
                    {note?.time && <div className={styles.updatedDate}>最後編輯時間：{note.time.toDate().toLocaleString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</div>}
                    <div className={styles.moodInNote}>
                        <div className={styles.moodIconInNote} value="0" onClick={() => handleMoodClick(0, note.id)} >
                          {note.mood === 0 ? (
                            <FaCircle size={16} color={"#eb7d16"} />
                          ):(
                            <TbCircleHalf2 size={16} color={"#eb7d16"} />
                          )}
                        </div>
                        <div className={styles.moodIconInNote} value="1" onClick={() => handleMoodClick(1, note.id)} >
                          {note.mood === 1 ? (
                            <FaCircle size={16} color={"#9966FF"} />
                          ):(
                            <TbCircleHalf2 size={16} color={"#9966FF"} />
                          )}
                        </div>
                        <div className={styles.moodIconInNote} value="2" onClick={() => handleMoodClick(2, note.id)} >
                          {note.mood === 2 ? (
                            <FaCircle size={16} color={"#68BE8D"} />
                          ):(
                            <TbCircleHalf2 size={16} color={"#68BE8D"} />
                          )}
                        </div>
                        <div className={styles.moodIconInNote} value="3" onClick={() => handleMoodClick(3, note.id)} >
                          {note.mood === 3 ? (
                            <FaCircle size={16} color={"#F2666C"} />
                          ):(
                            <TbCircleHalf2 size={16} color={"#F2666C"} />
                          )}
                        </div>
                      </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.redirectMessageBox}>
                <p>完整內容，僅限註冊會員使用</p>
                <p>
                  立即<Link to="/signup" style={{ color: "#0f73ee"}}>註冊</Link><span>或</span><Link to="/login" style={{ color: "#0f73ee"}}>登入</Link>
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
export default MyNote;