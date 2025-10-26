import React, { useState } from 'react';
import "./styles.css";
import Input from '../input';
import Button from '../button/button';
import { toast } from 'react-toastify';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";
import { auth, setDoc, db, doc, provider } from '../../firebase';
import { useNavigate } from "react-router-dom";
import { getDoc } from 'firebase/firestore';



const SignupSignin = () => {
  
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState(false);
  const navigate = useNavigate();

  // Create Firestore doc if not exists
  const createDoc = async (user) => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      const userData = await getDoc(userRef);

      if (!userData.exists()) {
        await setDoc(userRef, {
          Name: user.displayName || Name,
          Email: user.email,
          photoURL: user.photoURL || "",
          createdAt: new Date(), // optionally use serverTimestamp()
        });
        toast.success("User document created!");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Email signup
  const signupWithEmail = async (e) => {
    e.preventDefault();
    if (!Name || !Email || !Password || !confPassword) {
      return toast.error("All fields are mandatory!");
    }
    if (Password !== confPassword) {
      return toast.error("Password and Confirm Password don't match!");
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, Email, Password);
      const user = userCredential.user;
      await createDoc(user);
      toast.success("User Created!");
      setName(""); setEmail(""); setPassword(""); setConfPassword("");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Email login
  const loginUsingEmail = async (e) => {
    e.preventDefault();
    if (!Email || !Password) return toast.error("All fields are mandatory!");

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, Email, Password);
      const user = userCredential.user;
      await createDoc(user);
      toast.success("User logged in!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Google authentication
  const authWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user; // declare user before using
      await createDoc(user);
      toast.success("User authenticated with Google!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loginForm ? (
        <div className="signup-wrapper">
          <h2 className="title">Login <span style={{ color: "#2970ff" }}>Financely</span></h2>
          <form>
            <Input label="Email" state={Email} setState={setEmail} placeholder="Enter Email" />
            <Input label="Password" type="password" state={Password} setState={setPassword} placeholder="Enter Password" />

            <Button
              disabled={loading}
              text={loading ? "Loading..." : "Login Using Email and Password"}
              onClick={loginUsingEmail}
            />

            <p style={{ textAlign: "center" }}>or</p>

            <Button
              onClick={authWithGoogle}
              text={loading ? "Loading..." : "Login Using Google"}
              blue
            />

            <p style={{ textAlign: "center", cursor: "pointer" }} onClick={() => setLoginForm(false)}>
              Don’t have an account? Click here
            </p>
          </form>
        </div>
      ) : (
        <div className="signup-wrapper">
          <h2 className="title">Sign Up on <span style={{ color: "#2970ff" }}>Financely</span></h2>
          <form>
            <Input label="Full Name" state={Name} setState={setName} placeholder="Enter Name" />
            <Input label="Email" state={Email} setState={setEmail} placeholder="Enter Email" />
            <Input label="Password" type="password" state={Password} setState={setPassword} placeholder="Enter Password" />
            <Input label="Confirm Password" type="password" state={confPassword} setState={setConfPassword} placeholder="Enter Confirm Password" />

            <Button
              disabled={loading}
              text={loading ? "Loading..." : "Sign Up Using Email and Password"}
              onClick={signupWithEmail}
            />

            <p className="p-login">or</p>

            <Button
              onClick={authWithGoogle}
              text={loading ? "Loading..." : "Sign Up Using Google"}
              blue
            />

            <p className="p-login" style={{ textAlign: "center", cursor: "pointer" }} onClick={() => setLoginForm(true)}>
              Already have an account? Click here
            </p>
          </form>
        </div>
      )}
    </>
  );
};

export default SignupSignin;
