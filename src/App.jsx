import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import PostList from './components/PostList';
import Sidebar from './components/Sidebar';
import './App.css';  // Add if you want global styles
import Profile from './components/Profile';
import PostDetail from './components/PostDetail';

function DashboardWrapper({ children }) {
  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="dashboard-main">
        {children}
      </div>
    </div>
  );
}

function App() {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/posts" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/post/:id" element={<PostDetail/>} />
        <Route
          path="/posts"
          element={
            isLoggedIn ? (
              <DashboardWrapper>
                <PostList />
              </DashboardWrapper>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
