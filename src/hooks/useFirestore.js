import { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";

function useFirestoreQuery (collectionName, userId, orderByField, whereField = null, whereOperator = "==", whereValue = null, defaultData = []) {
    const [data, setData] = useState(defaultData);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          if (!userId) {
            setData(defaultData);
            setLoading(false);
            return;
          };
  
          const ref = collection(db, collectionName);
  
          let q = query(ref, where("user_id", "==", userId), orderBy(orderByField, "desc"));
  
          if (whereField) {
            q = query(ref, where("user_id", "==", userId), where(whereField, whereOperator, whereValue), orderBy(orderByField, "desc"));
          };
  
          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const result = [];
            querySnapshot.forEach((doc) => {
              result.push({...doc.data(), id: doc.id});
            });
            setData(result);
            setLoading(false);
          });
  
          return unsubscribe;
  
        } catch (error) {
          console.error("Error fetching Firestore data", error);
        }
      };
      
      fetchData();

    }, [userId, whereValue]);
  
    return { data, loading };
    
};

function useUpdateDoc () {
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState(null);

  async function updateNote (id, editableContent) {
    setUpdateLoading(true);
    try {
      const noteRef = doc(db, "myNote", id);
      await updateDoc(noteRef, {
        text: editableContent,
        time: serverTimestamp(),
      });
    } catch (error) {
      setError(error);
      console.log("Error updating document", error);
    } finally {
      setUpdateLoading(false);
    }
  };

  async function updateMoodClick (id, moodValue) {
    setUpdateLoading(true);
    try {
      const noteRef = doc(db, "myNote", id);
      await updateDoc(noteRef, {
        mood: moodValue,
        time: serverTimestamp(),
      });
    } catch (error) {
      setError(error);
      console.error("Error updating mood value:", error);
    } finally {
      setUpdateLoading(false);
    }
  };

  return { updateNote, updateMoodClick, updateLoading, error };
};

function useDeleteDoc (collectionName) {

  async function handleDeleteDoc (id) {
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (error) {
      console.error(error);
    }
  };

  return { handleDeleteDoc };
};

export function useTrackingList (userId) {
    return useFirestoreQuery("trackingList", userId, "timestamp", null, null, null, []);
};

export function useTradePlans (userId) {
    return useFirestoreQuery("tradePlan", userId, "timestamp", null, null, null, []);
};

export function useNotes (userId, stockId = null) {
    return useFirestoreQuery("myNote", userId, "time", "stock_id", "==", stockId, []);
};

export {useDeleteDoc, useUpdateDoc};