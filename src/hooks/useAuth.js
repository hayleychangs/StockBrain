import { useState, useEffect } from "react";

import {auth} from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

function UseAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return user;
}

export default UseAuth;