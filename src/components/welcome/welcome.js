import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";

function Welcome() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Firebase automatically provides displayName for Google users
        // and you set it manually for Email/Password users
        setUserName(user.displayName || "User");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="welcome-container">
      <h1>👋 Welcome, {userName}!</h1>
      
    </div>
  );
}

export default Welcome;
