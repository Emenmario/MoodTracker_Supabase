import React, { useState, useContext } from 'react';
import { supabase } from './supabase';
import { useNavigate } from 'react-router-dom';
import { Appcontext } from './App';
import myLogo from './assets/logoo.png';
import './Auth.css';

const Auth = () => {
  const navigate = useNavigate();
  const { setGuest } = useContext(Appcontext);

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        // remove guest mode
        localStorage.removeItem("guest");
        setGuest(false);

        alert("Login successful!");
        navigate("/home");

      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password
        });

        if (error) throw error;

        alert("Sign up successful! Check your email for confirmation.");
        setMode("login");
      }

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    // log out any existing Supabase session
    await supabase.auth.signOut();

    localStorage.setItem("guest", "true");
    setGuest(true);

    navigate("/home");
  };

  return (
    <div className='total'>
      
      <div className="auth-container">
        <img style={{width:"300px",height:"auto"}} src={myLogo} alt="Logo" />
        
        <h3>{mode === "login" ? "Login" : "Sign Up"}</h3>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : mode === "login" ? "Login" : "Sign Up"}
          </button>
        </form>
        <button
          className="mode-toggle"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
        >
          Switch to {mode === "login" ? "Sign Up" : "Login"}
        </button>
        <hr />
        <button className="guest-btn" onClick={handleGuest}>
          Continue as Guest
        </button>
      </div>
    </div>
  );
};

export default Auth;