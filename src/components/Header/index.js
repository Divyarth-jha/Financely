import React, { useEffect } from 'react';
import "./styles.css";
import { auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signOut } from 'firebase/auth';
import userImg from "../../assets/user.svg";

const Header = () => {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  // Redirect to dashboard if user is logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  // Logout function using async/await
  const logoutfnc = async () => {
    try {
      await signOut(auth);           // Sign out from Firebase
      localStorage.clear();          // Clear local storage to avoid cached auth state
      sessionStorage.clear();        // Clear session storage if any
      toast.success("Sign-out successful");
      navigate("/");                 // Redirect to home page
    } catch (error) {
      toast.error(error.message);    // Show error if sign-out fails
    }
  };

  return (
    <div className="navbar">
      <p className="logo">Financely</p>
      {user && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          <img
            src={user.photoURL ? user.photoURL : userImg}
            style={{ width: "2rem", height: "2rem" }}
            alt="User"
          />
          <p onClick={logoutfnc} className="logo link">
            Logout
          </p>
        </div>
      )}
    </div>
  );
};

export default Header;
