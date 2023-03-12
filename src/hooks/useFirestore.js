import { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

function useFirestoreQuery(collectionName, userId, orderByField, whereField = null, whereOperator = "==", whereValue = null, defaultData = []) {
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
          }
  
          const ref = collection(db, collectionName);
  
          let q = query(ref, where("user_id", "==", userId), orderBy(orderByField, "desc"));
  
          if (whereField) {
            q = query(ref, where("user_id", "==", userId), where(whereField, whereOperator, whereValue), orderBy(orderByField, "desc"));
          }
  
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
      console.log("firestore47");
    }, [userId, whereValue]);
  
    return { data, loading };
    
}

export function useTrackingList(userId) {
    return useFirestoreQuery("trackingList", userId, "timestamp", null, null, null, []);
}

export function useTrackingListSVG(userId) {
  return useFirestoreQuery("trackingList", userId, null, null, null, null, []);
}

export function useTradePlans(userId) {
    return useFirestoreQuery("tradePlan", userId, "timestamp", null, null, null, []);
}

export function useNotes(userId, stockId = null) {
    return useFirestoreQuery("myNote", userId, "time", "stock_id", "==", stockId, []);
}