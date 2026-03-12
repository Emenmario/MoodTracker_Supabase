import React, { useEffect, useState, useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { Appcontext } from './App';
import "./Statistics.css";

const Statistics = () => {
  const [list, setList] = useState([]);
  const { on } = useContext(Appcontext);

  useEffect(() => {
    const savedList = JSON.parse(localStorage.getItem('List')) || [];
    setList(savedList);
  }, []);

  const moodCounts = list.reduce((acc, mood) => {
    acc[mood.mood] = (acc[mood.mood] || 0) + 1;
    return acc;
  }, {});

  const totalEntries = list.length;

  const mostCommonMood =
    Object.keys(moodCounts).length > 0
      ? Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0][0]
      : null;

  const uniqueMoods = Object.keys(moodCounts).length;

  const data = {
    labels: Object.keys(moodCounts),
    datasets: [
      {
        label: 'Total Entries',
        data: Object.values(moodCounts),
        backgroundColor: ['#ffd166', '#ef476f', '#06d6a0', '#118ab2', '#073b4c'],
      },
    ],
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          objectFit: "cover",
          minHeight: "100vh",
          width: "100%",
          maxWidth: "900px",
          transition: "all 0.5s ease",
          backgroundColor: on ? "white" : "#1c1c1c",
          padding: "20px"
        }}
      >
        <h2>Mood Statistics</h2>

        {list.length === 0 ? (
          <p>No mood entries yet</p>
        ) : (

          <>
            <Bar data={data} />

          <h3 style={{ marginTop: "100px" }}>Your Mood summary</h3>
            <div className="stats-summary">
              <div className="stat-box">
                <h3>{totalEntries}</h3>
                <p>Total Entries</p>
              </div>

              <div className="stat-box">
                <h3>{mostCommonMood}</h3>
                <p>Most Common Mood</p>
              </div>

              <div className="stat-box">
                <h3>{uniqueMoods}</h3>
                <p>Moods Recorded</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Statistics;