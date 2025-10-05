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

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  function logoutfnc() {
    try {
      signOut(auth)
        .then(() => {
          toast.success("Sign-out successful");
          navigate("/");
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } catch (error) {
      toast.error(error.message);
    }
  }

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
