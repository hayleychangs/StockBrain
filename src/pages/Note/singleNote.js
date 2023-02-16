import React, {useState, useEffect} from "react";

import { collection, addDoc, query, getDocs, deleteDoc, doc, serverTimestamp, orderBy, where, onSnapshot, updateDoc } from 'firebase/firestore';
import {db, auth} from "../../firebase/firebase";
import { onAuthStateChanged } from 'firebase/auth';

import styles from "./singleNote.module.css";

import { GiNewspaper, GiArchiveResearch, GiCalculator } from "react-icons/gi";
import { FaRegLightbulb } from "react-icons/fa";
import { MdOutlinePostAdd } from "react-icons/md";
import { BiSave } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";

function MyNote () {
  //user狀態確認
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  
    return () => unsubscribe();
  }, []);

  //add note
  const [inputValue, setInputValue] = useState('');
  const [moodValue, setMoodValue] = useState('');
  const [inputBackgroundColor, setInputBackgroundColor] = useState('white');
  const [notes, setNotes] = useState([]);

  async function handleAddItem() {
    if (!inputValue) {
      setInputValue("捕捉交易想法及心情...");
    }

    if (!moodValue) {
      setMoodValue("0");
    }

      try {
        const docRef = await addDoc(collection(db, 'myNote'), {
          text: inputValue,
          mood: moodValue,
          time: serverTimestamp(),
          user_id: auth?.currentUser?.uid
        });

        setInputValue('');
        setMoodValue('');
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
      setInputBackgroundColor('#FFCC99');
    } else if (value === 1) {
      setInputBackgroundColor('rgba(215,215,255)');
    } else if (value === 2) {
      setInputBackgroundColor('#CBE3BB');
    } else if (value === 3) {
      setInputBackgroundColor('rgba(146,205,250)');
    } else {
      setInputBackgroundColor('rgb(232, 232, 232)');
    }
    console.log(moodValue)
  }

  useEffect(() => {
      async function fetchNotes() {

        if (!user) {
          return;
        }

        try {
          const noteRef = collection(db, "myNote");
          console.log("使用者ID", auth?.currentUser?.uid);
          const q = query(noteRef, where("user_id", "==", auth?.currentUser?.uid), orderBy("timestamp", "desc"));
        
          onSnapshot(noteRef, (snapshot) => {
              const notes = []
              snapshot.docs.forEach((doc) => {
                  notes.push({...doc.data(), id:doc.id})
              })
              console.log("列印筆記", notes);
              setNotes(notes);
          })

        } catch (error) {
            console.log(error);
        }; 

      }
  
      fetchNotes();
  }, [user]);

  //update note
  const [editableContent, setEditableContent] = useState("");

  function handleEditableChange(event) {
    setEditableContent(event.target.textContent);
  }

  async function handleUpdateNote(id) {
    try {
      const noteRef = doc(db, "myNote", id);
      await updateDoc(noteRef, 
        { text: editableContent,
          time: serverTimestamp()
        }
      );
      setEditableContent("");
      console.log("updated document");
    } catch (e) {
      console.log("Error updating document", e);
    }
  };

  async function handleMoodClick(moodValue, id) {
    try {
      const noteRef = doc(db, "myNote", id);
      updateDoc(noteRef, 
        { mood: moodValue,
          time: serverTimestamp()
        }
      );
      console.log("Mood value updated successfully!");
    } catch (e) {
      console.error("Error updating mood value:", e);
    }
  }

  //set background color
  function setBackgroundColor(mood) {
    if (mood === 0) {
      return '#FFCC99';
    }else if (mood === 1) {
      return 'rgba(215,215,255)';
    } else if (mood === 2) {
      return '#CBE3BB';
    } else if (mood === 3) {
      return 'rgba(146,205,250)';
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
      event.target.placeholder="隨時紀錄交易想法及心情";
      setIsHidden(false);
  }
  //------------------------------------------

  return (
    <div className={styles.myNote}>
      <div className={styles.title} >想法捕捉</div>
      <div className={styles.container}>
        <div className={styles.inputCard}>
            <div className={styles.input}>
              <input type="text" value={inputValue} placeholder="隨時紀錄交易想法及心情" onChange={handleInputChange} onFocus={handleOnFocus} onBlur={handleOnBlur} style={{ backgroundColor: inputBackgroundColor }} />
            </div>
            <div className={styles.addIcon} onClick={handleAddItem}><MdOutlinePostAdd size={35} color="#0f73ee"/></div>
            <div className={styles.moodInput}>
              <div className={styles.moodIcon} value="0" onClick={() => getMoodValue(0)} ><FaRegLightbulb size={30} color={"#eb7d16"} /></div>
              <div className={styles.moodIcon} value="1" onClick={() => getMoodValue(1)}  ><GiNewspaper  size={30} color={"#9966FF"} /></div>
              <div className={styles.moodIcon}  value="2" onClick={() => getMoodValue(2)} ><GiArchiveResearch size={30} color={"green"}  /></div>
              <div className={styles.moodIcon}  value="3" onClick={() => getMoodValue(3)} ><GiCalculator size={30} color={"#666666"} /></div>
            </div>
        </div> 
        <div className={styles.notes}>
          {
            notes?.map((note) => (
                <div className={styles.singleNoteCard} key={note.id}>
                  <div className={styles.singleNote} style={{ backgroundColor: setBackgroundColor(note.mood) }} contentEditable onInput={handleEditableChange}>
                    {note.text}
                  </div>
                  <div className={styles.updateIcon} onClick={() => handleUpdateNote(note.id)}><BiSave size={30} color={"#0f73ee"} /></div>
                  <div className={styles.deleteIcon} onClick={() => handleDeleteNote(note.id)}><RiDeleteBin5Line size={25} color={"#666666"} /></div>
                  {note?.time && <div className={styles.updatedDate}>最後編輯時間：{note.time.toDate().toLocaleString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</div>}
                  <div className={styles.moodInNote}>
                    <div className={styles.moodIconInNote} value="0" onClick={() => handleMoodClick(0, note.id)} ><FaRegLightbulb GiNewspaper size={25} color={"#eb7d16"} /></div>
                    <div className={styles.moodIconInNote} value="1" onClick={() => handleMoodClick(1, note.id)} ><GiNewspaper size={25} color={"#9966FF"} /></div>
                    <div className={styles.moodIconInNote} value="2" onClick={() => handleMoodClick(2, note.id)} ><GiArchiveResearch size={25} color={"green"} /></div>
                    <div className={styles.moodIconInNote} value="3" onClick={() => handleMoodClick(3, note.id)} ><GiCalculator size={25} color={"#666666"}/></div>
                  </div>
                </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
export default MyNote;