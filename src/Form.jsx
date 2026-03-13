import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import "./Form.css";
import { Appcontext } from "./App";
import { supabase } from './supabase';

const Form = ({ user }) => {
  const { on } = useContext(Appcontext);
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  const scale = [1,2,3,4,5,6,7,8,9,10];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mood) return alert("Select a mood first!");

    setLoading(true);
    const entry = {
      mood,
      details: note,
      score: Number(score),
      created_at: new Date()
    };

    if (user) {
      // Logged-in user -> save to Supabase
      const { error } = await supabase.from('moods').insert([{ ...entry, user_id: user.id }]);
      if (error) {
        console.error(error);
        alert("Failed to save mood.");
      } else {
        setMood("");
        setNote("");
        setScore(0);
        alert("Mood saved successfully!");
      }
    } else {
      // Guest user -> save to localStorage
      const guestMoods = JSON.parse(localStorage.getItem("guestMoods")) || [];
      guestMoods.push(entry);
      localStorage.setItem("guestMoods", JSON.stringify(guestMoods));
      setMood("");
      setNote("");
      setScore(0);
      alert("Mood saved locally (Guest Mode).");
    }
    setLoading(false);
  };

  return (
    <div className='homepage'>
      <form onSubmit={handleSubmit}>
        <div style={{ backgroundColor: on && "#e1e1e11c" }} className='form'>
          <p style={{ display: "block" }}>How are you feeling right now?</p>

          <div style={{ display: "flex", gap: "10px" }}>
            {["Happy", "Sad", "Anxious", "Calm", "Angry"].map(type => (
              <React.Fragment key={type}>
                <input
                  type="radio"
                  id={type}
                  name="feels"
                  value={type}
                  onClick={(e) => setMood(e.target.value)}
                />
                <label style={{ color: on ? "black" : "white" }} htmlFor={type}>{type}</label>
              </React.Fragment>
            ))}
          </div>

          {mood && (
            <div style={{ display: "flex", flexDirection: "column", marginTop: "10px" }}>
              <p>On a scale of 1-10, how {mood} are you?</p>
              <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                {scale.map(num => (
                  <React.Fragment key={num}>
                    <input
                      id={`score-${num}`}
                      type="radio"
                      name="score"
                      value={num}
                      onClick={(e) => setScore(e.target.value)}
                    />
                    <label htmlFor={`score-${num}`}>{num}</label>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          <div className='second'>
            <label style={{ color: on ? "black" : "white" }} className='add' htmlFor='note'>Add a note (optional)</label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.333)", color: on ? "black" : "white" }}
            />
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button className='button' disabled={loading}>
              {loading ? "Saving..." : "Done"}
            </button>
            <Link to="/list" className='b'>Mood History →</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Form;