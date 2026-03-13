import React, { createContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Form from "./Form";
import List from "./List";
import Statistics from './Statistics';
import NotFound from "./NotFound";
import Auth from "./Auth";
import Protected from "./Protected";
import { supabase } from './supabase';

export const Appcontext = createContext();

const App = () => {
  const [session, setSession] = useState(null);
  const [guest, setGuest] = useState(localStorage.getItem("guest") === "true");

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    // Listen for login/logout
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        localStorage.removeItem("guest"); // clear guest flag on login
        setGuest(false);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <Appcontext.Provider value={{ guest, setGuest, session }}>
      <BrowserRouter>
        <div
          style={{
            backgroundColor: "#1c1c1c",
            color: "#f5f5f5",
            minHeight: "100vh",
            paddingBottom: "40px",
          }}
        >
          <Routes>
            {/* Auth */}
            <Route path="/" element={<Auth />} />

            {/* Protected Routes */}
            <Route element={<Protected />}>
              {/* Homepage */}
              <Route
                path="/home"
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
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <Link className="button" to="/form">Start</Link>

                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                          <Link className="b" to="/list">Mood History 📑</Link>
                          <Link className="b" to="/statistics">View Statistics 📊</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              />

              {/* Form / List / Statistics */}
              <Route path="/form" element={<Form user={session?.user} />} />
              <Route path="/list" element={<List user={session?.user} />} />
              <Route path="/statistics" element={<Statistics user={session?.user} />} />
            </Route>

            {/* Catch-all 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </Appcontext.Provider>
  );
};

export default App;