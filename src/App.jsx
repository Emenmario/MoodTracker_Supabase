import React, { createContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';
import Form from "./Form";
import List from "./List";
import Statistics from './Statistics';
import NotFound from "./NotFound";
import Auth from "./Auth";
import Protected from "./Protected";
import { supabase } from './supabase';
import "./app.css";

export const Appcontext = createContext();

const DashboardLayout = () => {
  return (
    <>
      <header className="dashboard-header">
        <div className="logo">Lume</div>
        <nav className="nav-links">
          <Link to="/home">Dashboard</Link>
          <Link to="/form">Log Mood</Link>
          <Link to="/list">History</Link>
          <Link to="/statistics">Statistics</Link>
        </nav>
      </header>
      <div className="app-shell">
        <Outlet />
      </div>
    </>
  );
};

const Home = () => {
  const [lastMood, setLastMood] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const { data: latest } = await supabase
        .from("moods")
        .select("mood,created_at")
        .order("created_at", { ascending: false })
        .limit(1);

      const { count } = await supabase
        .from("moods")
        .select("*", { count: "exact", head: true });

      if (latest?.length) setLastMood(latest[0].mood);
      setTotal(count);
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard">
      <main className="dashboard-main">
        <section className="section">
          <div className="section-header">
            <h2>Today's Mood</h2>
          </div>
          <div className="cta-card">
            <div className="cta-content">
              <h1>How are you feeling today?</h1>
              <p>Record your mood and keep track of emotional trends.</p>
              <Link className="cta-button" to="/form">Log Mood</Link>
            </div>
            <div className="cta-preview">
              <div className="mini-stat">
                <span className="stat-label">Current Streak</span>
                <span className="stat-value">{total} days</span>
              </div>
              <div className="mini-stat">
                <span className="stat-label">Last Mood</span>
                <span className="stat-value">{lastMood || `No Mood Recorded`}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <h2>Insights</h2>
          </div>
          <div className="dashboard-grid">
            <Link to="/statistics" className="card">
              <h3>Mood Statistics</h3>
              <p>Visualize your mood trends over time.</p>
              <div className="card-preview">
                <div className="bar"></div>
                <div className="bar short"></div>
                <div className="bar"></div>
                <div className="bar medium"></div>
              </div>
            </Link>
            <Link to="/list" className="card">
              <h3>Recent Entries</h3>
              <p>Review your latest mood logs.</p>
              <ul className="history-preview">
                <li>🙂 Happy</li>
                <li>😐 Neutral</li>
                <li>😔 Sad</li>
              </ul>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

const App = () => {
  const [session, setSession] = useState(null);
  const [guest, setGuest] = useState(localStorage.getItem("guest") === "true");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        localStorage.removeItem("guest");
        setGuest(false);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <Appcontext.Provider value={{ guest, setGuest, session }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route element={<Protected />}>
            <Route element={<DashboardLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/form" element={<Form user={session?.user} />} />
              <Route path="/list" element={<List user={session?.user} />} />
              <Route path="/statistics" element={<Statistics user={session?.user} />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Appcontext.Provider>
  );
};

export default App;