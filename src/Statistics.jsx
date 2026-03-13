import React, { useEffect, useState, useContext } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { Appcontext } from './App';
import { supabase } from './supabase';
import "./Statistics.css";

const Statistics = ({ user }) => {
  const [list, setList] = useState([]);
  const { on } = useContext(Appcontext);
  const [trendType, setTrendType] = useState('hourly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoods = async () => {
      let data = [];
      if (user) {
        // Logged-in user: fetch from Supabase
        const { data: supabaseData, error } = await supabase
          .from('moods')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });
        if (error) console.error('Error fetching moods:', error);
        else data = supabaseData;
      } else {
        // Guest mode: fetch from localStorage
        data = JSON.parse(localStorage.getItem('guestMoods')) || [];
      }
      setList(data);
      setLoading(false);
    };
    fetchMoods();
  }, [user]);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  const moodCounts = list.reduce((acc, mood) => {
    acc[mood.mood] = (acc[mood.mood] || 0) + 1;
    return acc;
  }, {});

  const barData = {
    labels: Object.keys(moodCounts),
    datasets: [
      {
        label: 'Total Entries',
        data: Object.values(moodCounts),
        backgroundColor: ['#ffd166', '#ef476f', '#06d6a0', '#118ab2', '#073b4c'],
      },
    ],
  };

  let trendData;
  if (trendType === 'hourly') {
    const moodByHour = list.reduce((acc, mood) => {
      const hour = new Date(mood.created_at).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});
    const labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    const data = labels.map(label => moodByHour[parseInt(label)] || 0);
    trendData = {
      labels,
      datasets: [
        {
          label: 'Mood Entries by Hour',
          data,
          borderColor: '#118ab2',
          backgroundColor: 'rgba(17,138,178,0.2)',
          tension: 0.3,
          fill: true,
        },
      ],
    };
  } else {
    const moodByDate = list.reduce((acc, mood) => {
      const dateStr = new Date(mood.created_at).toLocaleDateString();
      acc[dateStr] = (acc[dateStr] || 0) + 1;
      return acc;
    }, {});
    const labels = Object.keys(moodByDate);
    const data = Object.values(moodByDate);
    trendData = {
      labels,
      datasets: [
        {
          label: 'Mood Entries by Day',
          data,
          borderColor: '#06d6a0',
          backgroundColor: 'rgba(6,214,160,0.2)',
          tension: 0.3,
          fill: true,
        },
      ],
    };
  }

  const totalEntries = list.length;
  const mostCommonMood = Object.keys(moodCounts).length > 0
    ? Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0][0]
    : null;
  const uniqueMoods = Object.keys(moodCounts).length;

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
            <Bar data={barData} />

            <h3 style={{ marginTop: "50px" }}>Your Mood Summary</h3>
            <div className="stats-summary">
              <div className="stat-box">
                <h3>{totalEntries}</h3>
                <p>Total Entries</p>
              </div>
              <div className="stat-box">
                <h3>{mostCommonMood || '-'}</h3>
                <p>Most Common Mood</p>
              </div>
              <div className="stat-box">
                <h3>{uniqueMoods}</h3>
                <p>Moods Recorded</p>
              </div>
            </div>

            <h3 style={{ marginTop: "50px" }}>Mood Trend</h3>
            <div>
              <select
                value={trendType}
                onChange={e => setTrendType(e.target.value)}
                style={{ marginBottom: "20px", padding: "5px 10px" }}
              >
                <option value="hourly">Hourly Trend</option>
                <option value="daily">Daily Trend</option>
              </select>
            </div>

            <Line data={trendData} />
          </>
        )}
      </div>
    </div>
  );
};

export default Statistics;