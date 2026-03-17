import React, { useContext, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import "./List.css";
import Box from "./Box";
import { Appcontext } from "./App";
import { supabase } from './supabase';

const List = ({ user }) => {
  const { on } = useContext(Appcontext);
  const [list, setList] = useState([]);
  const [original, setOriginal] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoods = async () => {
      let data = [];
      if (user) {
        const { data: supabaseData, error } = await supabase
          .from('moods')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (error) console.error("Failed to fetch moods:", error);
        else data = supabaseData;
      } else {
        data = JSON.parse(localStorage.getItem("guestMoods")) || [];
      }
      setList(data);
      setOriginal(data);
      setLoading(false);
    };

    fetchMoods();
  }, [user]);

  function handleFilter(e) {
    const value = e.target.value;
    if (value === "All") setList(original);
    else setList(original.filter(mood => mood.mood === value));
  }

  async function handleDelete(moodId) {
    if (user) {
      const { error } = await supabase.from('moods').delete().eq('id', moodId);
      if (error) console.error("Delete failed:", error);
    } else {
      const guestMoods = JSON.parse(localStorage.getItem("guestMoods")) || [];
      const updatedGuestMoods = guestMoods.filter(m => m.id !== moodId);
      localStorage.setItem("guestMoods", JSON.stringify(updatedGuestMoods));
    }

    const updated = list.filter(m => m.id !== moodId);
    setList(updated);
    setOriginal(updated);
  }

  const rendered = list.map(mood => (
    <Box
      key={mood.id || `${mood.mood}-${mood.created_at}`} 
      mood={mood}
      handleDelete={() => handleDelete(mood.id)}
    />
  ));

  return (
    <div style={{ backgroundColor: on && "white", transition: "all 0.5s ease" }} className='list'>
      <div className='filter'>
        <p>Filter by Mood</p>
        {["All", "Sad", "Happy", "Anxious", "Calm", "Angry"].map(type => (
          <label key={type}>
            <input onClick={handleFilter} name='mood' value={type} type='radio' />{type}
          </label>
        ))}
      </div>

      {!loading && list.length === 0 && <h1>No emotions recorded yet</h1>}

      <div style={{ padding: "20px" }} className='third'>
        {rendered}
      </div>

      <div className='stat'>
        <Link
          style={{
            backgroundColor: on ? "black" : "#ffffff",
            padding: "5px 10px",
            borderRadius: "10px"
          }}
          className="b"
          to="/Statistics"
        >
          View statistics 📊
        </Link>
      </div>
    </div>
  );
};

export default List;