import React, { createContext } from 'react';
import Form from "./Form";
import List from "./List";
import NotFound from "./NotFound"
import Statistics from './Statistics';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';

export const Appcontext = createContext();

const App = () => {
  const [on, setOn] = React.useState(false);

  return (
    <Appcontext.Provider value={{ on, setOn }}>
      <BrowserRouter>
        <div
          style={{
            transition: "all 0.5s ease",
            color: on ? "black" : "white",
            backgroundColor: on ? "white" : "#1c1c1c",
          }}
        >
          <button
            style={{
              backgroundColor: on ? "#1c1c1c" : "white",
              color: on ? "white" : "black",
              fontFamily: '"Alan-sans", sans-serif',
            }}
            className="dark"
            onClick={() => setOn(!on)}
          >
            {on ? "Dark Mode" : "Light Mode"}
          </button>

          <div>
            <Routes>
              <Route
                path="/"
                element={
                  <div className="homepage">
                    <h1 className="title">Mood Tracker</h1>
                    <p>Track your mood daily and see your progress!</p>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                  
                        <div style={{display:"flex",flexDirection:"column"}}>
                      <Link  className="button" to="/form">Start</Link>
                      <div style={{display:"flex", gap:"10px"}}>
                        <Link className="b" to="/list">mood history📑</Link>
                      <Link className="b" to="/Statistics">View statistics 📊</Link>
                        </div>
                    </div>

                    </div>
                  </div>
                }
              />
              <Route path="/form" element={<Form />} />
              <Route path="/list" element={<List />} />
              <Route path="/statistics" element={<Statistics/>}/>

              <Route path="*" element={<NotFound/>}/>
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </Appcontext.Provider>
  );
};

export default App;
