import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { useContext } from 'react';
import { Appcontext } from './App';

const Statistics = () => {
  const [list, setList] = useState([]);
const {on,setOn}=useContext(Appcontext)
  useEffect(() => {
    const savedList = JSON.parse(localStorage.getItem('List')) || [];
    setList(savedList);
  }, []);

  const moodCounts = list.reduce((acc, mood) => {
    acc[mood.mood] = (acc[mood.mood] || 0) + 1;
    return acc;
  }, {});

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


    <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
        <div  style={{objectFit:"cover",height:"100vh",width:"100vh", backgroundColor:on?"white":"#1c1c1c",padding: '20px' }}>
          <h2>Mood Statistics</h2>
          {list.length === 0 ? (
            <p>No mood entries yet</p>
          ) : (
            <Bar data={data} />
          )}
        </div>
    </div>
  );
};

export default Statistics;
