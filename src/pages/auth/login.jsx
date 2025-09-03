import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, db, provider } from '../../config/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import './auth.css';
import logo from '../../images/logo-small-nobg.png';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (er) {
      setError("Invalid email or password.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      const user = res.user;

      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if(!docSnap.exists()) {
        await setDoc(userRef, {
          firstName: user.displayName?.split(" ")[0] || "",
          lastName: user.displayName?.split(" ")[1] || "",
          email: user.email,
          role: "user",
          createdAt: serverTimestamp(),
          photoURL: user.photoURL || "",
          birthDate: "",
          city: "",
          gender: "",
          phone: "",
          additionalInfo: "",
          livingType: "",
        });

      navigate("/complete-register");
      } else {
        navigate("/");
      }
    } catch (er) {
    alert("Google sign-in failed.");
    }
  };

  return (
    <div className='auth-body login'>
      <div>
        <img src={logo} alt="logo" className='auth-logo'/>
      </div>
      <div className='login-form'>
        <h1>Login</h1>
        <hr />
        {error && <p className='error'>{error}</p>}
        <form onSubmit={handleLogin}>
          <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
          <br />
          <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
          <br />
          <span>Don't have an account?</span>
          <Link to='/register' className='link'>Register</Link>
          <br />
          <button type='submit'>Login</button>
          <hr />
          <button type='button' onClick={handleGoogleLogin}>Login with Google</button>
        </form>
      </div>
    </div>
  );
}

export default Login;