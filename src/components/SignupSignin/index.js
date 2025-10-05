import React, { useState } from 'react'
import "./styles.css";
import Input from '../input';
import Button from '../button/button';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword,GoogleAuthProvider,signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, setDoc,db,doc, provider, } from '../../firebase';
import { useNavigate } from "react-router-dom";
import { getDoc } from 'firebase/firestore';

const SignupSignin = () => {
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState(false);
  const navigate = useNavigate()

  function signupWithEmail(e) {
    e.preventDefault();
    setLoading(true);

    if (Name !== "" && Email !== "" && Password !== "" && confPassword !== "") {
      if (Password === confPassword) {
        createUserWithEmailAndPassword(auth, Email, Password)
          .then((userCredential) => {
            const user = userCredential.user;
            console.log("User is created", user);
            toast.success("User Created");

            setLoading(false);
            setName("");
            setEmail("");
            setPassword("");
            setConfPassword("");
            createDoc(user);
            navigate("/dashboard");
          })
          .catch((error) => {
            const errorMessage = error.message;
            toast.error(errorMessage);
            setLoading(false);
          });
      } else {
        toast.error("Password and Confirm Password don't match!");
        setLoading(false);
      }
    } else {
      toast.error("All fields are mandatory!");
      setLoading(false);
    }
  }



  function loginUsingEmail(e) {
    e.preventDefault();
    console.log("Email", Email);
    console.log("Password", Password);
    setLoading(true);
    
    // Add Firebase signInWithEmailAndPassword here
   if ( Email !== "" && Password !== "") {
      
        signInWithEmailAndPassword(auth, Email, Password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
     toast.success("User login");
     navigate("/dashboard");
     createDoc(user);
     setLoading(false);

    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    toast.error(errorMessage)
     setLoading(false);

  });
      
    }else {
      toast.error("All fields are mandatory!");
      setLoading(false);}
    }

 async function createDoc(user) {
   setLoading(true);
// this for doc creation  and checking it existsor not

  if (!user) return;
  const userRef = doc(db, "users", user.uid);
  const userData = await getDoc(userRef);

  if (!userData.exists()) {
    try {
      await setDoc(doc(db, "users", user.uid), {
        Name: user.displayName ? user.displayName : Name,
        Email: user.email,
        photoURL: user.photoURL ? user.photoURL : "",
        createdAt: new Date(), // recommended: serverTimestamp()
      });
      toast.success("doc created!");
     setLoading(false);

    } catch (e) {
     setLoading(false);
    toast.error(e.message);
    }
  } else {
     setLoading(false);
    toast.error("doc already exists");
  }
}
// Auth google
 function AuthWithGoogle(){

  setLoading(true)
  try{
     signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
    createDoc(user);
    console.log("user>>>",user);
    toast.success("User authenticated!")
    navigate("/dashboard")
    setLoading(false)
    
  }).catch((error) => {
    toast.error(errorMessage)
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    setLoading(false);
    // ...
  });
  }catch(e){
    toast.error(e.message)
    setLoading(false);
  }
 
 }

  return (
    <>
      {loginForm ? (
        <div className="signup-wrapper">
          <h2 className="title">
            Login <span style={{ color: "#2970ff" }}>Financely</span>
          </h2>
          <form>
            <Input
              label={"Email"}
              state={Email}
              setState={setEmail}
              placeholder={"Enter Email"}
            />

            <Input
              label={"Password"}
              type="password"
              state={Password}
              setState={setPassword}
              placeholder={"Enter Password"}
            />

            <Button
              disabled={loading}
              text={loading ? "Loading..." : "Login Using Email and Password"}
              onClick={loginUsingEmail}
            />

            <p style={{ textAlign: "center" }}>or</p>

            <Button
            onClick={AuthWithGoogle}
              text={loading ? "Loading..." : "login Using Google"}
              blue={true}
            />

            <p
              style={{ textAlign: "center", cursor: "pointer" }}
              onClick={() => setLoginForm(false)}
            >
              Don’t have an account? Click here
            </p>
          </form>
        </div>
      ) : (
        <div className="signup-wrapper">
          <h2 className="title">
            Sign Up on <span style={{ color: "#2970ff" }}>Financely</span>
          </h2>
          <form>
            <Input
              label={"Full Name"}
              state={Name}
              setState={setName}
              placeholder={"Enter Name"}
            />

            <Input
              label={"Email"}
              state={Email}
              setState={setEmail}
              placeholder={"Enter Email"}
            />

            <Input
              label={"Password"}
              type="password"
              state={Password}
              setState={setPassword}
              placeholder={"Enter Password"}
            />

            <Input
              label={"Confirm Password"}
              type="password"
              state={confPassword}
              setState={setConfPassword}
              placeholder={"Enter Confirm Password"}
            />

            <Button
              disabled={loading}
              text={
                loading ? "Loading..." : "SignUp Using Email and Password"
              }
              onClick={signupWithEmail}
            />

            <p className="p-login">or</p>

            <Button
             onClick={AuthWithGoogle}
              text={loading ? "Loading..." : "SignUp Using Google"}
              blue={true}
            />

            <p
              className="p-login"
              style={{ textAlign: "center", cursor: "pointer" }}
              onClick={() => setLoginForm(true)}
            >
              Already have an account? Click here
            </p>
          </form>
        </div>
      )}
    </>
  );
};

export default SignupSignin;